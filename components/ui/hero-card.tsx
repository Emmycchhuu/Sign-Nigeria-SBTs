"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function HeroCard() {
    return (
        <div className="relative w-full max-w-xs md:max-w-md mx-auto aspect-[4/5] h-[350px] md:h-auto">
            {/* Main Glass Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 glass-card rounded-[3rem] overflow-hidden z-10"
            >
                {/* 3D Character Image */}
                <div className="w-full h-full relative">
                    <Image
                        src="/images/image1.png"
                        alt="SBT Character"
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
            </motion.div>

            {/* Floating Badge - Top Right (Current Mint) */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute top-8 -right-4 z-20 glass-panel p-3 rounded-2xl flex items-center gap-3 pr-6"
            >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black font-bold">
                    S
                </div>
                <div>
                    <p className="text-xs text-gray-400">Current Mint</p>
                    <p className="text-sm font-bold text-white">2000 Oranges</p>
                </div>
            </motion.div>

            {/* Floating Badge - Bottom Left (User) */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="absolute bottom-12 -left-8 z-20 glass-panel p-3 rounded-2xl flex items-center gap-3 pr-6"
            >
                <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-primary overflow-hidden">
                    {/* Avatar Placeholder - could use another image here if available, or just a color block */}
                    <div className="w-full h-full bg-gray-600 relative">
                        <Image
                            src="/images/image4.png"
                            alt="User Avatar"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
                <div>
                    <p className="text-sm font-bold text-white">Leslie Alexander</p>
                    <p className="text-xs text-primary">@leslie754</p>
                </div>
            </motion.div>

            {/* Background Glow Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 blur-[80px] rounded-full z-0" />
        </div>
    )
}
