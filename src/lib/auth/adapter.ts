import { getSupabaseAdmin } from '@/lib/supabase/admin'
import type { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from 'next-auth/adapters'

export function SupabaseAdapter(): Adapter {
    const supabase = getSupabaseAdmin()

    return {
        async createUser(user: Omit<AdapterUser, 'id'>) {
            const { data, error } = await supabase
                .from('users')
                .insert({
                    email: user.email,
                    first_name: user.name?.split(' ')[0] || '',
                    last_name: user.name?.split(' ').slice(1).join(' ') || '',
                    name: user.name,
                    image: user.image,
                    email_verified: user.emailVerified?.toISOString() ?? null
                })
                .select()
                .single()

            if (error) throw error

            return {
                id: data.id,
                email: data.email,
                emailVerified: data.email_verified,
                name: data.name || `${data.first_name} ${data.last_name}`.trim(),
                image: data.image,
            } as AdapterUser
        },

        async getUser(id) {
            const { data, error } = await supabase
                .from('users')
                .select()
                .eq('id', id)
                .single()

            if (error) return null

            return {
                id: data.id,
                email: data.email,
                emailVerified: data.email_verified,
                name: data.name || `${data.first_name} ${data.last_name}`.trim(),
                image: data.image,
            } as AdapterUser
        },

        async getUserByEmail(email) {
            const { data, error } = await supabase
                .from('users')
                .select()
                .eq('email', email)
                .single()

            if (error) return null

            return {
                id: data.id,
                email: data.email,
                emailVerified: data.email_verified,
                name: data.name || `${data.first_name} ${data.last_name}`.trim(),
                image: data.image,
            } as AdapterUser
        },

        async getUserByAccount({ providerAccountId, provider }) {
            const { data, error } = await supabase
                .from('accounts')
                .select('user_id, users!inner(*)')
                .eq('provider', provider)
                .eq('provider_account_id', providerAccountId)
                .single()

            if (error) return null

            const user = (data as { users: { id: string; email: string; email_verified: string | null; name: string | null; first_name: string; last_name: string; image: string | null } }).users

            return {
                id: user.id,
                email: user.email,
                emailVerified: user.email_verified,
                name: user.name || `${user.first_name} ${user.last_name}`.trim(),
                image: user.image,
            } as AdapterUser
        },

        async updateUser(user) {
            console.log("Update User param: ", user)
            const updates: {
                email?: string;
                email_verified?: string | null;
                image?: string | null;
                name?: string;
                first_name?: string;
                last_name?: string;
            } = {
                email: user.email ?? undefined,
                email_verified: user.emailVerified?.toISOString() ?? null,
                image: user.image ?? null,
            }

            if (user.name) {
                updates.name = user.name
                const nameParts = user.name.split(' ')
                updates.first_name = nameParts[0]
                updates.last_name = nameParts.slice(1).join(' ') || nameParts[0]
            }

            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single()

            if (error) throw error

            return {
                id: data.id,
                email: data.email,
                emailVerified: data.email_verified,
                name: data.name || `${data.first_name} ${data.last_name}`.trim(),
                image: data.image,
            } as AdapterUser
        },

        async deleteUser(userId) {
            await supabase.from('users').delete().eq('id', userId)
        },

        async linkAccount(account: AdapterAccount) {
            const { data, error } = await supabase
                .from('accounts')
                .insert({
                    user_id: account.userId,
                    type: account.type,
                    provider: account.provider,
                    provider_account_id: account.providerAccountId,
                    refresh_token: account.refresh_token,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    session_state: account.session_state,
                })
                .select()
                .single()

            if (error) throw error

            return {
                userId: data.user_id,
                type: data.type,
                provider: data.provider,
                providerAccountId: data.provider_account_id,
                refresh_token: data.refresh_token,
                access_token: data.access_token,
                expires_at: data.expires_at,
                token_type: data.token_type,
                scope: data.scope,
                id_token: data.id_token,
                session_state: data.session_state,
            } as AdapterAccount
        },

        async unlinkAccount({ providerAccountId, provider }: Pick<AdapterAccount, "provider" | "providerAccountId">) {
            await supabase
                .from('accounts')
                .delete()
                .eq('provider', provider)
                .eq('provider_account_id', providerAccountId)
        },

        async createSession(session) {
            const { data, error } = await supabase
                .from('sessions')
                .insert({
                    session_token: session.sessionToken,
                    user_id: session.userId,
                    expires: session.expires.toISOString(),
                })
                .select()
                .single()

            if (error) throw error

            return {
                sessionToken: data.session_token,
                userId: data.user_id,
                expires: new Date(data.expires),
            } as AdapterSession
        },

        async getSessionAndUser(sessionToken) {
            const { data, error } = await supabase
                .from('sessions')
                .select('*, users!inner(*)')
                .eq('session_token', sessionToken)
                .single()

            if (error) return null

            const user = (data as { users: { id: string; email: string; email_verified: string | null; name: string | null; first_name: string; last_name: string; image: string | null } }).users

            return {
                session: {
                    sessionToken: data.session_token,
                    userId: data.user_id,
                    expires: new Date(data.expires),
                } as AdapterSession,
                user: {
                    id: user.id,
                    email: user.email,
                    emailVerified: user.email_verified,
                    name: user.name || `${user.first_name} ${user.last_name}`.trim(),
                    image: user.image,
                } as AdapterUser,
            }
        },

        async updateSession(session) {
            const { data, error } = await supabase
                .from('sessions')
                .update({
                    expires: session.expires?.toISOString(),
                })
                .eq('session_token', session.sessionToken)
                .select()
                .single()

            if (error) throw error

            return {
                sessionToken: data.session_token,
                userId: data.user_id,
                expires: new Date(data.expires),
            } as AdapterSession
        },

        async deleteSession(sessionToken) {
            await supabase.from('sessions').delete().eq('session_token', sessionToken)
        },

        async createVerificationToken(token) {
            const { data, error } = await supabase
                .from('verification_tokens')
                .insert({
                    identifier: token.identifier,
                    token: token.token,
                    expires: token.expires.toISOString(),
                })
                .select()
                .single()

            if (error) throw error

            return {
                identifier: data.identifier,
                token: data.token,
                expires: new Date(data.expires),
            } as VerificationToken
        },

        async useVerificationToken({ identifier, token }) {
            const { data, error } = await supabase
                .from('verification_tokens')
                .delete()
                .eq('identifier', identifier)
                .eq('token', token)
                .select()
                .single()

            if (error) return null

            return {
                identifier: data.identifier,
                token: data.token,
                expires: new Date(data.expires),
            } as VerificationToken
        },
    }
}