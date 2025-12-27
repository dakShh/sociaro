import { getSupabaseAdmin } from '@/lib/supabase/admin'


export async function getPlatformId(platformName: string) {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
        .from('social_platforms')
        .select('id')
        .eq('name', platformName)
        .single()

    if (error) throw error
    return data.id
}

export async function saveSocialAccount(data: {
    user_id: string
    platform_id: number
    platform_specific_id: string
    account_name: string
    access_token: string
    refresh_token?: string
    token_expires_at?: Date
    profile_picture_url?: string
    account_type?: string,
    platform_user_id: string,
    followers_count?: number,
    follows_count?: number,
    handle: string,
}) {
    const supabase = getSupabaseAdmin()

    // // Get platform ID
    // const platformId = await getPlatformId(data.platform_id)

    const { data: account, error } = await supabase
        .from('user_social_accounts')
        .upsert(
            {
                user_id: data.user_id,
                platform_id: data.platform_id,
                platform_specific_id: data.platform_specific_id,
                account_name: data.account_name,
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                token_expires_at: data.token_expires_at?.toISOString(),
                profile_picture_url: data.profile_picture_url,
                account_type: data.account_type,
                platform_user_id: data.platform_user_id,
                followers_count: data.followers_count,
                follows_count: data.follows_count,
                handle: data.handle,
            },
            {
                onConflict: 'id',
            }
        )
        .select()
        .single()

    if (error) throw error
    return account
}

export async function getUserSocialAccounts(userId: string, platformName?: string) {
    const supabase = getSupabaseAdmin()

    let query = supabase
        .from('user_social_accounts')
        .select(`
      *,
      social_platforms (
        id,
        name,
        icon_url
      )
    `)
        .eq('user_id', userId)

    if (platformName) {
        const platformId = await getPlatformId(platformName)
        query = query.eq('platform_id', platformId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function getSocialAccountById(accountId: string) {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
        .from('user_social_accounts')
        .select(`
      *,
      social_platforms (
        id,
        name,
        base_api_url,
        icon_url
      )
    `)
        .eq('id', accountId)
        .single()

    if (error) throw error
    return data
}

export async function updateSocialAccountToken(
    accountId: string,
    accessToken: string,
    expiresAt?: Date,
    refreshToken?: string
) {
    const supabase = getSupabaseAdmin()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: any = {
        access_token: accessToken,
    }

    if (expiresAt) updates.token_expires_at = expiresAt.toISOString()
    if (refreshToken) updates.refresh_token = refreshToken

    const { data, error } = await supabase
        .from('user_social_accounts')
        .update(updates)
        .eq('id', accountId)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteSocialAccount(accountId: string, userId: string) {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
        .from('user_social_accounts')
        .delete()
        .eq('id', accountId)
        .eq('user_id', userId)

    if (error) throw error
}
