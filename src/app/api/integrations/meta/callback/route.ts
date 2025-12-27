import { NextRequest, NextResponse } from 'next/server'
import { MetaApiClient } from '@/lib/integrations/meta/client'
import { saveSocialAccount } from '@/lib/db/queries/social-accounts'
import { getCurrentUser } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.redirect(
            new URL('/settings/accounts?error=auth_failed', request.url)
        )
    }
    if (error || !code) {
        return NextResponse.redirect(
            new URL('/settings/accounts?error=auth_failed', request.url)
        )
    }

    try {
        console.log('Received code:', code)
        // Exchange code for short-lived token
        const tokenResponse = await MetaApiClient.exchangeCodeForToken(code)

        console.log('Short-lived token:', tokenResponse)
        // Exchange for long-lived token (60 days)
        const longLivedToken = await MetaApiClient.getLongLivedToken(
            tokenResponse.access_token
        )

        console.log('Long-lived token:', longLivedToken)
        const client = new MetaApiClient(longLivedToken.access_token)

        const igAccountInfo = await client.getInstagramAccountInfo()
        console.log('Instagram account info:', igAccountInfo)

        await saveSocialAccount({
            user_id: user.id,
            platform_id: 3,
            platform_specific_id: igAccountInfo.id,
            account_name: igAccountInfo.name,
            handle: igAccountInfo.username,
            access_token: longLivedToken.access_token,
            token_expires_at: new Date(Date.now() + longLivedToken.expires_in * 1000),
            profile_picture_url: igAccountInfo.profile_picture_url,
            account_type: igAccountInfo?.account_type || '',
            platform_user_id: igAccountInfo?.user_id || '',
            followers_count: igAccountInfo?.followers_count || 0,
            follows_count: igAccountInfo?.follows_count || 0,
        })

        return NextResponse.redirect(
            new URL('https://galvanometrically-apivorous-georgina.ngrok-free.dev/settings', request.url)
        )
    } catch (error) {
        console.error('Meta OAuth error:', error)
        return NextResponse.redirect(
            new URL('https://galvanometrically-apivorous-georgina.ngrok-free.dev/settings?error=connection_failed', request.url)
        )
    }
}