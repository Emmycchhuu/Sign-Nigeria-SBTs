"use client"

import { Button } from "@/components/ui/button"
import { Save, Lock, Bell, Moon } from "lucide-react"

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <h1 className="text-3xl font-bold">Admin Settings</h1>

            <div className="grid gap-6">
                {/* General Settings */}
                <div className="bg-[#111] border border-white/10 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                        <Lock className="text-primary" />
                        <h2 className="text-xl font-bold">Security & Access</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Admin Email Notifications</label>
                            <select className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-primary/50">
                                <option>Enabled</option>
                                <option>Disabled</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Two-Factor Auth</label>
                            <select className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-primary/50">
                                <option>Optional</option>
                                <option>Enforced</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* System Settings */}
                <div className="bg-[#111] border border-white/10 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                        <Bell className="text-blue-500" />
                        <h2 className="text-xl font-bold">System Announcements</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Announcement Banner</label>
                            <input
                                type="text"
                                placeholder="Enter system-wide message..."
                                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-primary/50"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="maintenance" className="w-4 h-4 accent-primary" />
                            <label htmlFor="maintenance" className="text-sm text-white cursor-pointer hover:text-gray-300">Enable Maintenance Mode</label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button className="btn-gradient text-black font-bold px-8">
                        <Save size={18} className="mr-2" /> Save Changes
                    </Button>
                </div>
            </div>
        </div>
    )
}
