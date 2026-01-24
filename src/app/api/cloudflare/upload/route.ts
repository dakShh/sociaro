import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

export const runtime = 'nodejs';
const r2Client = new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    },
})

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME!
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/mpeg', 'video/webm']
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]

// Max file sizes (Instagram limits)
const MAX_IMAGE_SIZE = 8 * 1024 * 1024 // 8MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB

export async function POST(request: NextRequest) {
    try {

        // Parse form data
        const formData = await request.formData()

        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        const uploadPromises = files.map(async (file) => {
            console.log("uploading file: ", file.name)
            try {
                // Validate file type
                if (!ALLOWED_TYPES.includes(file.type)) {
                    return {
                        url: '',
                        publicId: '',
                        fileName: '',
                        fileType: '',
                        fileSize: 0,
                        success: false,
                        error: 'server/ Invalid file type. Only images and videos are allowed.',
                    }
                }



                // Validate file size
                const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)
                const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE

                if (file.size > maxSize) {
                    return {
                        url: '',
                        publicId: '',
                        fileName: '',
                        fileType: '',
                        fileSize: 0,
                        success: false,
                        error: `server/ File too large. Max size is ${maxSize / (1024 * 1024)}MB for ${isVideo ? 'videos' : 'images'}`,
                    }
                }

                // Generate unique filename
                const fileExtension = file.name.split('.').pop()
                const publicId = uuidv4()
                const fileName = `${publicId}.${fileExtension}`
                const folder = isVideo ? 'videos' : 'images'
                const key = `instagram/${folder}/${fileName}`

                // Convert file to buffer
                const arrayBuffer = await file.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                // Upload to R2
                const uploadCommand = new PutObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: key,
                    Body: buffer,
                    ContentType: file.type,
                    // Optional: Add metadata
                    Metadata: {
                        originalName: file.name,
                        uploadedAt: new Date().toISOString(),
                    },
                })

                await r2Client.send(uploadCommand)

                // Construct public URL
                const url = `${PUBLIC_URL}/${key}`
                return {
                    url,
                    publicId,
                    fileName,
                    fileType: file.type,
                    fileSize: file.size,
                    success: true,
                }
            } catch (error) {
                return {
                    url: '',
                    publicId: '',
                    fileName: '',
                    fileType: '',
                    fileSize: 0,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown upload error',
                }
            }
        })

        const response = await Promise.all(uploadPromises)

        const successfulUploads = response.filter((item) => item.success)
        const failedUploads = response.filter((item) => !item.success)


        return NextResponse.json({
            success: true,
            uploaded: successfulUploads,
            failed: failedUploads,
            data: response.map((item) => item.url),
        })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'server/ Failed to upload file to cloudflare' }, { status: 500 })
    }


}