import Link from 'next/link'
import { ShieldAlert } from "lucide-react"

export default function VpnDetectedPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/noise.png')] opacity-5 pointer-events-none" />

            <div className="relative z-10 text-center space-y-6 p-8 max-w-2xl bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                    <ShieldAlert className="text-red-500" size={40} />
                </div>

                <h1 className="text-3xl font-bold text-red-500">
                    Access Restricted
                </h1>

                <div className="space-y-4 text-gray-300">
                    <p className="text-lg font-medium">
                        We detected the use of a VPN or Proxy service.
                    </p>
                    <p>
                        To maintain the integrity of our platform and strictly enforce our <span className="text-white font-bold">One Person, One Account</span> policy, we do not allow connections from VPNs, Proxies, or Data Centers.
                    </p>
                    <p className="text-sm border-t border-white/10 pt-4 mt-4">
                        Please disable your VPN and try again.
                    </p>
                </div>

                <div className="pt-6">
                    <Link href="/" className="text-primary hover:underline">
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
