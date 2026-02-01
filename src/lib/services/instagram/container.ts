
interface CreateInstagramMediaContainerParams {
    mediaType: ('image' | 'video')[]
    mediaUrls: string[]
    caption?: string
    postType: 'single' | 'carousel' | 'reel' | 'story'
}

export const createInstagramMediaContainer = async ({ mediaType, mediaUrls, caption, postType }: CreateInstagramMediaContainerParams) => {
    try {
        const mediaContainer = await fetch('/api/platforms/instagram/create-container', {
            method: 'POST',
            body: JSON.stringify({ mediaType, mediaUrls, caption, postType })
        })

        const mediaContainerResponse = await mediaContainer.json();

        if (mediaContainerResponse.status !== 200) {
            throw Error(mediaContainerResponse?.error || '[Instagram] Error creating media container')
        }

        return mediaContainerResponse.data.containerId;
    } catch (error) {
        console.error("[Instagram] Error creating media container", error)
        throw error
    }
}