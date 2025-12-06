"use client"

import { motion } from "framer-motion"
import { LayoutGrid, BadgeCheck, ScrollText, Globe } from "lucide-react"

export default function FeaturesSection() {
    const features = [
        {
            icon: LayoutGrid,
            title: "Huge Collection",
            description: "Access over 777 unique collections representing the diverse heritage of Nigeria.",
            color: "from-blue-500 to-cyan-500",
        },
        {
            icon: BadgeCheck,
            title: "High Quality",
            description: "Every SBT is verified and minted with the highest standards of security and authenticity.",
            color: "from-purple-500 to-pink-500",
        },
        {
            icon: ScrollText,
            title: "Top Resource",
            description: "Comprehensive documentation and resources to help you manage your digital legacy.",
            color: "from-orange-500 to-red-500",
        },
        {
            icon: Globe,
            title: "Big Community",
            description: "Join a thriving community of culture enthusiasts and blockchain pioneers.",
            color: "from-green-500 to-emerald-500",
        },
    ]

    return (
        <section className="py-12 md:py-16 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[100px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-16"
                >
                    <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-secondary text-sm font-medium mb-4">
                        Our Speciality
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Complete Solutions <br />
                        for your <span className="text-gradient">SBT</span>
                    </h2>
                    Signigeria offers a comprehensive hub for minting, managing, and showcasing your Soul Bound Tokens.
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="glass-card p-8 rounded-3xl text-center group hover:border-primary/30 transition-all duration-300"
                        >
                            <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
