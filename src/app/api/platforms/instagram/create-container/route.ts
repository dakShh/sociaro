import { getCurrentUser } from "@/lib/auth/session";
import { createPost } from "@/lib/db/queries/posts";
import { getUserInstagramAccount } from "@/lib/db/queries/social-accounts";
import { MetaApiClient } from "@/lib/integrations/meta/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // AUTHENTICATION & AUTHORIZATION
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized! User not found" },
                { status: 401 }
            );
        }

        // REQUEST VALIDATION
        const body = await request.json();
        const { mediaType, mediaUrls, caption, postType } = body as {
            mediaType: ('image' | 'video')[]
            mediaUrls: string[]
            caption?: string
            postType: 'single' | 'carousel' | 'reel' | 'story'
        };

        // Validate required fields
        if (!mediaType || !mediaUrls || mediaUrls.length === 0) {
            return NextResponse.json(
                { error: "Invalid request! Media type or media urls not found" },
                { status: 400 }
            );
        }

        // Validate carousel constraints
        if (postType === 'carousel' && (mediaUrls.length < 2 || mediaUrls.length > 10)) {
            return NextResponse.json(
                { error: 'Carousel must have 2-10 media items' },
                { status: 400 }
            );
        }

        // INSTAGRAM ACCOUNT VERIFICATION
        const instagramAccount = await getUserInstagramAccount(user.id);

        if (!instagramAccount?.access_token || !instagramAccount.platform_user_id) {
            return NextResponse.json(
                { error: "Invalid account information, please connect your Instagram account again" },
                { status: 400 }
            );
        }

        const metaClient = new MetaApiClient(instagramAccount.access_token);
        const igAccountId = instagramAccount.platform_user_id;

        // CONTAINER CREATION

        // For carousel posts: create child containers first, then parent container
        // For single posts: create one container directly

        const isCarousel = postType === 'carousel';
        const childContainerIds: string[] = [];
        let finalContainerId: string = '';

        // Create individual media containers
        for (let index = 0; index < mediaUrls.length; index++) {
            const mediaUrl = mediaUrls[index];
            const currentMediaType = mediaType[index];

            console.log(`[Post] Creating ${currentMediaType} container (${index + 1}/${mediaUrls.length})`);

            let containerId: string;

            // Create container based on media type
            if (currentMediaType === 'image') {
                const imageContainer = await metaClient.createImagePostContainer(
                    igAccountId,
                    mediaUrl,
                    caption,
                    '',
                    isCarousel // is_carousel_item flag
                );
                containerId = imageContainer.id;
            } else if (currentMediaType === 'video') {
                const videoContainer = await metaClient.createVideoPostContainer(
                    igAccountId,
                    mediaUrl,
                    caption,
                    '',
                    postType === 'reel',
                    postType === 'story',
                    isCarousel // is_carousel_item flag
                );
                containerId = videoContainer.id;
            } else {
                return NextResponse.json(
                    { error: `Invalid media type: ${currentMediaType}` },
                    { status: 400 }
                );
            }

            // Validate container creation
            if (!containerId) {
                return NextResponse.json(
                    { error: `Failed to create container for media ${index + 1}` },
                    { status: 500 }
                );
            }

            console.log(`[Post] Container created successfully`);

            // Store child container IDs for carousel
            if (isCarousel) {
                childContainerIds.push(containerId);
            } else {
                // For single media posts, this is the final container
                finalContainerId = containerId;
            }
        }

        // CAROUSEL PARENT CONTAINER (if needed)
        if (isCarousel) {
            console.log(`[Post] Creating carousel parent container with ${childContainerIds.length} children`);

            const carouselContainer = await metaClient.createCarouselContainer(
                igAccountId,
                childContainerIds,
                caption
            );

            if (!carouselContainer?.id) {
                return NextResponse.json(
                    { error: "Failed to create carousel parent container" },
                    { status: 500 }
                );
            }

            finalContainerId = carouselContainer.id;
            console.log(`[Post] Carousel parent container created: ${finalContainerId}`);
        }

        console.log(`[Post] Post saved to database with container ID`);

        // SUCCESS RESPONSE
        return NextResponse.json(
            {
                message: "Container created successfully",
                data: {
                    containerId: finalContainerId
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("[Post] Error creating container:", error);
        return NextResponse.json(
            {
                error: 'Failed to create container',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}