"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { UserPlus, Coins, Clock, Gem } from "lucide-react"

export default function StepsSection() {
    const steps = [
        {
            icon: UserPlus,
            title: "Sign Up",
            description: "Create your account to start your journey. No wallet connection required.",
            gradient: "from-cyan-400 to-blue-500",
        },
        {
            icon: Coins,
            title: "Pay Oranges",
            description: "Use Oranges to pay for your minting. Simple and secure payment process.",
            gradient: "from-orange-400 to-red-500",
        },
        {
            icon: Clock,
            title: "Review & Mint",
            description: "Wait 15 mins for admin approval. Once approved, your SBT is released to you.",
            gradient: "from-purple-400 to-pink-500",
        },
    ]

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

                {/* Left Column - Content */}
                <div className="space-y-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
                            Join <span className="text-gradient">Signigeria</span> <br />
                            Portfolio Now
                        </h2>
                        <p className="text-gray-400 text-lg max-w-md">
                            Follow these simple steps to become part of the premier cultural blockchain revolution.
                        </p>
                    </motion.div>

                    <div className="space-y-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="flex gap-6 items-center group"
                            >
                                {/* Icon Container */}
                                <div className="relative w-16 h-16 flex-shrink-0">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-20 blur-xl rounded-full group-hover:opacity-40 transition-opacity`} />
                                    <div className="relative w-full h-full glass-card rounded-2xl border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <step.icon className="w-8 h-8 text-white" />
                                    </div>
                                </div>

                                {/* Text */}
                                <div>
                                    <h3 className={`text-2xl font-bold mb-1 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative h-[600px] w-full flex items-center justify-center"
                >
                    {/* Main Image Container */}
                    <div className="relative w-full h-full max-w-md mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 blur-[100px] rounded-full" />

                        <div className="relative w-full h-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl glass-card p-2">
                            <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                                <Image
                                    src="/images/steps image.png"
                                    alt="Signigeria Steps"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-10 -right-10 w-24 h-24 glass-card rounded-2xl flex items-center justify-center border border-white/20"
                        >
                            <Gem className="w-10 h-10 text-primary" />
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-10 -left-10 w-32 h-20 glass-card rounded-2xl flex items-center justify-center border border-white/20"
                        >
                            <div className="text-center">
                                <div className="text-xs text-gray-400">Total Minted</div>
                                <div className="text-xl font-bold text-white">12.5k+</div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
