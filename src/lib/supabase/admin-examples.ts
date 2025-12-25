/**
 * Example usage of Supabase Admin Client
 * 
 * This file demonstrates how to use the admin client to bypass RLS
 * and perform privileged operations on your Supabase database.
 */

import { getSupabaseAdmin, createSupabaseAdmin } from '@/lib/supabase/admin'

// Example 1: Using the singleton admin client (recommended for most cases)
export async function getAllUsers() {
    const admin = getSupabaseAdmin()

    // This query bypasses RLS and can read all users
    const { data, error } = await admin
        .from('users')
        .select('*')

    if (error) {
        console.error('Error fetching users:', error)
        return null
    }

    return data
}

// Example 2: Create a user with admin privileges
export async function createUserAsAdmin(email: string, name: string) {
    const admin = getSupabaseAdmin()

    const { data, error } = await admin
        .from('users')
        .insert({
            email,
            name,
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' ')
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating user:', error)
        return null
    }

    return data
}

// Example 3: Update any user's data (bypassing RLS)
export async function updateUserAsAdmin(userId: string, updates: {
    email?: string
    name?: string
    first_name?: string
    last_name?: string
}) {
    const admin = getSupabaseAdmin()

    const { data, error } = await admin
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

    if (error) {
        console.error('Error updating user:', error)
        return null
    }

    return data
}

// Example 4: Delete any user (bypassing RLS)
export async function deleteUserAsAdmin(userId: string) {
    const admin = getSupabaseAdmin()

    // First delete related records
    await admin.from('sessions').delete().eq('user_id', userId)
    await admin.from('accounts').delete().eq('user_id', userId)

    // Then delete the user
    const { error } = await admin
        .from('users')
        .delete()
        .eq('id', userId)

    if (error) {
        console.error('Error deleting user:', error)
        return false
    }

    return true
}

// Example 5: Using createSupabaseAdmin for a fresh instance
export async function performBatchOperation() {
    // Use a fresh instance if you need isolation
    const admin = createSupabaseAdmin()

    const { data, error } = await admin
        .from('users')
        .select('id, email')
        .limit(100)

    if (error) {
        console.error('Error in batch operation:', error)
        return null
    }

    return data
}

// Example 6: Execute raw SQL queries (admin only)
// export async function executeRawSQL(query: string) {
//     const admin = getSupabaseAdmin()

//     // Note: For raw SQL, you might need to use the REST API or RPC functions
//     // This is just an example of how you might structure it
//     const { data, error } = await admin.rpc('execute_sql', { query })

//     if (error) {
//         console.error('Error executing SQL:', error)
//         return null
//     }

//     return data
// }
