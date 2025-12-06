"use client"

import { useState, useEffect } from "react"
import { Bell, Search, Megaphone, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"

export default function AdminMessagesPage() {
    const [notifications, setNotifications] = useState<any[]>([])
    const [publicActivity, setPublicActivity] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState<'personal' | 'broadcast'>('personal')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNotifications()
        fetchPublicActivity()

        // Realtime Subscription
        const channel = supabase
            .channel('admin_messages')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => fetchNotifications())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'public_activity' }, () => fetchPublicActivity())
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const fetchNotifications = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (data) setNotifications(data)
        setLoading(false)
    }

    const fetchPublicActivity = async () => {
        const { data } = await supabase
            .from('public_activity')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20)

        if (data) setPublicActivity(data)
    }

    const markAllRead = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false)

        if (!error) fetchNotifications()
    }

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Message Center</h1>
                <div className="flex gap-2">
                    <Button
                        variant={activeTab === 'personal' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('personal')}
                        className={activeTab === 'personal' ? 'bg-primary text-black' : ''}
                    >
                        <Bell size={16} className="mr-2" /> Notifications
                    </Button>
                </div>
            </div>

            {activeTab === 'personal' && (
                <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h2 className="font-bold flex items-center gap-2">
                            <Bell size={16} className="text-primary" /> My Notifications
                        </h2>
                        <Button size="sm" variant="ghost" onClick={markAllRead} className="text-xs text-gray-400 hover:text-white">
                            <Check size={14} className="mr-1" /> Mark all read
                        </Button>
                    </div>
                    <div className="divide-y divide-white/10">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading messages...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
                                <Bell size={40} className="opacity-20" />
                                <p>No new notifications</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div key={notif.id} className={`p-4 hover:bg-white/5 transition flex gap-4 ${!notif.is_read ? 'bg-primary/5' : ''}`}>
                                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!notif.is_read ? 'bg-primary' : 'bg-transparent'}`} />
                                    <div className="flex-1">
                                        <h3 className={`text-sm font-medium ${!notif.is_read ? 'text-white' : 'text-gray-400'}`}>
                                            {notif.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">{notif.message}</p>
                                        <p className="text-xs text-gray-600 mt-2">{formatDistanceToNow(new Date(notif.created_at))} ago</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

        </div>
    )
}
