import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Simple Header */}
            <header className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </Link>
                <div className="text-xl font-bold tracking-tighter">
                    <span className="text-white">Signi</span>
                    <span className="text-primary">geria</span>
                </div>
            </header>

            <main className="pt-24 px-6 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    )
}
