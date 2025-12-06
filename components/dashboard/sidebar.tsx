"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import {
    LayoutDashboard,
    Box,
    Grid,
    Zap,
    MessageSquare,
    Settings,
    LogOut,
    BarChart3,
    Megaphone
} from "lucide-react"

const routes = [
    {
        label: "Overview",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
    {
        label: "The Vault",
        icon: Box,
        href: "/profile",
        color: "text-violet-500",
    },
    {
        label: "Analytics",
        icon: BarChart3,
        href: "/dashboard/analytics",
        color: "text-blue-500",
    },
    {
        label: "Collection",
        icon: Grid,
        href: "/dashboard/collection",
        color: "text-pink-700",
    },
    {
        label: "Mint SBT",
        icon: Zap,
        href: "/dashboard/mint",
        color: "text-emerald-500",
    },
    {
        label: "Messages",
        icon: MessageSquare,
        href: "/dashboard/messages",
        color: "text-orange-700",
    },
    {
        label: "Announcements",
        icon: Megaphone,
        href: "/dashboard/announcements",
        color: "text-yellow-500",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/dashboard/settings",
        color: "text-gray-500",
    },
]

export default function Sidebar() {
    const pathname = usePathname()
    const { signOut } = useAuth()
    const [messagesUnread, setMessagesUnread] = React.useState(0)
    const [announcementsUnread, setAnnouncementsUnread] = React.useState(0)

    React.useEffect(() => {
        const fetchUnread = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Count Personal Messages (type != 'broadcast')
            const { count: msgCount } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('is_read', false)
                .neq('type', 'broadcast')

            // Count Announcements (type == 'broadcast')
            const { count: annCount } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('is_read', false)
                .eq('type', 'broadcast')

            setMessagesUnread(msgCount || 0)
            setAnnouncementsUnread(annCount || 0)
        }

        fetchUnread()

        const channel = supabase
            .channel('sidebar_notifications')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => fetchUnread())
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827]/50 backdrop-blur-xl border-r border-white/10 text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="text-2xl font-bold tracking-tighter flex items-center gap-1">
                        <span className="text-white">Signi</span>
                        <span className="text-primary">geria</span>
                    </div>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => {
                        let badgeCount = 0
                        if (route.label === "Messages") badgeCount = messagesUnread
                        if (route.label === "Announcements") badgeCount = announcementsUnread

                        return (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                    pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                    {route.label}
                                    {badgeCount > 0 && (
                                        <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            {badgeCount}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
            <div className="px-3 py-2">
                <button
                    onClick={() => signOut()}
                    className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-red-500 hover:bg-red-500/10 rounded-lg transition text-zinc-400"
                >
                    <div className="flex items-center flex-1">
                        <LogOut className="h-5 w-5 mr-3" />
                        Logout
                    </div>
                </button>
            </div>
        </div>
    )
}
