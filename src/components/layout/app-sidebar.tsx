'use client'

import { BarChart3, Calendar, Clock, Inbox, LayoutDashboard, PenSquare, Settings, Zap } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import Link from "next/link"

// Menu items.
const items = [
    { title: 'Dashboard', icon: LayoutDashboard, url: '/dashboard' },
    { title: 'Compose', icon: PenSquare, url: '/compose' },
    { title: 'Calendar', icon: Calendar, url: '/calendar' },
    { title: 'Scheduled', icon: Clock, url: '/scheduled' },
    { title: 'Analytics', icon: BarChart3, url: '/analytics' },
    { title: 'Inbox', icon: Inbox, url: '/inbox' },
    { title: 'Settings', icon: Settings, url: '/settings' },
]

export default function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="mt-2 mb-6">
                        <div className="flex items-center gap-3 ">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                                <Zap className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-semibold">SocialFlow</span>
                        </div>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = pathname === item.url
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={cn(
                                                isActive && "bg-primary font-bold text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground transition-colors"
                                            )}
                                        >
                                            <Link href={item.url}>
                                                <item.icon className="w-10 h-10" />
                                                <span className="">{item.title}</span>
                                            </Link>
                                            {/* <a href={item.url}>
                                                <item.icon className="w-10 h-10" />
                                                <span className="">{item.title}</span>
                                            </a> */}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}