import { signOut } from 'next-auth/react'

export async function signOutWithGoogle() {
    try {
        await signOut()
    } catch (error) {
        console.error('Error signing out with Google:', error)
    }
}
