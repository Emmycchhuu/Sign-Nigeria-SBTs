"use client"

import Link from "next/link"
import { Search } from "lucide-react"

export default function NavMenu() {
    const navLinks = ["Home", "Explore", "About", "Collections", "Team", "Contact"]

    return (
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full z-50 relative">
            {/* Logo */}
            <Link href="/">
                <div className="text-2xl font-bold tracking-tighter flex items-center gap-1">
                    <span className="text-white">Signi</span>
                    <span className="text-primary">geria</span>
                </div>
            </Link>

            {/* Center Links */}
            <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                    <Link key={link} href={`#${link.toLowerCase()}`} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        {link}
                    </Link>
                ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <button className="p-2 text-gray-300 hover:text-white transition-colors">
                    <Search size={20} />
                </button>
                <Link href="/login">
                    <button className="hidden md:block px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Sign In
                    </button>
                </Link>
                <Link href="/signup">
                    <button className="px-6 py-2 rounded-full btn-gradient text-sm font-medium">
                        Sign Up
                    </button>
                </Link>
            </div>
        </nav>
    )
}
