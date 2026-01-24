import { NextRequest, NextResponse } from 'next/server'
import { MetaApiClient } from '@/lib/integrations/meta/client'
import { createPost } from '@/lib/db/queries/posts';
import { getSupabaseAdmin } from '@/lib/supabase/admin'

import { getCurrentUser } from '@/lib/auth/session'


interface PublishRequestBody {
    mediaType: 'image' | 'video'
    mediaUrls: string[]
    caption?: string
    postType: 'single' | 'carousel' | 'reel' | 'story'
}

// Get user's Instagram credentials from database
async function getUserSocialAccountInfo(userId: string) {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
        .from('user_social_accounts')
        .select("access_token, platform_user_id")
        .eq('user_id', userId)
        .eq('platform_id', 3)
        .single()

    if (error || !data) {
        throw new Error('No active Instagram account found for user')
    }

    return data
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

        const body: PublishRequestBody = await request.json()
        const { mediaType, postType, mediaUrls, caption } = body

        if (!mediaType || !mediaUrls || mediaUrls.length === 0) {
            return NextResponse.json({ error: "Invalid request! Media type or media urls not found" }, { status: 400 })
        }

        if (postType === 'carousel' && (mediaUrls.length < 2 || mediaUrls.length > 10)) {
            return NextResponse.json(
                { error: 'Carousel must have 2-10 media items' },
                { status: 400 }
            )
        }

        // if (postType === 'carousel' && mediaUrls.length !== 1) {
        //     return NextResponse.json(
        //         { error: `${postType} posts must have exactly 1 media URL` },
        //         { status: 400 }
        //     )
        // }

        console.log("[Post] Fetching user social account info")
        const instagramAccount = await getUserSocialAccountInfo(user.id)
        console.log("[Post] User social account info fetched successfully")

        if (!instagramAccount || !instagramAccount.access_token || !instagramAccount.platform_user_id) {
            return NextResponse.json({ error: "Invalid account information, please connect your Instagram account again" }, { status: 400 })
        }

        console.log("[Post] Creating a meta client")
        const metaClient = new MetaApiClient(instagramAccount.access_token);
        const igAccountId = instagramAccount.platform_user_id;
        console.log("[Post] Meta client created successfully")

        let post;
        const carouselChildrenIds: string[] = [];

        for (let index = 0; index < mediaUrls.length; index++) {
            const url = mediaUrls[index];
            let containerId: string;
            let publishedMediaId: string;

            switch (mediaType[index]) {
                case 'image':
                    console.log("[Post] Creating a image container")
                    const imageContainer = await metaClient.createImagePostContainer(igAccountId, url, caption, '', postType === 'carousel');
                    console.log("[Post] Image container created successfully")

                    console.log("[Post] Waiting for media to be ready")
                    await waitForMediaReady(metaClient, imageContainer?.id);
                    console.log("[Post] Media is ready")

                    containerId = imageContainer.id;
                    break;
                case 'video':
                    console.log("[Post] Creating a video container")
                    const videoContainer = await metaClient.createVideoPostContainer(
                        igAccountId,
                        url,
                        caption,
                        '',
                        postType === 'reel',
                        postType === 'story',
                        postType === 'carousel'
                    );
                    console.log("[Post] Video container created successfully")

                    console.log("[Post] Waiting for media to be ready")
                    await waitForMediaReady(metaClient, videoContainer?.id);
                    console.log("[Post] Media is ready")

                    containerId = videoContainer.id;
                    break;
                default:
                    return NextResponse.json({ error: "Invalid media type" }, { status: 400 })
            }

            if (!containerId) {
                return NextResponse.json({ error: "Invalid container id" }, { status: 400 })
            }

            if (postType !== 'carousel') {
                const publishedMedia = await metaClient.publishMedia(igAccountId, containerId);
                console.log("[Post] Media published successfully")
                publishedMediaId = publishedMedia.id;

                post = await createPost({
                    userId: user.id,
                    content: caption || '',
                    mediaUrls: [url],
                    mediaType: mediaType[index],
                    publish_status: 'published',
                    platformId: 3,
                    container_id: publishedMediaId.toString(),
                })
            } else {
                carouselChildrenIds.push(containerId)
            }
        }

        if (postType === 'carousel') {
            console.log("[Post] Creating a carousel container", carouselChildrenIds)
            const carouselContainer = await metaClient.createCarouselContainer(igAccountId, carouselChildrenIds, caption)
            console.log("[Post] Carousel container created successfully")

            console.log("[Post] Waiting for media to be ready")
            await waitForMediaReady(metaClient, carouselContainer?.id);
            console.log("[Post] Carousel container is ready")

            console.log("[Post] Publishing media")
            await metaClient.publishMedia(igAccountId, carouselContainer?.id);
            console.log("[Post] Media published successfully")

            post = await createPost({
                userId: user.id,
                content: caption || '',
                mediaUrls: mediaUrls,
                mediaType: mediaType,
                publish_status: 'published',
                platformId: 3,
                container_id: carouselContainer?.id.toString(),
            })
        }

        return NextResponse.json({ message: "Content published successfully", data: post }, { status: 200 })

    } catch (error) {
        console.log("Error publishing content: ", error)
        return NextResponse.json({ error: "Error publishing content", data: error }, { status: 500 })
    }

}