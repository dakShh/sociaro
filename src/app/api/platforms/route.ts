import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { createSupabaseAdmin } from '@/lib/supabase/admin';

export async function GET() {

    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createSupabaseAdmin()
    const userId = user.id;

    const { data: platforms, error: platformError } = await supabase.from('social_platforms').select();
    if (platformError) return NextResponse.json({ error: 'Failed to fetch platforms' }, { status: 500 })

    const { data: accounts, error: accountError } = await supabase.from('user_social_accounts').select().eq('user_id', userId);
    if (accountError) return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 })

    const result = platforms!.map((p) => {
        const connected = accounts.find((a) => a.platform_id === p.id);
        return {
            platform_id: p.id,
            name: p.name,
            display_name: p.display_name,
            connected: !!connected,
            account: connected || null,
        };
    });
    return NextResponse.json(result)
}