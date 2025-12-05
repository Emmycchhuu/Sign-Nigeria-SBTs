import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/noise.png')] opacity-5 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="relative z-10 text-center space-y-6 p-8">
                <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    404
                </h1>
                <h2 className="text-2xl font-bold">Page Not Found</h2>
                <p className="text-gray-400 max-w-md mx-auto">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <Link href="/">
                    <Button className="btn-gradient px-8 py-6 text-lg font-bold text-black mt-4">
                        Go Home
                    </Button>
                </Link>
            </div>
        </div>
    )
}
