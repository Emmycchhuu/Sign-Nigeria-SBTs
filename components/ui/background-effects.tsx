"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function BackgroundEffects() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let width = window.innerWidth
        let height = window.innerHeight

        canvas.width = width
        canvas.height = height

        const particles: Particle[] = []
        const particleCount = 30 // Reduced from 50 for performance

        class Particle {
            x: number
            y: number
            vx: number
            vy: number
            size: number
            color: string

            constructor() {
                this.x = Math.random() * width
                this.y = Math.random() * height
                this.vx = (Math.random() - 0.5) * 0.3 // Slower movement
                this.vy = (Math.random() - 0.5) * 0.3
                this.size = Math.random() * 2
                this.color = `rgba(${Math.random() > 0.5 ? "0, 208, 132" : "255, 140, 0"}, ${Math.random() * 0.5})`
            }

            update() {
                this.x += this.vx
                this.y += this.vy

                if (this.x < 0 || this.x > width) this.vx *= -1
                if (this.y < 0 || this.y > height) this.vy *= -1
            }

            draw() {
                if (!ctx) return
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = this.color
                ctx.fill()
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle())
        }

        let animationFrameId: number

        function animate() {
            if (!ctx || !canvas) return
            ctx.clearRect(0, 0, width, height)

            // Batch drawing could be optimized but simple loop is fine for 30 particles
            particles.forEach((p) => {
                p.update()
                p.draw()
            })

            // Draw connections - Optimized distance check
            ctx.lineWidth = 1
            for (let i = 0; i < particleCount; i++) {
                for (let j = i + 1; j < particleCount; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    // Avoid square root for performance check first
                    const distSq = dx * dx + dy * dy

                    if (distSq < 22500) { // 150 * 150
                        const distance = Math.sqrt(distSq)
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - distance / 150)})`
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.stroke()
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate)
        }

        animate()

        const handleResize = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height
        }

        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Canvas for Particles */}
            <canvas ref={canvasRef} className="absolute inset-0 opacity-50" />

            {/* Floating Orbs - Animated with will-change for GPU promotion */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 blur-[120px] rounded-full mix-blend-screen will-change-transform"
            />
            <motion.div
                animate={{
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-accent/10 blur-[120px] rounded-full mix-blend-screen will-change-transform"
            />

            {/* Smaller Orbs */}
            <motion.div
                animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-[20%] right-[20%] w-64 h-64 bg-secondary/10 blur-[80px] rounded-full will-change-transform"
            />
            <motion.div
                animate={{ y: [0, 40, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 7, repeat: Infinity }}
                className="absolute bottom-[20%] left-[10%] w-96 h-96 bg-primary/5 blur-[100px] rounded-full will-change-transform"
            />

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        </div>
    )
}
