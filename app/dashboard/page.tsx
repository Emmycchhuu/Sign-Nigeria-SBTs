"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Box, Zap, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/context/auth-context"

export default function DashboardPage() {
    const { user } = useAuth()
    const [recentActivity, setRecentActivity] = useState<any[]>([])

    const [stats, setStats] = useState({
        community: 0,
        minted: 0,
        available: 777
    })

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

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* SBT Status */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6 rounded-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                        <Box size={100} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-lg font-medium text-gray-300 mb-2">My Vault</h3>
                        <div className="text-3xl font-bold text-white mb-4">{user?.sbt ? '1 Artifact' : 'Empty'}</div>
                        <Link href="/dashboard/mint">
                            <button className="flex items-center text-sm text-primary hover:text-primary/80 transition font-semibold">
                                {user?.sbt ? 'View Artifact' : 'Mint your SBT'} <ArrowRight size={16} className="ml-2" />
                            </button>
                        </Link>
                    </div>
                </motion.div>

                {/* Collection Stats */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6 rounded-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                        <Zap size={100} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-lg font-medium text-gray-300 mb-2">Live Availability</h3>
                        <div className="flex items-baseline gap-2">
                            <div className="text-3xl font-bold text-white mb-1">{stats.available}</div>
                            <span className="text-gray-500 text-sm">/ 777 Remaining</span>
                        </div>
                        <p className="text-sm text-primary/80 font-medium">{stats.minted} Already Minted</p>
                    </div>
                </motion.div>

                {/* Community */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6 rounded-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                        <Users size={100} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-lg font-medium text-gray-300 mb-2">Community</h3>
                        <div className="text-3xl font-bold text-white mb-1">{stats.community.toLocaleString()}</div>
                        <p className="text-sm text-gray-500">Sign Believers</p>
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity / Feed */}
            <div className="glass-card p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {recentActivity.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No recent activity</p>
                    ) : (
                        recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition">
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
                                    <p className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
