"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Users, FileText, Settings, LogOut, Loader2, Box } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import BackgroundEffects from "@/components/ui/background-effects"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, loading } = useAuth()

    useEffect(() => {
        if (!loading) {
            if (!user && pathname !== "/admin/login") {
                router.push("/admin/login")
            } else if (user && user.role !== 'admin' && pathname !== "/admin/login") {
                // If user is logged in but NOT admin, kick them out or show error
                // For now, redirect to login
                router.push("/admin/login")
            }
        }
    }, [user, loading, pathname, router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/admin/login")
    }

    if (pathname === "/admin/login") {
        return <>{children}</>
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        )
    }

    if (!user || user.role !== 'admin') return null

    const navItems = [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Collection", href: "/admin/collection", icon: Box },
        { name: "Requests", href: "/admin/requests", icon: FileText },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ]

    return (
        <div className="min-h-screen bg-black text-white flex relative overflow-hidden">
            <BackgroundEffects />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-[#050505] flex flex-col fixed h-full z-20 backdrop-blur-xl">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Admin
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
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
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    )
}
