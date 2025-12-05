"use client"

import { useState, useEffect } from "react"
import { Users, Zap, TrendingUp, DollarSign } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { format, subMonths, eachMonthOfInterval } from "date-fns"

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        minted: 0,
        users: 0,
        pending: 0,
        revenue: 0
    })
    const [userGrowthData, setUserGrowthData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Stats
                const { count: mintedCount } = await supabase.from('sbts').select('*', { count: 'exact', head: true }).eq('status', 'minted')
                const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
                const { count: pendingCount } = await supabase.from('mint_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending')

                setStats({
                    minted: mintedCount || 0,
                    users: userCount || 0,
                    pending: pendingCount || 0,
                    revenue: (mintedCount || 0) * 2000
                })

                // Fetch Profiles for Chart
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('created_at')
                    .order('created_at', { ascending: true })

                if (profiles) {
                    const chartData = processGrowthData(profiles)
                    setUserGrowthData(chartData)
                }

            } catch (error) {
                console.error("Error fetching admin data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()

        // Realtime Subscription
        const channel = supabase
            .channel('admin_dashboard')
            .on('postgres_changes', { event: '*', schema: 'public' }, () => fetchData())
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [])

    const processGrowthData = (data: any[]) => {
        if (!data.length) return []

        const monthMap = new Map<string, number>()
        const end = new Date()
        const start = subMonths(end, 5)
        const range = eachMonthOfInterval({ start, end })

        range.forEach(date => monthMap.set(format(date, 'MMM'), 0))

        data.forEach(item => {
            const date = new Date(item.created_at)
            if (date >= start) {
                const monthKey = format(date, 'MMM')
                if (monthMap.has(monthKey)) {
                    monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1)
                }
            }
        })

        // Cumulative Growth
        const result: any[] = []
        let runningTotal = 0
        monthMap.forEach((count, name) => {
            runningTotal += count
            result.push({ name, value: runningTotal })
        })
        return result
    }

    const statCards = [
        { label: "Total Minted", value: `${stats.minted} / 777`, icon: Zap, color: "text-primary" },
        { label: "Active Users", value: stats.users.toLocaleString(), icon: Users, color: "text-blue-400" },
        { label: "Pending Requests", value: stats.pending.toString(), icon: TrendingUp, color: "text-orange-400" },
        { label: "Total Revenue", value: `${stats.revenue.toLocaleString()} 🍊`, icon: DollarSign, color: "text-green-400" },
    ]

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Dashboard Overview
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <div key={index} className="bg-[#111] border border-white/10 p-6 rounded-xl hover:border-white/20 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
                            <p className="text-2xl font-bold mt-1 text-white">{stat.value}</p>
                        </div>
                    )
                })}
            </div>

            {/* Analytics Section */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Growth Chart */}
                <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-xl p-6 h-[400px]">
                    <h3 className="font-bold mb-6 text-white flex items-center gap-2">
                        <TrendingUp size={18} className="text-green-500" />
                        User Registration Growth
                    </h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={userGrowthData}>
                            <defs>
                                <linearGradient id="colorAdminUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                            <XAxis dataKey="name" stroke="#555" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                            <YAxis stroke="#555" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', borderColor: '#333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAdminUsers)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Live Availability Pie/Status */}
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
                            <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${(stats.minted / 777) * 100}%` }} />
                        </div>
                        <p className="text-xs text-right text-primary">{((stats.minted / 777) * 100).toFixed(1)}%</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
