import { useEffect, useState } from "react"
import { WifiOff } from "lucide-react"
import { useUIStore } from "@/store/uiStore"

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const addToast = useUIStore((s) => s.addToast)

  useEffect(() => {
    const goOffline = () => setIsOffline(true)
    const goOnline = () => {
      setIsOffline(false)
      addToast("success", "✓ Back online")
    }
    window.addEventListener("offline", goOffline)
    window.addEventListener("online", goOnline)
    return () => {
      window.removeEventListener("offline", goOffline)
      window.removeEventListener("online", goOnline)
    }
  }, [addToast])

  if (!isOffline) return null

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-red-950 text-red-200 text-xs py-2 text-center flex items-center justify-center gap-1.5">
      <WifiOff size={12} />
      You're offline — data saved locally
    </div>
  )
}
