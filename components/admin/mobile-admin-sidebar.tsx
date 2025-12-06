"use client"

import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { useEffect, useState } from "react"

export default function MobileAdminSidebar() {
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
                <SheetTitle className="hidden">Navigation Menu</SheetTitle>
                <SheetDescription className="hidden">
                    Mobile navigation sidebar for admin dashboard
                </SheetDescription>
                <AdminSidebar />
            </SheetContent>
        </Sheet>
    )
}
