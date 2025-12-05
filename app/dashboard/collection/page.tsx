"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Lock } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

export default function CollectionPage() {
    const [filter, setFilter] = useState<'all' | 'minted' | 'available'>('all')
    const [items, setItems] = useState<any[]>([])

    useEffect(() => {
        const fetchItems = async () => {
            const { data } = await supabase
                .from('sbts')
                .select('*')
                .order('id', { ascending: true })

            if (data) setItems(data)
        }

        fetchItems()

        const channel = supabase
            .channel('sbts_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'sbts' }, () => {
                fetchItems()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const filteredItems = items.filter(item => {
        if (filter === 'all') return true
        return item.status === filter
    })

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">The Collection</h1>
                    <p className="text-gray-400">Explore the 777 cultural artifacts of Signigeria.</p>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search ID..."
                            className="pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-primary/50 outline-none w-40 md:w-64 transition-all"
                        />
                    </div>
                    <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-4">
                {['all', 'minted', 'available'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === tab
                            ? 'bg-white/10 text-white'
                            : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group relative aspect-[3/4] rounded-xl border transition-all duration-300 overflow-hidden ${item.status === 'minted'
                            ? 'bg-gradient-to-br from-gray-900 to-black border-white/20 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20'
                            : 'bg-black/40 border-white/5 opacity-60'
                            }`}
                    >
                        {/* Card Content */}
                        <div className="absolute inset-0 flex flex-col justify-between">

                            {/* Image or Placeholder */}
                            <div className="absolute inset-0 bg-black/50">
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                        {item.status === 'minted' ? (
                                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-3xl">🦁</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-700 text-4xl opacity-20">?</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Top Right: Minter Username (if minted) */}
                            {item.status === 'minted' && item.owner && (
                                <div className="absolute top-2 right-2 z-10">
                                    <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-primary to-secondary" />
                                        <p className="text-[10px] text-white font-mono truncate max-w-[80px]">{item.owner}</p>
                                    </div>
                                </div>
                            )}

                            {/* Bottom: Name & Number */}
                            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
                                <h3 className="text-white font-bold text-sm truncate">{item.name}</h3>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-xs text-primary font-mono">#{String(item.id).padStart(3, '0')}</p>
                                    {item.status === 'available' && (
                                        <div className="flex items-center gap-1 text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-full border border-white/10">
                                            <Lock size={10} />
                                            <span>Locked</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
