"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Box, Zap, Users, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [recentActivity, setRecentActivity] = useState<any[]>([])

    const [stats, setStats] = useState({
        community: 0,
        minted: 0,
        available: 777
    })

    useEffect(() => {
        if (user?.role === 'admin') {
            router.push('/admin')
        }
    }, [user, router])

    useEffect(() => {
        const fetchData = async () => {
            // Count Users
            const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })

            // Count Minted SBTs
            const { count: mintedCount } = await supabase.from('sbts').select('*', { count: 'exact', head: true }).eq('status', 'minted')

            setStats({
                community: userCount || 0,
                minted: mintedCount || 0,
                available: 777 - (mintedCount || 0)
            })

            // Fetch Recent Activity
            const { data } = await supabase
                .from('mint_requests')
                .select(`
                    *,
                    profiles (username, full_name, avatar_url),
                    sbts (name)
                `)
                .eq('status', 'approved')
                .order('created_at', { ascending: false })
                .limit(5)

            if (data) setRecentActivity(data)
        }

        fetchData()

        const subscription = supabase
            .channel('dashboard_realtime')
            .on('postgres_changes', { event: '*', schema: 'public' }, fetchData)
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const maskUsername = (name: string) => {
        if (!name) return "User"
        if (name.length <= 3) return name
        return name.substring(0, 3) + "***"
    }

    const percentageMinted = (stats.minted / 777) * 100

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white">
                    Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0] || 'Believer'}</span>
                </h1>
                <p className="text-gray-400">
                    Your cultural heritage is waiting to be secured onchain.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* My Vault Card */}
                <div className="bg-[#111] border border-white/10 p-6 rounded-xl hover:border-white/20 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-white/5 text-primary group-hover:scale-110 transition-transform">
                            <Box size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium">My Vault</h3>
                    <div className="mt-2 text-white">
                        <div className="text-2xl font-bold mb-1">{user?.sbt ? '1 Artifact' : 'Empty'}</div>
                        <Link href="/dashboard/mint" className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 font-medium">
                            {user?.sbt ? 'View Artifact' : 'Mint your SBT'} <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>

                {/* Total Minted Card */}
                <div className="bg-[#111] border border-white/10 p-6 rounded-xl hover:border-white/20 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-white/5 text-secondary group-hover:scale-110 transition-transform">
                            <Zap size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium">Total Minted</h3>
                    <p className="text-2xl font-bold mt-1 text-white">{stats.minted} / 777</p>
                </div>

                {/* Community Card */}
                <div className="bg-[#111] border border-white/10 p-6 rounded-xl hover:border-white/20 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-white/5 text-blue-400 group-hover:scale-110 transition-transform">
                            <Users size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium">Community</h3>
                    <p className="text-2xl font-bold mt-1 text-white">{stats.community.toLocaleString()}</p>
                </div>

                {/* Live Availability Card */}
                <div className="bg-[#111] border border-white/10 p-6 rounded-xl hover:border-white/20 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-lg bg-white/5 text-green-400 group-hover:scale-110 transition-transform">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium">Remaining</h3>
                    <p className="text-2xl font-bold mt-1 text-white">{stats.available}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity / Feed */}
                <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-6 text-white flex items-center gap-2">
                        <Users size={18} className="text-blue-500" />
                        Recent Community Activity
                    </h3>

                    <div className="space-y-4">
                        {recentActivity.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No recent activity</p>
                        ) : (
                            recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {activity.profiles?.avatar_url ? (
                                            <img src={activity.profiles.avatar_url} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            <Users size={18} className="text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white text-sm">
                                            <span className="font-bold text-primary">
                                                {maskUsername(activity.profiles?.username || activity.profiles?.full_name)}
                                            </span>
                                            {" "}minted{" "}
                                            <span className="font-bold text-white">
                                                {activity.sbts?.name || "an SBT"}
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Live Availability Pie/Status (Replicated from Admin) */}
                <div className="bg-[#111] border border-white/10 rounded-xl p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold mb-4 text-white">Live Availability</h3>
                        <p className="text-sm text-gray-400">Real-time tracking of 777 limited SBTs.</p>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-4 py-8 relative">
                        {/* Custom Circular Progress Visualization */}
                        <div className="w-40 h-40 rounded-full border-[12px] border-white/5 flex items-center justify-center relative">
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50" cy="50" r="44"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    className="text-primary"
                                    strokeDasharray="276"
                                    strokeDashoffset={276 - (276 * (stats.minted / 777))}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="text-center z-10">
                                <span className="text-3xl font-bold text-white block">{stats.minted}</span>
                                <span className="text-[10px] text-gray-500 uppercase">Minted</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Available</span>
                            <span className="text-white font-medium">{777 - stats.minted}</span>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                            <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${percentageMinted}%` }} />
                        </div>
                        <p className="text-xs text-right text-primary">{percentageMinted.toFixed(1)}%</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
