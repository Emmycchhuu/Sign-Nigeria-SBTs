"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function CollectionSection() {
    const collections = [
        {
            title: "Yoruba Royals",
            items: "120 Items",
            image: "/images/image1.png",
            price: "0.5 Oranges",
        },
        {
            title: "Igbo Masquerades",
            items: "85 Items",
            image: "/images/image2.png",
            price: "0.45 Oranges",
        },
        {
            title: "Hausa Architecture",
            items: "200 Items",
            image: "/images/image3.png",
            price: "0.3 Oranges",
        },
        {
            title: "Benin Bronzes",
            items: "50 Items",
            image: "/images/image4.png",
            price: "1.2 Oranges",
        },
    ]

    return (
        <section className="py-20 relative" id="collections">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
                >
                    <div>
                        <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-secondary text-sm font-medium mb-4">
                            Top Collections
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold">
                            Popular <span className="text-gradient">Collections</span>
                        </h2>
                    </div>

                    <button className="px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium">
                        View All Collections
                    </button>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {collections.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="glass-card p-3 rounded-3xl group"
                        >
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden relative mb-4">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                                    <span className="px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md text-xs font-bold border border-white/10">
                                        Mint
                                    </span>
                                </div>
                            </div>

                            <div className="px-2 pb-2">
                                <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">{item.items}</span>
                                    <span className="text-primary font-bold">{item.price}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
