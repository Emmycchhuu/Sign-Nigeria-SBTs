"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, FileText, Settings, LogOut, Box, MessageSquare, Megaphone } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/admin/login")
    }

    const navItems = [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Collection", href: "/admin/collection", icon: Box },
        { name: "Requests", href: "/admin/requests", icon: FileText },
        { name: "Messages", href: "/admin/messages", icon: MessageSquare },
        { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ]

    return (
        <div className="flex flex-col h-full bg-[#050505] backdrop-blur-xl border-r border-white/10 md:border-none">
            <div className="p-6 border-b border-white/10">
                <Link href="/admin">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Admin
                    </h1>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    )
}
