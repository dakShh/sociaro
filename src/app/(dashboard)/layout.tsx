'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/layout/app-sidebar'
import AppTopBar from '@/components/layout/app-topbar'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return (<div>Loading...</div>)
    }

    if (!session) { redirect('/') }

    return <SidebarProvider>
        <AppSidebar />
        <AppTopBar user={session.user} />
        <SidebarTrigger />
        <div className="mt-[64px] py-5">
            {children}
        </div>
    </SidebarProvider>
}