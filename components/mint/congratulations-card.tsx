"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"

interface CongratulationsCardProps {
  collectionNumber: number
  userName: string
  onClose: () => void
}

export default function CongratulationsCard({ collectionNumber, userName, onClose }: CongratulationsCardProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 3, repeat: Number.POSITIVE_INFINITY },
    },
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-gradient-to-br from-black via-black/95 to-black border border-white/10 rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl"
      >
        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition"
        >
          <X size={24} />
        </motion.button>

        {/* Content */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center">
          {/* Celebrating Icon */}
          <motion.div variants={floatingVariants} animate="animate" className="text-7xl mb-6 inline-block">
            🎉
          </motion.div>

          {/* Main Title */}
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
          >
            Congratulations!
          </motion.h2>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-lg md:text-xl font-semibold text-primary mb-6">
            You Are a Serious Builder & Early Adopter
          </motion.p>

          {/* Description */}
          <motion.p variants={itemVariants} className="text-foreground/80 mb-8 leading-relaxed text-base md:text-lg">
            Welcome to the Signigeria movement! You've taken a bold step to preserve and celebrate Nigerian heritage on
            the blockchain. Your SBT Collection #{collectionNumber.toString().padStart(3, "0")} is a testament to your
            commitment to cultural unity and Web3 innovation.
          </motion.p>

          {/* User Info */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-2xl p-6 mb-8 backdrop-blur-sm"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Your Profile</p>
            <p className="text-2xl font-bold text-secondary">@{userName}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Collection #{collectionNumber.toString().padStart(3, "0")}
            </p>
          </motion.div>

          {/* Message */}
          <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8">
            <p className="text-sm text-muted-foreground italic">
              "One SBT, Infinite Possibilities. You carry the spirit of the orange nation forward."
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-black font-bold rounded-xl hover:shadow-lg hover:shadow-primary/50 transition"
            >
              View Your SBT
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full py-3 border border-primary/50 text-primary font-semibold rounded-xl hover:bg-primary/10 transition"
            >
              Explore Collections
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute -top-8 -right-8 w-24 h-24 bg-primary/10 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute -bottom-8 -left-8 w-24 h-24 bg-secondary/10 rounded-full blur-3xl pointer-events-none"
        />
      </motion.div>
    </div>
  )
}
