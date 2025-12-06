"use client"

import { useState, useEffect } from "react"
import { Megaphone, Check } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"

export default function UserAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAnnouncements()

        const channel = supabase
            .channel('user_announcements')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: "type=eq.broadcast" }, () => fetchAnnouncements())
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const fetchAnnouncements = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .eq('type', 'broadcast') // Filter for broadcasts
            .order('created_at', { ascending: false })

        if (data) setAnnouncements(data)
        setLoading(false)
    }

    const markAsRead = async (id: string) => {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id)

        if (!error) {
            // Optimistic update
            setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a))
        }
    }

    const markAllRead = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('type', 'broadcast')

        if (!error) fetchAnnouncements()
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Megaphone className="text-primary" /> Announcements
                </h1>
                {announcements.some(a => !a.is_read) && (
                    <button
                        onClick={markAllRead}
                        className="text-sm flex items-center gap-2 text-primary hover:text-primary/80 transition"
                    >
                        <Check size={16} /> Mark all as read
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading announcements...</div>
                ) : announcements.length === 0 ? (
                    <div className="glass-card p-12 rounded-2xl text-center text-gray-500 flex flex-col items-center gap-4">
                        <Megaphone size={48} className="opacity-20" />
                        <p>No announcements yet.</p>
                    </div>
                ) : (
                    announcements.map((item) => (
                        <div
                            key={item.id}
                            className={`glass-card p-6 rounded-2xl border transition relative overflow-hidden ${!item.is_read ? 'border-primary/50 bg-primary/5' : 'border-white/10 hover:border-white/20'}`}
                        >
                            {!item.is_read && (
                                <div className="absolute top-0 right-0 p-3">
                                    <span className="bg-primary text-black text-[10px] uppercase font-bold px-2 py-1 rounded-full">New</span>
                                </div>
                            )}

                            <div className="flex gap-6 flex-col md:flex-row">
                                {item.image_url && (
                                    <div className="w-full md:w-64 h-48 rounded-xl overflow-hidden shrink-0 bg-black/20">
                                        <img src={item.image_url} alt="Announcement" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between items-start pr-8">
                                        <h2 className="text-xl font-bold text-white">{item.title}</h2>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed">{item.message}</p>
                                    <div className="pt-2 flex items-center justify-between">
                                        <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(item.created_at))} ago</p>
                                        {!item.is_read && (
                                            <button
                                                onClick={() => markAsRead(item.id)}
                                                className="text-xs text-primary hover:underline hover:text-primary/80"
                                            >
                                                Mark as Read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
