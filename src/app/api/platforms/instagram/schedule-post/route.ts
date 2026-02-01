import { getCurrentUser } from "@/lib/auth/session";
import { createScheduledPost, updateScheduledPost } from "@/lib/db/queries/posts";
import { getUserInstagramAccount } from "@/lib/db/queries/social-accounts";
import { qstash } from "@/lib/integrations/upstash/queue";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized! User not found" }, { status: 401 })
        }

        const instagramAccount = await getUserInstagramAccount(user.id)

        const body = await request.json();
        const {
            containerId,
            scheduledDateTime,
            postType,
            caption,
            isCarousel,
            mediaUrls
        } = body;

        const schedulePostParams = {
            user_id: user.id,
            user_social_id: instagramAccount.id,
            status: 'scheduled' as 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled',
            caption,
            scheduled_at: scheduledDateTime,
            is_carousel: isCarousel,
            container_id: containerId,
            post_type: postType,
            mediaUrls
        }

        const scheduledPost = await createScheduledPost(schedulePostParams)

        // schedule a job to publish the post
        await scheduleJobWithQStash(containerId, scheduledPost.id, scheduledPost.scheduled_at)

        return Response.json({
            success: true,
            data: scheduledPost,
            message: "Post scheduled successfully!"
        });


    } catch (error) {
        console.log('Error scheduling the post: ', error)
        return Response.json({
            success: false,
            error,
            message: "Error scheduling the post!"
        });

    }
}

async function scheduleJobWithQStash(containerId: string, scheduledPostId: string, scheduledDateTime: string) {
    await qstash.publishJSON({
        url: `${process.env.APP_URL}/api/platform/instagram/publish-content`,
        body: { containerId, scheduledPostId },
        notBefore: Math.floor(new Date(scheduledDateTime).getTime() / 1000), // Unix timestamp in seconds
        retries: 3,
    });
}
