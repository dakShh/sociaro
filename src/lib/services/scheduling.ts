interface SchedulePostsParams {
    caption: string;
    scheduled_at: string;
    isCarousel: boolean;
    containerId: string;
    postType: string;
    mediaUrls: string[];
}

export const schedulePost = async (data: SchedulePostsParams) => {
    try {
        const response = await fetch('/api/platforms/instagram/schedule-post', {
            method: 'POST',
            body: JSON.stringify(data)
        })
        const responseData = await response.json()

        return {
            status: true,
            data: responseData
        }

    } catch (error) {
        console.error("[Instagram] Error creating media container", error)
        throw error
    }
}

