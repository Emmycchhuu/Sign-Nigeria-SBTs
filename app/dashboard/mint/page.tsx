"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Upload, Clock, CheckCircle, AlertCircle, Copy, ArrowRight, User } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import FormInput from "@/components/ui/form-input"

export default function MintPage() {
    const router = useRouter()
    const { user, refreshProfile } = useAuth()

    const [step, setStep] = useState<"payment" | "pending" | "success">("payment")
    const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds
    const [proofFile, setProofFile] = useState<File | null>(null)
    const [orangeUsername, setOrangeUsername] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [requestId, setRequestId] = useState<string | null>(null)

    // Check for existing state on mount
    useEffect(() => {
        if (!user) return

        const checkStatus = async () => {
            // 1. Check if already owns SBT
            if (user.sbt) {
                setStep("success")
                return
            }

            // 2. Check for pending/verified requests
            const { data: existingRequest } = await supabase
                .from('mint_requests')
                .select('*')
                .eq('user_id', user.id)
                .in('status', ['pending', 'verified'])
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            if (existingRequest) {
                setRequestId(existingRequest.id)
                setStep("pending")

                // Calculate remaining time if needed, or just show waiting
                const createdTime = new Date(existingRequest.created_at).getTime()
                const now = Date.now()
                const elapsed = (now - createdTime) / 1000
                const remaining = Math.max(0, (15 * 60) - elapsed)
                setTimeLeft(Math.floor(remaining))
            }
        }

        checkStatus()
    }, [user])

    // Countdown Timer
    useEffect(() => {
        let timer: NodeJS.Timeout
        if (step === "pending" && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [step, timeLeft])

    // Listen for Request Updates
    useEffect(() => {
        if (!requestId) return

        const channel = supabase
            .channel(`mint_request_${requestId}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'mint_requests',
                filter: `id=eq.${requestId}`
            }, async (payload) => {
                if (payload.new.status === 'approved') {
                    setStep("success")
                    await refreshProfile()
                } else if (payload.new.status === 'rejected') {
                    alert("Your mint request was rejected. Please check your notifications.")
                    setStep("payment")
                    setRequestId(null)
                } else if (payload.new.status === 'verified') {
                    // Stay in pending but maybe update message?
                    // For now, pending covers both pending and verified
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [requestId, refreshProfile])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProofFile(e.target.files[0])
        }
    }

    const handleSubmitProof = async () => {
        if (!proofFile || !user || !orangeUsername) return
        setIsUploading(true)

        try {
            // 1. Upload File
            const fileExt = proofFile.name.split('.').pop()
            const fileName = `${user.id}/${Date.now()}.${fileExt}`

            // Try 'proofs' bucket first, fallback to 'payment_proofs' if needed
            let bucketName = 'proofs'
            let { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(fileName, proofFile)

            if (uploadError) {
                // Fallback or specific error handling
                console.warn("Upload to 'proofs' failed, trying 'payment_proofs'", uploadError)
                bucketName = 'payment_proofs'
                const { error: retryError } = await supabase.storage
                    .from(bucketName)
                    .upload(fileName, proofFile)

                if (retryError) throw retryError
            }

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(fileName)

            // 3. Create Mint Request
            const { data: requestData, error: requestError } = await supabase
                .from('mint_requests')
                .insert({
                    user_id: user.id,
                    // sbt_id is now assigned by Admin
                    payment_proof_url: publicUrl,
                    orange_dynasty_username: orangeUsername,
                    status: 'pending'
                })
                .select()
                .single()

            if (requestError) throw requestError

            setRequestId(requestData.id)
            setStep("pending")

        } catch (error: any) {
            console.error("Minting Error:", error)
            alert("Error submitting proof: " + error.message)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden p-4">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="relative z-10 w-full max-w-lg">
                <AnimatePresence mode="wait">
                    {/* STEP 1: PAYMENT & UPLOAD */}
                    {step === "payment" && (
                        <motion.div
                            key="payment"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-card p-8 rounded-3xl"
                        >
                            <h1 className="text-2xl font-bold text-white mb-2 text-center">Mint Your Artifact</h1>
                            <p className="text-gray-400 text-center mb-8">Complete the offering to claim your SBT.</p>

                            {/* Payment Instructions */}
                            <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10 space-y-4">
                                <h3 className="font-bold text-white border-b border-white/10 pb-2">How to Pay</h3>
                                <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
                                    <li>Log in to your <strong>Orange Dynasty</strong> app.</li>
                                    <li>Search for username: <span className="text-primary font-bold">AfricaSIGNGiant</span>.</li>
                                    <li>Send <strong>200 Oranges</strong>, 10 times (Total: 2,000 Oranges).</li>
                                    <li>Go to your history and take a screenshot.</li>
                                </ol>
                            </div>

                            {/* Form */}
                            <div className="space-y-6">
                                <FormInput
                                    label="Your Orange Dynasty Username"
                                    type="text"
                                    placeholder="@username"
                                    icon={<User size={20} />}
                                    value={orangeUsername}
                                    onChange={(e) => setOrangeUsername(e.target.value)}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Upload Proof of Payment
                                    </label>
                                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-primary/50 transition-colors relative bg-black/20">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        {proofFile ? (
                                            <div className="flex items-center justify-center gap-2 text-primary">
                                                <CheckCircle size={20} />
                                                <span className="text-sm truncate max-w-[200px]">{proofFile.name}</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-gray-500">
                                                <Upload size={24} />
                                                <span className="text-sm">Click to upload screenshot</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSubmitProof}
                                    disabled={!proofFile || !orangeUsername || isUploading}
                                    className="w-full py-6 text-lg btn-gradient text-black font-bold shadow-lg shadow-primary/20"
                                >
                                    {isUploading ? "Verifying..." : "Submit Proof"}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: PENDING / COUNTDOWN */}
                    {step === "pending" && (
                        <motion.div
                            key="pending"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center"
                        >
                            <div className="w-32 h-32 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-6 border border-yellow-500/20 animate-pulse">
                                <Clock size={48} className="text-yellow-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Verifying Payment</h2>
                            <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                Admin is reviewing your proof. This usually takes about 15 minutes.
                            </p>

                            <div className="text-6xl font-mono font-bold text-white mb-8 tracking-wider tabular-nums">
                                {formatTime(timeLeft)}
                            </div>

                            <div className="bg-white/5 rounded-xl p-4 text-sm text-gray-400 border border-white/10 max-w-sm mx-auto">
                                <div className="flex items-center gap-2 justify-center mb-1 text-yellow-500">
                                    <AlertCircle size={16} />
                                    <span>Status: Pending Approval</span>
                                </div>
                                <p>You will be notified once the artifact is released to your Vault.</p>
                            </div>

                            <Button
                                variant="ghost"
                                className="mt-8 text-gray-500 hover:text-white"
                                onClick={() => router.push('/dashboard/collection')}
                            >
                                Return to Collection
                            </Button>
                        </motion.div>
                    )}

                    {/* STEP 3: SUCCESS */}
                    {step === "success" && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center glass-card p-8 rounded-3xl"
                        >
                            <div className="w-32 h-32 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                                <CheckCircle size={48} className="text-green-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Ritual Complete</h2>
                            <p className="text-gray-400 mb-8">
                                The artifact has been successfully minted and added to your Vault.
                            </p>

                            <Button
                                onClick={() => router.push('/dashboard')}
                                className="w-full py-6 text-lg btn-gradient text-black font-bold flex items-center justify-center gap-2"
                            >
                                Enter The Vault <ArrowRight size={20} />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
