interface MetaTokenResponse {
    access_token: string
    token_type: string
    expires_in: number
}

interface InstagramAccount {
    id: string
    username: string
    name: string
    profile_picture_url: string
    account_type: 'BUSINESS' | 'CREATOR' | 'PERSONAL'
}

export class MetaApiClient {
    private baseUrl = 'https://graph.instagram.com/v24.0'
    private accessToken: string

    constructor(accessToken: string) {
        this.accessToken = accessToken
    }

    /**
     * Exchange authorization code for access token
     */
    static async exchangeCodeForToken(code: string): Promise<MetaTokenResponse> {
        const formData = new FormData();
        formData.append('client_id', process.env.META_CLIENT_ID!);
        formData.append('client_secret', process.env.META_APP_SECRET!);
        formData.append('grant_type', 'authorization_code');
        formData.append('redirect_uri', process.env.META_REDIRECT_URI!);
        formData.append('code', code);

        const response = await fetch('https://api.instagram.com/oauth/access_token', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to exchange code for token')
        }

        return response.json()
    }

    /**
     * Get long-lived access token (60 days)
     */
    static async getLongLivedToken(shortToken: string): Promise<MetaTokenResponse> {
        const params = new URLSearchParams({
            grant_type: 'ig_exchange_token',
            client_secret: process.env.META_APP_SECRET!,
            access_token: shortToken,
        })

        const response = await fetch(
            `https://graph.instagram.com/access_token?${params}`,
            { method: 'GET' }
        )
        if (!response.ok) {
            throw new Error('Failed to get long-lived token')
        }

        return response.json()
    }

    /**
     * Get user's Facebook pages
     */
    async getPages() {
        const response = await fetch(
            `${this.baseUrl}/me/accounts?access_token=${this.accessToken}`
        )

        if (!response.ok) {
            throw new Error('Failed to fetch pages')
        }

        const data = await response.json()
        return data.data
    }

    /**
     * Get Instagram Business Account connected to a Facebook Page
     */
    async getInstagramAccount(pageId: string): Promise<InstagramAccount | null> {
        const response = await fetch(
            `${this.baseUrl}/${pageId}?fields=instagram_business_account{id,username,name,profile_picture_url,account_type}&access_token=${this.accessToken}`
        )

        if (!response.ok) {
            return null
        }

        const data = await response.json()
        return data.instagram_business_account || null
    }

    /**
     * Create Instagram image post container
     */
    async createImagePostContainer(
        igAccountId: string,
        imageUrl: string,
        caption?: string
    ) {
        const params = new URLSearchParams({
            image_url: imageUrl,
            caption: caption || '',
            access_token: this.accessToken,
        })

        const response = await fetch(
            `${this.baseUrl}/${igAccountId}/media?${params}`,
            { method: 'POST' }
        )

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Failed to create post container')
        }

        return response.json()
    }

    /**
     * Create Instagram video/reel container
     */
    async createVideoPostContainer(
        igAccountId: string,
        videoUrl: string,
        caption?: string,
        isReel: boolean = false
    ) {
        const params = new URLSearchParams({
            media_type: isReel ? 'REELS' : 'VIDEO',
            video_url: videoUrl,
            caption: caption || '',
            access_token: this.accessToken,
        })

        const response = await fetch(
            `${this.baseUrl}/${igAccountId}/media?${params}`,
            { method: 'POST' }
        )

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Failed to create video container')
        }

        return response.json()
    }

    /**
     * Create carousel post container
     */
    async createCarouselContainer(
        igAccountId: string,
        childrenIds: string[],
        caption?: string
    ) {
        const params = new URLSearchParams({
            media_type: 'CAROUSEL',
            children: childrenIds.join(','),
            caption: caption || '',
            access_token: this.accessToken,
        })

        const response = await fetch(
            `${this.baseUrl}/${igAccountId}/media?${params}`,
            { method: 'POST' }
        )

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Failed to create carousel container')
        }

        return response.json()
    }

    /**
     * Publish media container
     */
    async publishMedia(igAccountId: string, creationId: string) {
        const params = new URLSearchParams({
            creation_id: creationId,
            access_token: this.accessToken,
        })

        const response = await fetch(
            `${this.baseUrl}/${igAccountId}/media_publish?${params}`,
            { method: 'POST' }
        )

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Failed to publish media')
        }

        return response.json()
    }

    /**
     * Get media status (to check if ready to publish)
     */
    async getMediaStatus(containerId: string) {
        const response = await fetch(
            `${this.baseUrl}/${containerId}?fields=status_code&access_token=${this.accessToken}`
        )

        if (!response.ok) {
            throw new Error('Failed to get media status')
        }

        return response.json()
    }

    /**
     * Create Instagram Story
     */
    async createStory(
        igAccountId: string,
        mediaUrl: string,
        mediaType: 'IMAGE' | 'VIDEO'
    ) {
        const params = new URLSearchParams({
            media_type: 'STORIES',
            [mediaType === 'IMAGE' ? 'image_url' : 'video_url']: mediaUrl,
            access_token: this.accessToken,
        })

        const response = await fetch(
            `${this.baseUrl}/${igAccountId}/media?${params}`,
            { method: 'POST' }
        )

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Failed to create story')
        }

        const data = await response.json()

        // Publish immediately
        return this.publishMedia(igAccountId, data.id)
    }

    async getInstagramAccountInfo() {
        const params = new URLSearchParams({
            fields: 'id,user_id,username,name,profile_picture_url,account_type,followers_count,media_count,follows_count',
            access_token: this.accessToken,
        })

        const response = await fetch(
            `${this.baseUrl}/me?${params}`,
            { method: 'GET' }
        )

        if (!response.ok) {
            throw new Error('Failed to get Instagram account info')
        }

        return response.json()
    }
}