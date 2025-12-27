import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function createPost(data: {
    userId: string
    title?: string
    content: string
    mediaUrls?: string[]
    mediaType?: string
    status?: string
}) {
    const supabase = getSupabaseAdmin()

    const { data: post, error } = await supabase
        .from('posts')
        .insert({
            user_id: data.userId,
            title: data.title,
            content: data.content,
            media_urls: data.mediaUrls || [],
            media_type: data.mediaType,
            status: data.status || 'draft',
        })
        .select()
        .single()

    if (error) throw error
    return post
}

export async function createScheduledPost(data: {
    postId: string
    socialAccountId: string
    scheduledTime: Date
}) {
    const supabase = getSupabaseAdmin()

    const { data: scheduledPost, error } = await supabase
        .from('scheduled_posts')
        .insert({
            post_id: data.postId,
            social_account_id: data.socialAccountId,
            scheduled_time: data.scheduledTime.toISOString(),
            publish_status: 'pending',
        })
        .select()
        .single()

    if (error) throw error
    return scheduledPost
}

export async function updateScheduledPost(
    scheduledPostId: string,
    updates: {
        publishStatus?: string
        publishedTime?: Date
        externalPostId?: string
        errorMessage?: string
    }
) {
    const supabase = getSupabaseAdmin()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {}

    if (updates.publishStatus) updateData.publish_status = updates.publishStatus
    if (updates.publishedTime) updateData.published_time = updates.publishedTime.toISOString()
    if (updates.externalPostId) updateData.external_post_id = updates.externalPostId
    if (updates.errorMessage) updateData.error_message = updates.errorMessage

    const { data, error } = await supabase
        .from('scheduled_posts')
        .update(updateData)
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
