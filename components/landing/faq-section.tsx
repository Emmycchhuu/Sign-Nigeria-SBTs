"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Plus, Minus } from "lucide-react"

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqs = [
        {
            question: "What is a Soul Bound Token (SBT)?",
            answer: "A Soul Bound Token is a non-transferable NFT that represents your identity, achievements, or credentials on the blockchain. Unlike regular NFTs, SBTs cannot be sold or transferred to another wallet.",
        },
        {
            question: "How do I mint my Signigeria SBT?",
            answer: "Simply connect your wallet, choose a collection that resonates with you, and click 'Mint'. You'll need a small amount of gas fees to complete the transaction.",
        },
        {
            question: "Can I sell my SBT?",
            answer: "No, SBTs are soul-bound, meaning they are permanently tied to your wallet address. They are meant to be a permanent record of your heritage and identity.",
        },
        {
            question: "What wallets are supported?",
            answer: "We currently support Metamask, Coinbase Wallet, and WalletConnect compatible wallets. We are working on adding support for more wallets soon.",
        },
        {
            question: "Is there a limit to how many SBTs I can own?",
            answer: "While some collections may have limits, generally you can own multiple SBTs from different collections to showcase various aspects of your identity.",
        },
        {
            question: "How secure is the platform?",
            answer: "Signigeria is built on secure smart contracts that have been audited. Your assets are secured by the blockchain."
        }
    ]

    return (
        <section className="py-20 relative">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-secondary text-sm font-medium mb-4">
                        FAQs
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Frequently <br />
                        Asked <span className="text-gradient">Questions</span>
                    </h2>
                    <p className="text-gray-400">
                        Below is a list of frequently asked questions and answers from our community.
                    </p>
                </motion.div>

                <div className="grid gap-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-panel rounded-2xl overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                            >
                                <span className="text-lg font-bold pr-8">
                                    <span className="text-primary mr-4">0{index + 1}.</span>
                                    {faq.question}
                                </span>
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    {openIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
