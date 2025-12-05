"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, User, Twitter, MapPin, Check, ShieldAlert } from "lucide-react"
import FormInput from "@/components/ui/form-input"
import ImageUpload from "@/components/ui/image-upload"
import BackgroundEffects from "@/components/ui/background-effects"
import { useAuth } from "@/context/auth-context"
import { getIpDetails, getDeviceFingerprint, isVpnDetected } from "@/lib/security"
import { supabase } from "@/lib/supabase"

export default function SignUpPage() {
    const router = useRouter()
    const { signUp, signInWithGoogle, signInWithTwitter } = useAuth()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        twitter: "",
        gender: "",
        isSignBeliever: false,
        profilePicture: null as File | null,
    })

    const [securityData, setSecurityData] = useState({
        ip: "",
        country: "Detecting...",
        fingerprint: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSecurityChecking, setIsSecurityChecking] = useState(true)

    useEffect(() => {
        const initSecurity = async () => {
            try {
                // Parallel fetch for speed
                const [ipData, fingerprint] = await Promise.all([
                    getIpDetails(),
                    getDeviceFingerprint()
                ])

                if (isVpnDetected(ipData)) {
                    router.replace('/vpn-detected')
                    return
                }

                setSecurityData({
                    ip: ipData.ip,
                    country: ipData.country_name || 'Unknown',
                    fingerprint: fingerprint
                })
            } catch (error) {
                console.error("Security init failed:", error)
                // Optionally handle failure (allow or block)
            } finally {
                setIsSecurityChecking(false)
            }
        }

        initSecurity()
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Basic validation
        const newErrors: Record<string, string> = {}

        if (!formData.name) newErrors.name = "Name is required"
        if (!formData.email) newErrors.email = "Email is required"
        if (!formData.password) newErrors.password = "Password is required"
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }
        if (!formData.gender) newErrors.gender = "Gender is required"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            // Check for previous accounts
            const { data: conflict } = await supabase.rpc('check_security_conflict', {
                check_ip: securityData.ip,
                check_fingerprint: securityData.fingerprint
            })

            if (conflict) {
                alert("Security Alert: An account has already been created from this device or IP network. Multiple accounts are not allowed.")
                return
            }

            await signUp(formData.email, formData.password, {
                fullName: formData.name,
                username: formData.email.split('@')[0], // Default username
                country: securityData.country,
                gender: formData.gender,
                isSignBeliever: formData.isSignBeliever,
                twitter: formData.twitter,
                ip_address: securityData.ip,
                device_fingerprint: securityData.fingerprint,
                country_name: securityData.country // redundant but explicit
            })

            alert("Account created! Please check your email to verify your account.")
            router.push("/login")
        } catch (error: any) {
            setErrors({ email: error.message })
        }
    }

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }))
        }
    }

    if (isSecurityChecking) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-gray-400">Verifying secure environment...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            <BackgroundEffects />

            {/* Header */}
            <div className="relative z-10 px-6 py-6">
                <Link href="/">
                    <div className="text-2xl font-bold tracking-tighter flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
                        <span className="text-white">Signi</span>
                        <span className="text-primary">geria</span>
                    </div>
                </Link>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Join <span className="text-gradient">Signigeria</span>
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Create your account and start your SBT journey
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="glass-card p-8 md:p-12 rounded-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Profile Picture Upload */}
                            <ImageUpload
                                value={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : undefined}
                                onChange={(file) => handleInputChange("profilePicture", file)}
                                error={errors.profilePicture}
                            />

                            {/* Two Column Layout for Desktop */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Name */}
                                <FormInput
                                    label="Full Name"
                                    type="text"
                                    placeholder="Enter your name"
                                    icon={<User size={20} />}
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    error={errors.name}
                                />

                                {/* Email */}
                                <FormInput
                                    label="Email Address"
                                    type="email"
                                    placeholder="your@email.com"
                                    icon={<Mail size={20} />}
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    error={errors.email}
                                />

                                {/* Password */}
                                <FormInput
                                    label="Password"
                                    type="password"
                                    placeholder="Create a password"
                                    icon={<Lock size={20} />}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    error={errors.password}
                                />

                                {/* Confirm Password */}
                                <FormInput
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="Confirm your password"
                                    icon={<Lock size={20} />}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                    error={errors.confirmPassword}
                                />

                                {/* Twitter */}
                                <FormInput
                                    label="Twitter Username (Optional)"
                                    type="text"
                                    placeholder="@username"
                                    icon={<Twitter size={20} />}
                                    value={formData.twitter}
                                    onChange={(e) => handleInputChange("twitter", e.target.value)}
                                    error={errors.twitter}
                                />

                                {/* Country - Read Only */}
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Location Detected
                                    </label>
                                    <div className="relative">
                                        <div className="w-full pl-12 pr-4 py-3 h-[50px] rounded-xl bg-white/5 border border-white/10 text-gray-400 flex items-center cursor-not-allowed">
                                            {securityData.country}
                                        </div>
                                        <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <ShieldAlert size={16} className="text-green-500/50" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Your IP {securityData.ip} is being monitored for security.
                                    </p>
                                </div>
                            </div>

                            {/* Gender Selection */}
                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Gender
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            checked={formData.gender === "male"}
                                            onChange={(e) => handleInputChange("gender", e.target.value)}
                                            className="sr-only peer"
                                        />
                                        <div className="px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-center transition-all duration-200 peer-checked:bg-primary/20 peer-checked:border-primary hover:bg-white/10">
                                            Male
                                        </div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            checked={formData.gender === "female"}
                                            onChange={(e) => handleInputChange("gender", e.target.value)}
                                            className="sr-only peer"
                                        />
                                        <div className="px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-center transition-all duration-200 peer-checked:bg-primary/20 peer-checked:border-primary hover:bg-white/10">
                                            Female
                                        </div>
                                    </label>
                                </div>
                                {errors.gender && (
                                    <p className="mt-1.5 text-sm text-red-400">{errors.gender}</p>
                                )}
                            </div>

                            {/* Sign Believer Question */}
                            <div className="w-full">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={formData.isSignBeliever}
                                            onChange={(e) => handleInputChange("isSignBeliever", e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 transition-all duration-200 peer-checked:bg-primary peer-checked:border-primary group-hover:bg-white/10 flex items-center justify-center">
                                            {formData.isSignBeliever && <Check size={16} className="text-white" />}
                                        </div>
                                    </div>
                                    <span className="text-gray-300 group-hover:text-white transition-colors">
                                        Are you a sign believer?
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 rounded-xl btn-gradient text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
                            >
                                {isSecurityChecking ? "Verifying Security..." : "Create Account"}
                            </motion.button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-background text-gray-500">Or sign up with</span>
                                </div>
                            </div>

                            {/* Social Login Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => signInWithGoogle()}
                                    className="px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span className="text-sm">Google</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => signInWithTwitter()}
                                    className="px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                    <span className="text-sm">Twitter</span>
                                </button>
                            </div>

                            {/* Sign In Link */}
                            <p className="text-center text-gray-400">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
