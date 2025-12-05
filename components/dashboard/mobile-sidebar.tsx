"use client"

import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Sidebar from "@/components/dashboard/sidebar"
import { useEffect, useState } from "react"

export default function MobileSidebar() {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu className="text-white" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-transparent border-none w-72">
                <Sidebar />
            </SheetContent>
        </Sheet>
    )
}
