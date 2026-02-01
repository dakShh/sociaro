import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

export const runtime = 'nodejs'

// Validate environment variables
const validateEnvVars = () => {
    const required = [
        'CLOUDFLARE_R2_ENDPOINT',
        'CLOUDFLARE_R2_ACCESS_KEY_ID',
        'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
        'CLOUDFLARE_R2_BUCKET_NAME',
        'CLOUDFLARE_R2_PUBLIC_URL'
    ]

    const missing = required.filter(key => !process.env[key])
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
}

// Initialize R2 client
let r2Client: S3Client
try {
    validateEnvVars()
    r2Client = new S3Client({
        region: 'auto',
        endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
        credentials: {
            accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
        },
    })
} catch (error) {
    console.error('[Cloudflare] Failed to initialize R2 client:', error)
    throw error
}

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME!
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL!

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/mpeg', 'video/webm']
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]

// Max file sizes (Instagram limits)
const MAX_IMAGE_SIZE = 8 * 1024 * 1024 // 8MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB

interface UploadResult {
    url: string
    publicId: string
    fileName: string
    fileType: string
    mediaType: 'image' | 'video'
    fileSize: number
    success: boolean
    error?: string
}

/**
 * Determines if a file type is a video
 */
const isVideoType = (mimeType: string): boolean => {
    return ALLOWED_VIDEO_TYPES.includes(mimeType)
}

/**
 * Gets simplified media type from MIME type
 */
const getMediaType = (mimeType: string): 'image' | 'video' => {
    return isVideoType(mimeType) ? 'video' : 'image'
}

/**
 * Formats file size for error messages
 */
const formatFileSize = (bytes: number): string => {
    return `${(bytes / (1024 * 1024)).toFixed(2)}MB`
}

export async function POST(request: NextRequest) {
    try {
        console.log('[Cloudflare] Processing upload request')

        // Parse form data
        const formData = await request.formData()
        const files = formData.getAll('files') as File[]

        // Validate files exist
        if (!files || files.length === 0) {
            console.warn('[Cloudflare] No files provided in request')
            return NextResponse.json(
                {
                    success: false,
                    error: 'No files provided. Please select at least one file to upload.'
                },
                { status: 400 }
            )
        }

        console.log(`[Cloudflare] Processing ${files.length} file(s)`)

        // Process all files
        const uploadPromises = files.map(async (file, index): Promise<UploadResult> => {
            const fileNum = index + 1
            console.log(`[Cloudflare] Processing file ${fileNum}/${files.length}: ${file.name} (${file.type}, ${formatFileSize(file.size)})`)

            try {
                // Validate file type
                if (!ALLOWED_TYPES.includes(file.type)) {
                    console.warn(`[Cloudflare] Invalid file type for ${file.name}: ${file.type}`)
                    return {
                        url: '',
                        publicId: '',
                        fileName: file.name,
                        fileType: file.type,
                        mediaType: 'image',
                        fileSize: file.size,
                        success: false,
                        error: `Invalid file type "${file.type}". Allowed types: images (JPEG, PNG, GIF, WebP) and videos (MP4, QuickTime, MPEG, WebM).`,
                    }
                }

                // Validate file size
                const isVideo = isVideoType(file.type)
                const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
                const mediaType = getMediaType(file.type)

                if (file.size > maxSize) {
                    console.warn(`[Cloudflare] File too large: ${file.name} (${formatFileSize(file.size)} > ${formatFileSize(maxSize)})`)
                    return {
                        url: '',
                        publicId: '',
                        fileName: file.name,
                        fileType: file.type,
                        mediaType,
                        fileSize: file.size,
                        success: false,
                        error: `File too large. Maximum size for ${mediaType}s is ${formatFileSize(maxSize)}.`,
                    }
                }

                // Generate unique filename
                const fileExtension = file.name.split('.').pop() || 'bin'
                const publicId = uuidv4()
                const fileName = `${publicId}.${fileExtension}`
                const folder = isVideo ? 'videos' : 'images'
                const key = `instagram/${folder}/${fileName}`

                // Convert file to buffer
                const arrayBuffer = await file.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                console.log(`[Cloudflare] Uploading ${file.name} to R2: ${key}`)

                // Upload to R2
                const uploadCommand = new PutObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: key,
                    Body: buffer,
                    ContentType: file.type,
                    Metadata: {
                        originalName: file.name,
                        uploadedAt: new Date().toISOString(),
                    },
                })

                await r2Client.send(uploadCommand)

                // Construct public URL
                const url = `${PUBLIC_URL}/${key}`
                console.log(`[Cloudflare] Successfully uploaded ${file.name}`)

                return {
                    url,
                    publicId,
                    fileName,
                    fileType: file.type,
                    mediaType,
                    fileSize: file.size,
                    success: true,
                }
            } catch (error) {
                console.error(`[Cloudflare] Error uploading ${file.name}:`, error)
                return {
                    url: '',
                    publicId: '',
                    fileName: file.name,
                    fileType: file.type,
                    mediaType: 'image',
                    fileSize: file.size,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown upload error occurred.',
                }
            }
        })

        const results = await Promise.all(uploadPromises)

        const successfulUploads = results.filter((item) => item.success)
        const failedUploads = results.filter((item) => !item.success)

        console.log(`[Cloudflare] Upload complete: ${successfulUploads.length} succeeded, ${failedUploads.length} failed`)

        // Return appropriate status based on results
        const allSucceeded = failedUploads.length === 0
        const allFailed = successfulUploads.length === 0

        if (allFailed) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'All file uploads failed',
                    uploaded: [],
                    failed: failedUploads,
                },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                success: allSucceeded,
                message: allSucceeded
                    ? `Successfully uploaded ${successfulUploads.length} file(s)`
                    : `Uploaded ${successfulUploads.length} file(s), ${failedUploads.length} failed`,
                uploaded: successfulUploads,
                failed: failedUploads,
            },
            { status: allSucceeded ? 200 : 207 } // 207 = Multi-Status (partial success)
        )

    } catch (error) {
        console.error('[Cloudflare] Unexpected error during upload:', error)

        // Handle specific error types
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid request format. Please ensure you are sending valid form data.'
                },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to upload files to Cloudflare R2. Please try again later.',
                ...(process.env.NODE_ENV === 'development' && {
                    details: error instanceof Error ? error.message : String(error)
                })
            },
            { status: 500 }
        )
    }
}