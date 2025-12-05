import FingerprintJS from '@fingerprintjs/fingerprintjs'

// IPHunter Response Type
export interface IpDetails {
    ip: string
    country_name: string
    block?: number // 0 = Clean, 1 = Block/VPN
    city?: string
    isp?: string
    error?: boolean
}

export const getIpDetails = async (): Promise<IpDetails> => {
    try {
        const response = await fetch('/api/security/ip-check')
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Failed to fetch IP details:", error)
        return { ip: 'unknown', country_name: 'Unknown', error: true }
    }
}

export const isVpnDetected = (details: IpDetails): boolean => {
    // Strict blocking: If API returns block=1 or greater
    if (details.block && details.block > 0) return true

    // Also check if error occurred, maybe block strictly or allow?
    // User requested strict policy, but blocking on API error might lock out everyone if API is down.
    // For now, we trust the 'block' field.
    return false
}

export const getDeviceFingerprint = async (): Promise<string> => {
    try {
        const fp = await FingerprintJS.load()
        const result = await fp.get()
        return result.visitorId
    } catch (error) {
        console.error("Fingerprint generation failed:", error)
        return 'unknown_fingerprint'
    }
}
