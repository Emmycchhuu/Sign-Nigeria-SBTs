"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export interface Notification {
    id: string
    title: string
    message: string
    read: boolean
    created_at: string
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    // Mock Data for now until Supabase is fully connected
    useEffect(() => {
        const mockNotifications = [
            {
                id: "1",
                title: "Welcome to Signigeria",
                message: "Your journey begins now. Explore the collection.",
                read: false,
                created_at: new Date().toISOString()
            }
        ]
        setNotifications(mockNotifications)
        setUnreadCount(mockNotifications.filter(n => !n.read).length)
    }, [])

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ))
        setUnreadCount(prev => Math.max(0, prev - 1))
    }

    return { notifications, unreadCount, markAsRead }
}
