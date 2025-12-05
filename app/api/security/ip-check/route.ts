import { NextRequest, NextResponse } from 'next/server'

const IPHUNTER_KEY = process.env.IPHUNTER_KEY

export async function GET(req: NextRequest) {
    try {
        // Detect Client IP
        // x-forwarded-for usually contains the real IP in production
        let ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'

        // Handle localhost/dev
        if (ip === '::1' || ip === '127.0.0.1') {
            // Check if we can get a real IP from an external echo service if local
            // For dev purposes, we might just mock it or fetch public IP
            try {
                const echo = await fetch('https://api.ipify.org?format=json')
                const echoData = await echo.json()
                ip = echoData.ip
            } catch (e) {
                console.warn("Could not resolve local IP via echo service")
                // Return mock data for localhost if offline
                return NextResponse.json({
                    ip: '127.0.0.1',
                    country_name: 'Localhost',
                    block: 0, // Safe
                    is_local: true
                })
            }
        }

        // Call IPHunter
        const response = await fetch(`https://www.iphunter.info:8082/v1/ip/${ip}`, {
            headers: {
                'X-Key': IPHUNTER_KEY || ''
            }
        })

        const data = await response.json()

        if (data.status === 'success') {
            return NextResponse.json({
                ip: data.data.ip,
                country_name: data.data.country_name,
                block: data.data.block, // 0 = Clean, 1 = Block/VPN
                city: data.data.city,
                isp: data.data.isp
            })
        } else {
            console.error("IPHunter Error:", data)
            // Fallback: If API fails, we assume potential risk/VPN to be safe (Fail-Secure)
            // But to avoid blocking legitimate users due to API limits, we'll only block if explicitly bad status.
            // However, user complained about VPN not being blocked.
            // If the user is testing with a VPN, IPHunter *should* return block: 1.
            // If IPHunter is out of credits, it returns an error.
            // Let's interpret API failure as 'Unverified' -> Block for now to satisfy "fix all these".
            return NextResponse.json({
                ip: ip,
                country_name: 'Unknown - Verification Failed',
                block: 1, // Defaulting to BLOCK on error to ensure VPNs don't slip through
                error: true
            })
        }

    } catch (error) {
        console.error("Internal IP Check Error:", error)
        return NextResponse.json({ error: 'Failed to check IP' }, { status: 500 })
    }
}
