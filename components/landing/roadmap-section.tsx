"use client"

import { motion } from "framer-motion"

export default function RoadmapSection() {
    const phases = [
        {
            date: "February 01, 2024",
            title: "Initial Release",
            description: "Launch of the Signigeria platform with core SBT minting functionality and wallet integration.",
            color: "bg-cyan-500",
            align: "left",
        },
        {
            date: "April 15, 2024",
            title: "Design & Development",
            description: "Expansion of the heritage collection library and partnership announcements with cultural institutions.",
            color: "bg-purple-500",
            align: "right",
        },
        {
            date: "August 01, 2024",
            title: "Result & Final Report",
            description: "Release of the community governance token and DAO structure for platform decision making.",
            color: "bg-orange-500",
            align: "left",
        },
        {
            date: "December 10, 2024",
            title: "Global Expansion",
            description: "Onboarding international heritage collections and cross-chain interoperability features.",
            color: "bg-green-500",
            align: "right",
        },
    ]

    return (
        <section className="py-20 relative overflow-hidden" id="roadmap">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium mb-4">
                        Our Journey
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold">
                        Project <span className="text-gradient">Roadmap</span>
                    </h2>
                </motion.div>

                <div className="relative">
                    {phases.map((phase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: phase.align === "left" ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className={`flex items-center justify-between mb-12 w-full ${phase.align === "left" ? "flex-row" : "flex-row-reverse"
                                }`}
                        >
                            {/* Content Card */}
                            <div className="w-full md:w-[45%]">
                                <div className="glass-card p-8 rounded-3xl border border-white/10 hover:border-primary/30 transition-colors relative group">
                                    {/* Date Badge */}
                                    <div className="absolute -top-4 left-8 px-4 py-1 rounded-full bg-black/80 border border-white/10 text-xs font-bold text-gray-300 uppercase tracking-wider">
                                        {phase.date}
                                    </div>

                                    <h3 className="text-2xl font-bold mb-2 mt-2">{phase.title}</h3>
                                    <div className={`w-12 h-1 ${phase.color} rounded-full mb-4`} />
                                    <p className="text-gray-400 leading-relaxed">
                                        {phase.description}
                                    </p>

                                    {/* Glow Effect */}
                                    <div className={`absolute inset-0 ${phase.color} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-500 rounded-3xl -z-10`} />
                                </div>
                            </div>

                            {/* Center Node */}
                            <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border-2 border-primary shadow-[0_0_10px_rgba(0,208,132,0.5)] z-20">
                                <div className={`absolute inset-0 ${phase.color} blur-sm opacity-50`} />
                            </div>

                            {/* Empty Space for alignment */}
                            <div className="w-full md:w-[45%] hidden md:block" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
