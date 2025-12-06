"use client"

import { useState, useEffect } from "react"
import { Search, MoreVertical, Shield, User } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            const { data } = await supabase
                .from('profiles')
                .select(`
                    *,
                    sbts (name, id)
                `)
                .order('created_at', { ascending: false })

            if (data) setUsers(data)
            setLoading(false)
        }

        fetchUsers()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">User Management</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 rounded-xl bg-[#111] border border-white/10 text-white focus:border-primary/50 outline-none w-64"
                    />
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-[#111] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400 font-medium">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">IP Address</th>
                            <th className="p-4">SBT Owned</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">Loading users...</td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">No users found</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                                                {user.avatar_url ? (
                                                    <img src={user.avatar_url} alt="User" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={14} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{user.full_name || user.email}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400 font-mono text-xs">
                                        {user.ip_address || 'Unknown'}
                                    </td>
                                    <td className="p-4 font-mono text-primary">
                                        {user.sbts && user.sbts.length > 0
                                            ? user.sbts[0].name
                                            : "None"}
                                    </td>
                                    <td className="p-4 text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 hover:bg-white/10 rounded-lg transition">
                                            <MoreVertical size={16} className="text-gray-500" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {loading ? (
                    <div className="p-8 text-center text-gray-500 bg-[#111] border border-white/10 rounded-xl">
                        Loading users...
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 bg-[#111] border border-white/10 rounded-xl">
                        No users found
                    </div>
                ) : (
                    users.map((user) => (
                        <div key={user.id} className="bg-[#111] border border-white/10 rounded-xl p-4 space-y-4">
                            {/* Header: Avatar, Name, Role */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={16} />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">{user.full_name || user.email}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {user.role || 'user'}
                                </span>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Joined</p>
                                    <p className="text-sm text-white">{new Date(user.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">IP Address</p>
                                    <p className="text-sm text-gray-400 font-mono">{user.ip_address || 'Unknown'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-500 mb-1">SBT Owned</p>
                                    <p className="text-sm font-mono text-primary">
                                        {user.sbts && user.sbts.length > 0
                                            ? user.sbts[0].name
                                            : "None"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
