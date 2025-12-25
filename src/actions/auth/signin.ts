import { signIn } from 'next-auth/react'

/**
 * Client-side function to initiate Google OAuth sign-in
 * This must be called from a client component
 */
export async function signInWithGoogle() {
    try {
        // signIn from next-auth/react handles the redirect automatically
        // When redirect is true (default), it will redirect to the OAuth provider
        await signIn('google', {
            callbackUrl: '/dashboard',
        })
    } catch (error) {
        console.error('Unexpected error signing in with Google:', error)
        throw error
    }
}
