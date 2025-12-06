"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Twitter } from "lucide-react"
import Link from "next/link"

export default function TeamSection() {
    const team = [
        {
            name: "Dlegacy",
            handle: "@noTaboutMEalone",
            image: "/images/Team/Dlegacy.jpeg",
            color: "border-cyan-500",
            link: "https://twitter.com/noTaboutMEalone"
        },
        {
            name: "Lucky Esemuede",
            handle: "@Lucky_of_Web3",
            image: "/images/Team/Lucky Esemuede.jpeg",
            color: "border-pink-500",
            link: "https://twitter.com/Lucky_of_Web3"
        },
        {
            name: "Big_D",
            handle: "@V3rseDev",
            image: "/images/Team/Big_D.jpeg",
            color: "border-purple-500",
            link: "https://twitter.com/V3rseDev"
        },
        {
            name: "D Moore",
            handle: "@benz_urch01",
            image: "/images/Team/D Moore.jpeg",
            color: "border-green-500",
            link: "https://twitter.com/benz_urch01"
        },
        {
            name: "Bigsomi",
            handle: "@bigsommy_",
            image: "/images/Team/Bigsomi.jpeg",
            color: "border-yellow-500",
            link: "https://twitter.com/bigsommy_"
        }
    ]

    return (
        <section className="py-20 relative">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium mb-4">
                        Team Members
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold">
                        Our Amazing <span className="text-gradient">Team</span> <br />
                        Members
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 justify-center">
                    {team.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group"
                        >
                            <Link href={member.link} target="_blank" rel="noopener noreferrer">
                                <div className={`relative aspect-[4/5] rounded-3xl overflow-hidden mb-6 border-2 ${member.color} p-2 glass-card`}>
                                    <div className="w-full h-full rounded-2xl overflow-hidden relative">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                        {/* Twitter Icon Overlay */}
                                        <div className="absolute bottom-4 right-4 bg-black/50 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Twitter size={16} className="text-white" />
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                <p className="text-primary text-sm font-medium flex items-center justify-center gap-1 hover:underline">
                                    <Twitter size={12} />
                                    {member.handle}
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
