import { NextRequest, NextResponse } from 'next/server'
import { MetaApiClient } from '@/lib/integrations/meta/client'
import { createPost, updateScheduledPost } from '@/lib/db/queries/posts'
import { getUserInstagramAccount } from '@/lib/db/queries/social-accounts'
import { getCurrentUser } from '@/lib/auth/session'


interface PublishRequestBody {
    mediaType: 'image' | 'video'
    mediaUrls: string[]
    caption?: string
    postType: 'single' | 'carousel' | 'reel' | 'story'
}



// Wait for media container to be ready
async function waitForMediaReady(
    client: MetaApiClient,
    containerId: string,
    maxAttempts: number = 20
): Promise<boolean> {
    for (let i = 0; i < maxAttempts; i++) {
        console.log("[Post] Waiting for media to be ready, attempt: ", i)
        const status = await client.getMediaStatus(containerId)

        if (status.status_code === 'FINISHED') {
            return true
        }

        if (status.status_code === 'ERROR') {
            throw new Error('Media processing failed')
        }

        // Wait 3 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 5000))
    }

    throw new Error('Media processing timeout')
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized! User not found" }, { status: 401 })
        }

        const { containerId, scheduledPostId } = await request.json()

        if (!containerId && !scheduledPostId) {
            return NextResponse.json({ error: "Invalid request! Container ID or Scheduled Post Id not found" }, { status: 400 })
        }


        const instagramAccount = await getUserInstagramAccount(user.id)
        if (!instagramAccount || !instagramAccount?.access_token || !instagramAccount.platform_user_id) {
            return NextResponse.json({ error: "Invalid account information, please connect your Instagram account again" }, { status: 400 })
        }

        const metaClient = new MetaApiClient(instagramAccount.access_token);
        const igAccountId = instagramAccount.platform_user_id;

        await waitForMediaReady(metaClient, containerId);
        const publishedMedia = await metaClient.publishMedia(igAccountId, containerId)

        await updateScheduledPost(scheduledPostId, {
            status: 'published',
            published_at: new Date().toISOString(),
        })

        return NextResponse.json({ message: "Content published successfully" }, { status: 200 })

    } catch (error) {
        console.log("Error publishing content: ", error)
        return NextResponse.json({ error: "Error publishing content", data: error }, { status: 500 })
    }

}