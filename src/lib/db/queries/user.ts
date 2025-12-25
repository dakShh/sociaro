import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function getUserById(userId: string) {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
        .from('users')
        .select('*, roles(*)')
        .eq('id', userId)
        .single()

    if (error) throw error
    return data
}

export async function updateUserProfile(userId: string, updates: {
    first_name?: string
    last_name?: string
    name?: string
    image?: string
}) {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function getUserConnectedAccounts(userId: string) {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId)

    if (error) throw error
    return data
}