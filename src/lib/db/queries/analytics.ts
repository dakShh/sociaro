import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function savePostAnalytics(data: {
    scheduledPostId: string
    metricName: string
    metricValue: number
}) {
    const supabase = getSupabaseAdmin()

    const { data: analytics, error } = await supabase
        .from('post_analytics')
        .insert({
            scheduled_post_id: data.scheduledPostId,
            metric_name: data.metricName,
            metric_value: data.metricValue,
            retrieved_at: new Date().toISOString(),
        })
        .select()
        .single()

    if (error) throw error
    return analytics
}

export async function getPostAnalytics(scheduledPostId: string) {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
        .from('post_analytics')
        .select('*')
        .eq('scheduled_post_id', scheduledPostId)
        .order('retrieved_at', { ascending: false })

    if (error) throw error
    return data
}