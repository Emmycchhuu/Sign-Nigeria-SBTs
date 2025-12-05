"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Box,
    Grid,
    Zap,
    MessageSquare,
    Settings,
    LogOut,
    BarChart3
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
        label: "Settings",
        icon: Settings,
        href: "/dashboard/settings",
        color: "text-gray-500",
    },
]

export default function Sidebar() {
    const pathname = usePathname()
    const { signOut } = useAuth()

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827]/50 backdrop-blur-xl border-r border-white/10 text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <img src="/placeholder-logo.svg" alt="Signigeria Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        Signi<span className="text-primary">geria</span>
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
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
                            </div>
                        </Link>
                    ))}
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
