"use client"

import MobileSidebar from "@/components/dashboard/mobile-sidebar"
import { Bell, User, Check } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useNotifications } from "@/hooks/useNotifications"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
    const { user } = useAuth()
    const { notifications, unreadCount, markAsRead } = useNotifications()

    return (
        <div className="flex items-center p-4">
            <MobileSidebar />
            <div className="flex w-full justify-end gap-x-4 items-center">

                {/* Notification Bell */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition text-white relative outline-none">
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black" />
                            )}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 bg-[#111] border-white/10 text-white">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/10" />
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                                No notifications
                            </div>
                        ) : (
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.map((notification) => (
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className={`p-3 cursor-pointer focus:bg-white/5 ${!notification.read ? 'bg-white/5' : ''}`}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div className="flex gap-3 items-start w-full">
                                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.read ? 'bg-primary' : 'bg-transparent'}`} />
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">{notification.title}</p>
                                                <p className="text-xs text-gray-400 leading-snug">
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-gray-600">
                                                    {new Date(notification.created_at).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            {notification.read && <Check size={14} className="text-gray-600" />}
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </div>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Profile */}
                <div className="flex items-center gap-x-3 p-2 rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center overflow-hidden">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-black font-bold text-xs">{user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || <User size={16} />}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
