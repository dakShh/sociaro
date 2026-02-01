import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { TablesUpdate } from '@/types/supabase'

export async function createPost(data: {
    userId: string
    content: string
    mediaUrls?: string[]
    mediaType?: string
    publish_status?: string
    platformId: number
    container_id: string
}) {
    const supabase = getSupabaseAdmin()

    const { data: post, error } = await supabase
        .from('posts')
        .insert({
            user_id: data.userId,
            content: data.content,
            media_urls: data.mediaUrls || [],
            media_type: data.mediaType,
            platform_id: data.platformId,
            status: data.publish_status || 'draft',
            container_id: data.container_id,
        })
        .select()
        .single()

    if (error) throw error
    return post
}

export async function createScheduledPost({ user_id, user_social_id, status, caption, scheduled_at, is_carousel, container_id, post_type, mediaUrls }: {
    user_id: string,
    user_social_id: string,
    status: 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled'
    caption: string,
    scheduled_at: string,
    is_carousel: boolean,
    container_id: string,
    post_type: string,
    mediaUrls: string[]
}) {
    const supabase = getSupabaseAdmin()

    const { data: scheduledPost, error } = await supabase
        .from('scheduled_posts')
        .insert({
            user_id,
            user_social_account_id: user_social_id,
            status,
            caption,
            scheduled_at,
            is_carousel,
            container_id,
            created_at: new Date().toString(),
            updated_at: new Date().toString(),
            post_type,
            media_urls: mediaUrls
        })
        .select()
        .single()

    if (error) throw error
    return scheduledPost
}

export async function updateScheduledPost(
    scheduledPostId: string,
    updates: TablesUpdate<'scheduled_posts'>
) {
    const supabase = getSupabaseAdmin()

    // if (updates.publishStatus) updateData.publish_status = updates.publishStatus
    // if (updates.publishedTime) updateData.published_time = updates.publishedTime.toISOString()
    // if (updates.externalPostId) updateData.external_post_id = updates.externalPostId
    // if (updates.errorMessage) updateData.error_message = updates.errorMessage

    const { data, error } = await supabase
        .from('scheduled_posts')
        .update(updates)
        .eq('id', scheduledPostId)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function getUserPosts(userId: string, status?: string) {
    const supabase = getSupabaseAdmin()

    let query = supabase
        .from('posts')
        .select(`
      *,
      scheduled_posts (
        id,
        scheduled_time,
        published_time,
        publish_status,
        external_post_id,
        user_social_accounts (
          id,
          account_name,
          profile_picture_url,
          social_platforms (
            name,
            icon_url
          )
        )
      )
    `)
        .eq('user_id', userId)

    if (status) {
        query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function getPostById(postId: string) {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
        .from('posts')
        .select(`
      *,
      scheduled_posts (
        *,
        user_social_accounts (
          *,
          social_platforms (*)
        )
      )
    `)
        .eq('id', postId)
        .single()

    if (error) throw error
    return data
}

export async function getScheduledPostsToPublish() {
    const supabase = getSupabaseAdmin()
    const now = new Date().toISOString()

    const { data, error } = await supabase
        .from('scheduled_posts')
        .select(`
      *,
      posts (*),
      user_social_accounts (*)
    `)
        .eq('publish_status', 'pending')
        .lte('scheduled_time', now)

    if (error) throw error
    return data
}

export async function updatePostStatus(postId: string, status: string) {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
        .from('posts')
        .update({ status })
        .eq('id', postId)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deletePost(postId: string, userId: string) {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', userId)

    if (error) throw error
}
