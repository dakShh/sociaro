import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'

export async function GET() {
    const user = await getCurrentUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const authUrl = new URL('https://www.instagram.com/oauth/authorize')
    authUrl.searchParams.set('force_reauth', 'true')
    authUrl.searchParams.set('client_id', process.env.META_CLIENT_ID!)
    authUrl.searchParams.set('redirect_uri', process.env.META_REDIRECT_URI!)
    authUrl.searchParams.set('response_type', 'code')

    authUrl.searchParams.set('scope', [
        'instagram_business_basic',
        'instagram_business_manage_messages',
        'instagram_business_manage_comments',
        'instagram_business_content_publish',
        'instagram_business_manage_insights',
    ].join(','))

    return NextResponse.redirect(authUrl.toString())
}
