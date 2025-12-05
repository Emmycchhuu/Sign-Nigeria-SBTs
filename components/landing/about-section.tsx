"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function AboutSection() {
    return (
        <section className="py-20 relative">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                {/* Left Column - Image Composition */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="relative h-[500px] w-full flex items-center justify-center"
                >
                    {/* Main Image */}
                    <div className="relative w-[80%] h-[80%] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl z-10">
                        <Image
                            src="/images/about us images/about-01.png"
                            alt="About Signigeria Main"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    {/* Floating Image 1 - Top Left */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[5%] left-[0%] w-[35%] aspect-square rounded-3xl overflow-hidden border-2 border-white/20 shadow-xl z-20 glass-card"
                    >
                        <Image
                            src="/images/about us images/about-03.png"
                            alt="About Detail 1"
                            fill
                            className="object-cover"
                        />
                    </motion.div>

                    {/* Floating Image 2 - Bottom Right */}
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-[5%] right-[0%] w-[30%] aspect-[4/5] rounded-3xl overflow-hidden border-2 border-white/20 shadow-xl z-20 glass-card"
                    >
                        <Image
                            src="/images/about us images/about-05.png"
                            alt="About Detail 2"
                            fill
                            className="object-cover"
                        />
                    </motion.div>

                    {/* Decorative Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[100px] rounded-full -z-10" />
                </motion.div>

                {/* Right Column - Content */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                >
                    <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium">
                        About us
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                        High Quality <br />
                        <span className="text-gradient">SBT Collections</span>
                    </h2>

                    <p className="text-gray-400 text-lg leading-relaxed">
                        Signigeria is the premier hub for Soul Bound Tokens, representing your unique Nigerian heritage and cultural identity. We provide a platform where culture meets technology, ensuring that your legacy is preserved forever.
                    </p>

                    <div className="pt-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-xl btn-gradient text-lg shadow-lg shadow-primary/20"
                        >
                            More About Us
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
