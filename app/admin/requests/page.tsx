"use client"

import { useState, useEffect } from "react"
import { Check, X, Eye, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function RequestsPage() {
    const router = useRouter()
    const { user } = useAuth()
    const isAdmin = user?.role === 'admin'
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRequests = async () => {
            const { data, error } = await supabase
                .from('mint_requests')
                .select(`
                    *,
                    profiles:user_id (full_name, avatar_url, email)
                `)
                .in('status', ['pending']) // Only show pending requests
                .order('created_at', { ascending: false })

            if (data) {
                setRequests(data)
            }
            setLoading(false)
        }

        fetchRequests()

        const channel = supabase
            .channel('admin_requests')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'mint_requests' }, () => {
                fetchRequests()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    // Success Modal State
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    // Reject Modal State
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState<any>(null)

    const handleVerify = async (req: any) => {
        try {
            // 1. Update Request Status to 'verified'
            const { data, error: reqError } = await supabase
                .from('mint_requests')
                .update({ status: 'verified' })
                .eq('id', req.id)
                .select()

            if (reqError) throw reqError
            if (!data || data.length === 0) {
                throw new Error("Update failed. You may not have Admin permissions or the request no longer exists.")
            }

            // 2. Notification is handled by DB Trigger on 'mint_requests' update

            // Optimistic update
            setRequests(prev => prev.filter(r => r.id !== req.id))
            setShowSuccessModal(true)

        } catch (error: any) {
            console.error("Verification Error Detailed:", error)
            alert("Error verifying payment: " + (error?.message || JSON.stringify(error)))
        }
    }

    const handleReject = (req: any) => {
        setSelectedRequest(req)
        setShowRejectModal(true)
    }

    const confirmReject = async () => {
        if (!selectedRequest) return

        try {
            // 1. Update Request Status
            const { error: reqError } = await supabase
                .from('mint_requests')
                .update({ status: 'rejected' })
                .eq('id', selectedRequest.id)

            if (reqError) throw reqError

            // 2. Notification is handled by DB Trigger

            // Optimistic update
            setRequests(prev => prev.filter(r => r.id !== selectedRequest.id))
            setShowRejectModal(false)
            setSelectedRequest(null)

        } catch (error: any) {
            console.error("Rejection Error Detailed:", error)
            alert("Error rejecting request: " + (error?.message || JSON.stringify(error)))
        }
    }

    return (
        <div className="space-y-6">
            {!isAdmin && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500">
                    <X size={24} />
                    <div>
                        <h3 className="font-bold">Admin Access Required</h3>
                        <p className="text-sm">You are not logged in as an Admin. You cannot verify payments or assign SBTs.</p>
                        <p className="text-xs mt-1 opacity-80">Run the SQL script in Supabase to set your role to 'admin'.</p>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Mint Requests</h1>
                <Link href="/admin/collection">
                    <Button variant="outline" className="gap-2">
                        Go to Collection <ArrowRight size={16} />
                    </Button>
                </Link>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-white/5">
                    <h2 className="font-bold">Pending Payment Verification</h2>
                </div>

                <div className="divide-y divide-white/10">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading requests...</div>
                    ) : requests.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No pending requests</div>
                    ) : (
                        requests.map((req) => (
                            <div key={req.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 transition gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
                                        {req.profiles?.avatar_url ? (
                                            <img src={req.profiles.avatar_url} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            req.profiles?.full_name?.[0] || 'U'
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold">{req.profiles?.full_name || req.profiles?.email || 'Unknown User'}</p>
                                        <div className="flex flex-wrap gap-2 text-sm text-gray-400 mt-1">
                                            <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded text-xs">
                                                <User size={12} /> {req.orange_dynasty_username || 'No Username'}
                                            </span>
                                            <span>• {formatDistanceToNow(new Date(req.created_at))} ago</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 justify-between md:justify-end w-full md:w-auto">
                                    <div className="text-right mr-4">
                                        <p className="font-mono text-secondary text-sm">{req.amount}</p>
                                        {req.payment_proof_url && (
                                            <a
                                                href={req.payment_proof_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-400 flex items-center gap-1 hover:underline justify-end"
                                            >
                                                <Eye size={12} /> View Proof
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleReject(req)}
                                            className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                        >
                                            <X size={16} />
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => handleVerify(req)}
                                            className="bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                        >
                                            <Check size={16} /> Verify Payment
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto border border-green-500/20">
                            <Check size={32} className="text-green-500" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Payment Verified</h2>
                            <p className="text-gray-400">
                                The request has been marked as verified. You can now assign an SBT to this user.
                            </p>
                        </div>

                        <Button
                            onClick={() => router.push('/admin/collection')}
                            className="w-full py-6 text-lg btn-gradient text-black font-bold"
                        >
                            Go to Collection <ArrowRight size={20} className="ml-2" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center gap-3 text-red-500">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                <X size={24} />
                            </div>
                            <h2 className="text-xl font-bold">Reject Request</h2>
                        </div>

                        <div className="space-y-2">
                            <p className="text-gray-400">
                                Are you sure you want to reject the request from <span className="text-white font-bold">{selectedRequest.profiles?.full_name || selectedRequest.profiles?.email}</span>?
                            </p>
                            <p className="text-sm text-gray-500">
                                The user will be notified to check their payment proof.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowRejectModal(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmReject}
                                className="flex-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 border border-red-500/20"
                            >
                                Confirm Reject
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
