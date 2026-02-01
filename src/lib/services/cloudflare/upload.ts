
export interface CloudflareUploadResponse {
    success: boolean
    message?: string
    error?: string
    uploaded: CloudflareUploadData[]
    failed: CloudflareUploadData[]
}

export interface CloudflareUploadData {
    url: string
    publicId: string
    fileName: string
    fileType: string
    mediaType: "image" | "video"
    fileSize: number
    success: boolean
    error?: string
}


export async function uploadMediaToCloudflare(
    files: { file: File; previewUrl: string; type: string; id: string }[]
): Promise<{ mediaType: ("image" | "video")[], mediaUrls: string[] }> {

    if (!files || files.length === 0) {
        throw new Error('No files provided for upload')
    }

    const formData = new FormData()
    files.forEach((fileObj) => {
        if (fileObj?.file) {
            formData.append('files', fileObj.file)
        }
    })

    console.log('[Upload] Uploading to Cloudflare...')

    const response = await fetch(`/api/cloudflare/upload`, {
        method: 'POST',
        body: formData
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `Upload failed with status ${response.status}`)
    }

    const cloudflareResponse: CloudflareUploadResponse = await response.json()
    console.log('[Upload] Response received:', cloudflareResponse)

    // Check if any files failed to upload
    if (cloudflareResponse.failed.length > 0) {
        console.warn('[Upload] Some files failed:', cloudflareResponse.failed)

        // If all files failed, throw an error
        if (cloudflareResponse.uploaded.length === 0) {
            const errorMessages = cloudflareResponse.failed
                .map(f => `${f.fileName}: ${f.error}`)
                .join(', ')
            throw new Error(`All uploads failed: ${errorMessages}`)
        }

        // If some succeeded, log warning but continue
        console.warn(`[Upload] ${cloudflareResponse.failed.length} file(s) failed, continuing with ${cloudflareResponse.uploaded.length} successful upload(s)`)
    }

    // Extract mediaType and URLs from successful uploads
    const mediaType = cloudflareResponse.uploaded.map((item) => item.mediaType)
    const mediaUrls = cloudflareResponse.uploaded.map((item) => item.url)

    console.log('[Upload] Media uploaded successfully:', { mediaType, mediaUrls })

    return { mediaType, mediaUrls }
}
