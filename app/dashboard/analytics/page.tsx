"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { format, startOfMonth, eachMonthOfInterval, subMonths } from "date-fns"
import { Zap, Users, TrendingUp } from "lucide-react"

export default function AnalyticsPage() {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        community: 0,
        minted: 0,
        remaining: 777
    })
    const [userGrowthData, setUserGrowthData] = useState<any[]>([])
    const [mintGrowthData, setMintGrowthData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Fetch Profiles for User Growth
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('created_at')
                    .order('created_at', { ascending: true })

                // Fetch SBTs for Minting Trends
                const { data: sbts } = await supabase
                    .from('sbts')
                    .select('created_at')
                    .eq('status', 'minted')
                    .order('created_at', { ascending: true })

                if (profiles && sbts) {
                    // Update specific stats
                    setStats({
                        community: profiles.length,
                        minted: sbts.length,
                        remaining: 777 - sbts.length
                    })

                    // Process User Growth (Cumulative)
                    const processedUserGrowth = processGrowthData(profiles, true)
                    setUserGrowthData(processedUserGrowth)

                    // Process Mint Growth (Monthly Volume)
                    const processedMintGrowth = processGrowthData(sbts, false)
                    setMintGrowthData(processedMintGrowth)
                }
            } catch (error) {
                console.error("Error fetching analytics:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchAnalytics()
    }, [])

    const processGrowthData = (data: any[], isCumulative: boolean) => {
        if (!data || data.length === 0) return []

        // Create a map of Month -> Count
        const monthMap = new Map<string, number>()

        // Initialize last 6 months with 0
        const end = new Date()
        const start = subMonths(end, 5) // Last 6 months including current
        const range = eachMonthOfInterval({ start, end })

        range.forEach(date => {
            monthMap.set(format(date, 'MMM'), 0)
        })

        // Fill with data
        data.forEach(item => {
            const date = new Date(item.created_at)
            // Only aggregate if within the last 6 months for this view
            if (date >= start) {
                const monthKey = format(date, 'MMM')
                if (monthMap.has(monthKey)) {
                    monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1)
                }
            }
        })

        // Convert to array
        const result: any[] = []
        let runningTotal = 0

        monthMap.forEach((count, name) => {
            if (isCumulative) {
                runningTotal += count
                result.push({ name, value: runningTotal })
            } else {
                result.push({ name, value: count })
            }
        })

        return result
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh] text-gray-500">
                Loading analytics...
            </div>
        )
    }

    return (
        <div className="space-y-8 p-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Ecosystem Analytics
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Community Growth Chart (Matching Admin Style) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111] border border-white/10 rounded-xl p-6 h-[400px]"
                >
                    <h3 className="font-bold mb-6 text-white flex items-center gap-2">
                        <TrendingUp size={18} className="text-purple-500" />
                        Community Growth
                    </h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={userGrowthData}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
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
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorUsers)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Live Availability Pie/Status (Matching Admin Style) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#111] border border-white/10 rounded-xl p-6 flex flex-col justify-between"
                >
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
                </motion.div>
            </div>

            {/* Minting Volume Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#111] border border-white/10 rounded-xl p-6 h-[400px]"
            >
                <h3 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
                    <Zap size={18} className="text-blue-500" />
                    Monthly Mint Volume
                </h3>
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={mintGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis dataKey="name" stroke="#555" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                        <YAxis stroke="#555" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {mintGrowthData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    )
}
