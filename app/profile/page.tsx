"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Box, Shield, Calendar, Wallet, Share2, ExternalLink, Zap, Scroll, MapPin, Camera, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"

export default function ProfilePage() {
    const { user, refreshProfile } = useAuth()
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !user) return

        const file = e.target.files[0]
        setIsUploading(true)

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { upsert: true })

            if (uploadError) throw uploadError

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName)

            // Update Profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id)

            if (updateError) throw updateError

            await refreshProfile()
        } catch (error: any) {
            console.error("Error uploading avatar:", error)
            alert("Error uploading avatar: " + error.message)
        } finally {
            setIsUploading(false)
        }
    }

    if (!user) return (
        <div className="min-h-[80vh] flex items-center justify-center text-gray-500">
            Please sign in to access your Vault.
        </div>
    )

    return (
        <div className="min-h-[80vh] flex flex-col gap-8 relative pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">The Vault</h1>
                    <p className="text-gray-400">Your personal digital shrine.</p>
                </div>
            </div>

            {/* Main Display Area */}
            <div className="grid lg:grid-cols-2 gap-8 h-full">

                {/* Left: The Artifact (3D/Visual) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative h-[600px] w-full rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-center group"
                >
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

                    {/* The Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center p-8">
                        {user.sbt ? (
                            // MINTED STATE
                            <div className="relative">
                                <div className="w-72 h-96 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/20 shadow-2xl shadow-primary/20 flex items-center justify-center relative overflow-hidden transform transition-transform duration-500 hover:scale-105 hover:rotate-1">
                                    {/* Placeholder for 3D Card */}
                                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent" />

                                    {/* Image if available, else placeholder */}
                                    {user.sbt.image_url ? (
                                        <img src={user.sbt.image_url} alt={user.sbt.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center relative z-10">
                                            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-[0_0_30px_rgba(0,208,132,0.2)]">
                                                <span className="text-5xl">🦁</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white tracking-widest mb-1">{user.sbt.name}</h3>
                                            <p className="text-xs text-primary uppercase tracking-widest">{user.sbt.rarity || "Legendary"} Artifact</p>
                                        </div>
                                    )}

                                    {/* Holographic Shine */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ transform: 'skewX(-20deg) translateX(-150%)', animation: 'shine 3s infinite' }} />
                                </div>
                                <div className="mt-8 space-y-2">
                                    <h2 className="text-2xl font-bold text-white">Artifact #{String(user.sbt.id).padStart(3, '0')}</h2>
                                    <p className="text-sm text-gray-400">Minted on {new Date(user.sbt.minted_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ) : (
                            // EMPTY STATE
                            <div className="flex flex-col items-center">
                                <div className="w-64 h-80 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-primary/30 transition-colors duration-500">
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <Box size={48} className="text-gray-600 group-hover:text-primary transition-colors duration-500" />
                                </div>
                                <div className="mt-8 max-w-xs">
                                    <h2 className="text-2xl font-bold text-white mb-2">Vault Empty</h2>
                                    <p className="text-gray-400 text-sm mb-6">
                                        Your legacy is waiting to be written. Initiate the ritual to receive your Soulbound Token.
                                    </p>
                                    <Link href="/dashboard/mint">
                                        <button className="px-8 py-3 rounded-xl btn-gradient text-black font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:-translate-y-1">
                                            Initiate Ritual
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Right: Details & Stats */}
                <div className="flex flex-col gap-6">
                    {/* Identity Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="glass-card p-6 rounded-2xl"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative w-20 h-20 group cursor-pointer">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                                    <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center relative">
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-2xl font-bold text-white uppercase">{user.name?.substring(0, 2) || user.email?.substring(0, 2)}</span>
                                        )}

                                        {/* Upload Overlay */}
                                        <div
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {isUploading ? <Loader2 className="animate-spin text-white" /> : <Camera className="text-white" />}
                                        </div>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-white">{user.name || "Sign User"}</h2>
                                {user.role === 'admin' && (
                                    <div className="flex items-center gap-2 text-sm text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full w-fit mt-2 border border-purple-500/20">
                                        <Shield size={12} />
                                        <span>Admin</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Calendar size={18} />
                                    <span className="text-sm">Email</span>
                                </div>
                                <span className="text-white font-medium text-sm">{user.email}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <MapPin size={18} />
                                    <span className="text-sm">Origin</span>
                                </div>
                                <span className="text-white font-medium">Nigeria</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Cultural Traits & Story (Only if minted) */}
                    {user.sbt && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="glass-card p-6 rounded-2xl"
                            >
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Zap size={18} className="text-secondary" />
                                    Cultural Traits
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Mock traits for now as they are stored in JSONB usually */}
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-xs text-gray-500 uppercase mb-1">Rarity</p>
                                        <p className="text-white font-medium">{user.sbt.rarity}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
                                        <p className="text-white font-medium">Minted</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="flex gap-3">
                                <button className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center gap-2 transition">
                                    <Share2 size={18} />
                                    Share Vault
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
