// src/hooks/use-auth.ts

'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export interface UseAuthReturn {
    // Session data
    user: {
        id: string
        name?: string | null
        email?: string | null
        image?: string | null
    } | null
    session: Session | null

    // Status
    isAuthenticated: boolean
    isLoading: boolean

    // Auth actions
    login: (provider?: string, callbackUrl?: string) => Promise<void>
    logout: (callbackUrl?: string) => Promise<void>

    // Navigation helpers
    redirectToDashboard: () => void
    redirectToHome: () => void
}

/**
 * Custom hook for authentication and session management
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth()
 * 
 *   if (!isAuthenticated) {
 *     return <button onClick={() => login()}>Sign in</button>
 *   }
 * 
 *   return (
 *     <div>
 *       <p>Welcome, {user?.name}</p>
 *       <button onClick={() => logout()}>Sign out</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
    const { data: session, status } = useSession()
    const router = useRouter()

    const isLoading = status === 'loading'
    const isAuthenticated = status === 'authenticated' && !!session?.user

    /**
     * Sign in with OAuth provider
     * @param provider - OAuth provider (default: 'google')
     * @param callbackUrl - URL to redirect after successful sign in
     */
    const login = useCallback(
        async (provider: string = 'google', callbackUrl: string = '/dashboard') => {
            await signIn(provider, { callbackUrl })
        },
        []
    )

    /**
     * Sign out the current user
     * @param callbackUrl - URL to redirect after sign out
     */
    const logout = useCallback(
        async (callbackUrl: string = '/') => {
            await signOut({ callbackUrl })
        },
        []
    )

    /**
     * Redirect to dashboard
     */
    const redirectToDashboard = useCallback(() => {
        router.push('/dashboard')
    }, [router])

    /**
     * Redirect to home page
     */
    const redirectToHome = useCallback(() => {
        router.push('/')
    }, [router])

    return {
        user: session?.user || null,
        session,
        isAuthenticated,
        isLoading,
        login,
        logout,
        redirectToDashboard,
        redirectToHome,
    }
}

// Additional helper hooks

/**
 * Hook that requires authentication
 * Redirects to home if not authenticated
 * 
 * @example
 * ```tsx
 * function ProtectedPage() {
 *   const { user } = useRequireAuth()
 *   // user is guaranteed to be defined here
 *   return <div>Welcome {user.name}</div>
 * }
 * ```
 */
export function useRequireAuth() {
    const auth = useAuth()
    const router = useRouter()

    if (!auth.isLoading && !auth.isAuthenticated) {
        router.push('/')
    }

    return auth
}

/**
 * Hook to check if user has completed onboarding
 * Useful for multi-step setup flows
 * 
 * @example
 * ```tsx
 * function Dashboard() {
 *   const { hasCompletedOnboarding, redirectToOnboarding } = useOnboarding()
 * 
 *   if (!hasCompletedOnboarding) {
 *     redirectToOnboarding()
 *     return null
 *   }
 * 
 *   return <DashboardContent />
 * }
 * ```
 */
export function useOnboarding() {
    const { user, isAuthenticated } = useAuth()
    const router = useRouter()

    // You can extend the user type to include onboarding status
    // For now, we'll check if user has a name set
    const hasCompletedOnboarding = isAuthenticated && !!user?.name

    const redirectToOnboarding = useCallback(() => {
        router.push('/onboarding')
    }, [router])

    return {
        hasCompletedOnboarding,
        redirectToOnboarding,
    }
}