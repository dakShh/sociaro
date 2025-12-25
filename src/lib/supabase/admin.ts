import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Singleton instance to avoid creating multiple admin clients
let adminClient: ReturnType<typeof createClient<Database>> | null = null

/**
 * Server-side only - Admin client with service role key
 * This client bypasses Row Level Security (RLS) policies
 * 
 * IMPORTANT: Only use this in server-side code (API routes, server components, server actions)
 * Never expose this client or the service role key to the client side
 */
export function getSupabaseAdmin() {
    if (adminClient) {
        return adminClient
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
    }

    adminClient = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false
            },
            db: {
                schema: 'public'
            }
        }
    )

    return adminClient
}

/**
 * Alternative: Create a new admin client instance (not singleton)
 * Use this if you need a fresh instance for specific operations
 */
export function createSupabaseAdmin() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
    }

    return createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false
            },
            db: {
                schema: 'public'
            }
        }
    )
}