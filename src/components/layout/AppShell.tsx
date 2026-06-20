import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { TopBar } from "./TopBar"
import { Dock } from "./Dock"
import { OfflineIndicator } from "./OfflineIndicator"
import { Toast } from "@/components/ui/Toast"
import { useUIStore } from "@/store/uiStore"

export function AppShell() {
  const { setInstallPrompt } = useUIStore()

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [setInstallPrompt])

  return (
    <div className="flex flex-col min-h-dvh">
      <TopBar />
      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-28 lg:px-6 lg:pt-6 lg:pb-28 scrollbar-thin relative z-10">
        <Outlet />
      </main>
      <Dock />
      <OfflineIndicator />
      <Toast />
    </div>
  )
}
