"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import NavMenu from "@/components/ui/nav-menu"
import HeroCard from "@/components/ui/hero-card"
import AboutSection from "@/components/landing/about-section"
import FeaturesSection from "@/components/landing/features-section"
import StepsSection from "@/components/landing/steps-section"
import TeamSection from "@/components/landing/team-section"
import FAQSection from "@/components/landing/faq-section"
import RoadmapSection from "@/components/landing/roadmap-section"
import CollectionSection from "@/components/landing/collection-section"

import BackgroundEffects from "@/components/ui/background-effects"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative selection:bg-primary/30">
      <BackgroundEffects />

      <NavMenu />

      <main className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-20 pb-12 md:pb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight">
                Collect Next <br />
                Generation <span className="text-gradient">SBTs</span> <br />
                Today
              </h1>

              {/* Decorative Line */}
              <svg width="200" height="20" viewBox="0 0 200 20" className="opacity-80">
                <path d="M0 10 Q 100 20 200 10" stroke="url(#gradient)" strokeWidth="4" fill="none" />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00d084" />
                    <stop offset="100%" stopColor="#ff8c00" />
                  </linearGradient>
                </defs>
              </svg>

              <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                Signigeria is the premier hub for Soul Bound Tokens, representing your unique Nigerian heritage and cultural identity.
              </p>

              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-xl btn-gradient text-base shadow-lg shadow-primary/20"
                >
                  Get Connected
                </motion.button>
              </Link>

              <div className="pt-12">
                <p className="text-sm text-gray-500 mb-4 font-semibold tracking-wider uppercase">We are Signigeria</p>
                <div className="flex gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                  {/* Partner Logo Placeholders */}
                  <div className="h-8 w-24 bg-white/10 rounded" />
                  <div className="h-8 w-24 bg-white/10 rounded" />
                  <div className="h-8 w-24 bg-white/10 rounded" />
                </div>
              </div>
            </motion.div>

            {/* Right Column - 3D Card */}
            <div className="relative">
              <HeroCard />
            </div>
          </div>
        </div>

        {/* Full Page Sections */}
        <AboutSection />
        <FeaturesSection />
        <CollectionSection />
        <StepsSection />
        <RoadmapSection />
        <TeamSection />
        <FAQSection />

        {/* Footer CTA */}
        <section className="py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <h2 className="text-4xl font-bold mb-8">Ready to start your journey?</h2>
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-full btn-gradient text-lg shadow-xl shadow-primary/30"
              >
                Join Signigeria Now
              </motion.button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
