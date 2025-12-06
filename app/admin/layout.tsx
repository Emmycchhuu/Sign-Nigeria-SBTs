"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Users, FileText, Settings, LogOut, Loader2, Box } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import BackgroundEffects from "@/components/ui/background-effects"
import AdminSidebar from "@/components/admin/admin-sidebar"
import MobileAdminSidebar from "@/components/admin/mobile-admin-sidebar"

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

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 h-full flex-col fixed inset-y-0 z-50">
                <div className="h-full border-r border-white/10 bg-[#050505] backdrop-blur-xl">
                    <AdminSidebar />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8">
                <div className="md:hidden flex items-center mb-6">
                    <MobileAdminSidebar />
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Admin Dashboard
                    </h1>
                </div>
                {children}
            </main>
        </div>
    )
}
