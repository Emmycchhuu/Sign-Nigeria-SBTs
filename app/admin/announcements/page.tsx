"use client"

import { useState } from "react"
import { Megaphone, Image as ImageIcon, Send, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export default function AdminAnnouncementsPage() {
    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const handleBroadcast = async () => {
        if (!title || !message) return alert("Title and Message are required")

        setUploading(true)
        let imageUrl = null

        try {
            // 1. Upload Image if exists
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Date.now()}.${fileExt}`
                const { data, error: uploadError } = await supabase.storage
                    .from('announcements')
                    .upload(fileName, imageFile)

                if (uploadError) throw uploadError

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('announcements')
                    .getPublicUrl(fileName)

                imageUrl = publicUrl
            }

            // 2. Send Broadcast RPC
            const { error: rpcError } = await supabase.rpc('broadcast_notification', {
                title,
                message,
                image_url: imageUrl
            })

            if (rpcError) throw rpcError

            // 3. Success
            setShowSuccessModal(true)
            setTitle("")
            setMessage("")
            setImageFile(null)

        } catch (error: any) {
            console.error(error)
            alert("Error sending broadcast: " + error.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Megaphone className="text-primary" /> Announcements
            </h1>

            <div className="glass-card p-8 rounded-2xl space-y-6 border border-white/10 bg-[#111]">
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">Create New Broadcast</h2>
                    <p className="text-gray-400 text-sm">Send a notification to all registered users. Supports images.</p>
                </div>

                <div className="space-y-4">
                    {/* Title */}
                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-gray-300">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. New Collection Dropping Soon!"
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition w-full"
                        />
                    </div>

                    {/* Message */}
                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-gray-300">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your announcement here..."
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition w-full min-h-[150px]"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-gray-300">Attachment (Image)</label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 transition rounded-xl px-4 py-3 flex items-center gap-2 text-gray-300">
                                <ImageIcon size={18} />
                                <span>{imageFile ? imageFile.name : "Select Image"}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                />
                            </label>
                            {imageFile && (
                                <button onClick={() => setImageFile(null)} className="text-red-500 hover:text-red-400">
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            onClick={handleBroadcast}
                            disabled={uploading}
                            className="w-full py-6 text-lg btn-gradient text-black font-bold flex items-center justify-center gap-2"
                        >
                            {uploading ? (
                                <span>Sending...</span>
                            ) : (
                                <>
                                    <Send size={20} /> Send Broadcast
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto border border-green-500/20">
                            <Check size={32} className="text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Broadcast Sent!</h2>
                            <p className="text-gray-400">Your announcement has been delivered to all users.</p>
                        </div>
                        <Button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
