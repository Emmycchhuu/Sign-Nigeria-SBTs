"use client"

import { User, Shield, Bell, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function SettingsPage() {
    const { user, signOut } = useAuth()

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white">Settings</h1>

            {/* Profile Settings */}
            <div className="glass-card p-6 rounded-2xl space-y-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <User size={20} /> Profile
                </h2>
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <label className="text-sm text-gray-400">Display Name</label>
                        <input
                            type="text"
                            value={user?.user_metadata?.full_name || "Sign Believer"}
                            readOnly
                            disabled
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 outline-none cursor-not-allowed"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm text-gray-400">Email</label>
                        <input
                            type="email"
                            value={user?.email || "believer@signigeria.com"}
                            readOnly
                            disabled
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 outline-none cursor-not-allowed"
                        />
                    </div>
                    <p className="text-xs text-gray-500 italic">
                        * Profile details are managed by the administrator and cannot be changed here.
                    </p>
                </div>
            </div>

            {/* Security */}
            <div className="glass-card p-6 rounded-2xl space-y-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Shield size={20} /> Security
                </h2>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div>
                        <p className="text-white font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-400">Add an extra layer of security</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition text-sm font-bold">
                        Enable
                    </button>
                </div>
            </div>

            <button
                onClick={() => signOut()}
                className="w-full py-4 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition flex items-center justify-center gap-2 font-bold"
            >
                <LogOut size={18} />
                Sign Out
            </button>
        </div>
    )
}
