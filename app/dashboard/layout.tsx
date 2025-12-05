import Header from "@/components/dashboard/header"
import Sidebar from "@/components/dashboard/sidebar"
import BackgroundEffects from "@/components/ui/background-effects"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full relative min-h-screen bg-background">
            <BackgroundEffects />
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
                <Sidebar />
            </div>
            <main className="md:pl-72 pb-10">
                <Header />
                <div className="px-4 md:px-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
