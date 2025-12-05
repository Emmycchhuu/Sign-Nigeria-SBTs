"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Gift, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function AdminCollectionPage() {
    const [items, setItems] = useState<any[]>([])
    const [filter, setFilter] = useState<'all' | 'minted' | 'available'>('all')
    const [searchQuery, setSearchQuery] = useState("")

    // Assignment Modal
    const [selectedSbt, setSelectedSbt] = useState<any>(null)
    const [verifiedUsers, setVerifiedUsers] = useState<any[]>([])
    const [selectedUserId, setSelectedUserId] = useState<string>("")
    const [isAssigning, setIsAssigning] = useState(false)

    const [isAdmin, setIsAdmin] = useState(true)

    useEffect(() => {
        fetchItems()
        fetchVerifiedUsers()

        // Check current user role
        const checkUserRole = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()
                
                if (profile?.role !== 'admin') {
                    setIsAdmin(false)
                }
            }
        }
        checkUserRole()

        const channel = supabase
            .channel('admin_collection')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'sbts' }, fetchItems)
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const fetchItems = async () => {
        const { data } = await supabase
            .from('sbts')
            .select('*')
            .order('id', { ascending: true })
        if (data) setItems(data)
    }

    const fetchVerifiedUsers = async () => {
        // Fetch users who have a 'verified' mint request but no SBT assigned yet
        const { data } = await supabase
            .from('mint_requests')
            .select(`
                user_id,
                profiles:user_id (id, full_name, email, username)
            `)
            .eq('status', 'verified')

        if (data) {
            // Deduplicate users if needed
            const users = data.map((req: any) => req.profiles).filter(Boolean)
            // Remove duplicates based on ID
            const uniqueUsers = Array.from(new Map(users.map((u: any) => [u.id, u])).values())
            setVerifiedUsers(uniqueUsers)
        }
    }

    const filteredItems = items.filter(item => {
        const matchesFilter = filter === 'all' || item.status === filter
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.id.toString().includes(searchQuery)
        return matchesFilter && matchesSearch
    })

    const openAssignModal = (item: any) => {
        setSelectedSbt(item)
        setSelectedUserId("")
        setIsAssigning(true)
        fetchVerifiedUsers() // Refresh list
    }

    const handleAssign = async () => {
        if (!selectedSbt || !selectedUserId) return

        try {
            // 1. Update SBT
            const { error: sbtError } = await supabase
                .from('sbts')
                .update({
                    owner_id: selectedUserId,
                    status: 'minted',
                    minted_at: new Date().toISOString()
                })
                .eq('id', selectedSbt.id)

            if (sbtError) throw sbtError

            // 2. Update Mint Request (Find the verified request for this user)
            // We need to find the specific request ID. For simplicity, we'll take the latest 'verified' one.
            const { data: reqData } = await supabase
                .from('mint_requests')
                .select('id')
                .eq('user_id', selectedUserId)
                .eq('status', 'verified')
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            if (reqData) {
                await supabase
                    .from('mint_requests')
                    .update({
                        status: 'approved',
                        sbt_id: selectedSbt.id
                    })
                    .eq('id', reqData.id)
            }

            // 3. Notify User
            await supabase.from('notifications').insert({
                user_id: selectedUserId,
                title: "You received a Gift!",
                message: `You have been gifted ${selectedSbt.name} by the Admin! Check your Vault.`,
                read: false
            })

            setIsAssigning(false)
            setSelectedSbt(null)
            alert("SBT Assigned Successfully!")
            fetchVerifiedUsers() // Refresh list

        } catch (error: any) {
            console.error("Assignment Error:", error)
            alert("Error assigning SBT: " + error.message)
        }
    }

    return (
        <div className="space-y-6">
            {!isAdmin && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500">
                    <Lock size={24} />
                    <div>
                        <h3 className="font-bold">Admin Access Required</h3>
                        <p className="text-sm">You are not logged in as an Admin. You cannot assign SBTs.</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Collection Inventory</h1>

                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-primary/50 outline-none w-40 md:w-64"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none"
                    >
                        <option value="all">All Items</option>
                        <option value="available">Available</option>
                        <option value="minted">Minted</option>
                    </select>
                </div>
            </div>

            {/* Grid - Replicating User Side Responsive Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredItems.map((item) => (
                    <div
                        key={item.id}
                        className={`group relative aspect-[3/4] rounded-xl border transition-all duration-300 overflow-hidden ${item.status === 'minted'
                            ? 'bg-gradient-to-br from-gray-900 to-black border-white/20'
                            : 'bg-black/40 border-white/5 opacity-80 hover:opacity-100 hover:border-primary/50'
                            }`}
                    >
                        {/* Card Content */}
                        <div className="absolute inset-0 flex flex-col justify-between">

                            {/* Image Placeholder */}
                            <div className="absolute inset-0 bg-black/50">
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                        {item.status === 'minted' ? (
                                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-3xl">🦁</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-700 text-4xl opacity-20">?</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Top Right: Status Badge or Owner */}
                            <div className="absolute top-2 right-2 z-10">
                                {item.status === 'minted' ? (
                                    <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <p className="text-[10px] text-white font-mono">Minted</p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => openAssignModal(item)}
                                        className="bg-primary hover:bg-primary/80 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-primary/20 flex items-center gap-1 transition-all"
                                    >
                                        <Gift size={12} /> Assign
                                    </button>
                                )}
                            </div>

                            {/* Bottom Info */}
                            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
                                <h3 className="text-white font-bold text-sm truncate">{item.name}</h3>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-xs text-primary font-mono">#{String(item.id).padStart(3, '0')}</p>
                                    <span className="text-[10px] text-gray-400 uppercase">{item.rarity}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Assignment Dialog */}
            <Dialog open={isAssigning} onOpenChange={setIsAssigning}>
                <DialogContent className="bg-[#111] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Gift Artifact #{selectedSbt?.id}</DialogTitle>
                        <DialogDescription>
                            Assign <strong>{selectedSbt?.name}</strong> to a verified user.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm text-gray-400">Select Verified User</label>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={fetchVerifiedUsers}
                                className="h-6 text-xs text-primary hover:text-primary/80"
                            >
                                Refresh List
                            </Button>
                        </div>
                        {verifiedUsers.length === 0 ? (
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-500 text-sm">
                                No users with verified payments found. Verify a payment in "Requests" first.
                            </div>
                        ) : (
                            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Select a user..." />
                                </SelectTrigger>
                                <SelectContent className="bg-[#111] border-white/10 text-white max-h-[200px]">
                                    {verifiedUsers.map((u) => (
                                        <SelectItem key={u.id} value={u.id}>
                                            {u.full_name || u.email} ({u.username || 'No user'})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsAssigning(false)}>Cancel</Button>
                        <Button onClick={handleAssign} disabled={!selectedUserId} className="btn-gradient text-black font-bold">
                            <Gift size={16} className="mr-2" /> Confirm Assignment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
