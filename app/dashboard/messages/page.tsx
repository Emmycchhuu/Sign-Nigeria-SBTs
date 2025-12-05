"use client"

import { MessageSquare, Bell } from "lucide-react"

export default function MessagesPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Messages</h1>

            <div className="glass-card rounded-2xl overflow-hidden">
                {/* Empty State */}
                <div className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <MessageSquare className="text-gray-500" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">No Messages Yet</h2>
                    <p className="text-gray-400 max-w-sm">
                        Notifications from the Oracle and community updates will appear here.
                    </p>
                </div>
            </div>
        </div>
    )
}
