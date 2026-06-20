import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"
import { MobileNav } from "./MobileNav"
import { OfflineIndicator } from "./OfflineIndicator"
import { Toast } from "@/components/ui/Toast"
import { useUIStore } from "@/store/uiStore"
import { X } from "lucide-react"
import clsx from "clsx"

function MobileSidebarOverlay() {
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-64 lg:hidden"
          >
            <div className="h-full bg-apex-card border-r border-apex-border flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-apex-border">
                <div>
                  <div className="font-bold text-xl text-apex-amber">Apex</div>
                  <div className="text-apex-muted text-xs mt-0.5">Rank your goals. Focus on what wins.</div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-apex-muted hover:text-white p-1">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 p-3">
                {/* Mobile sidebar nav items rendered inline */}
                <MobileNavLinks onNavigate={() => setSidebarOpen(false)} />
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

import { NavLink } from "react-router-dom"
import { LayoutDashboard, Target, CheckSquare, Zap, BarChart2, CalendarDays, Columns2 } from "lucide-react"

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/tasks", icon: CheckSquare, label: "Tasks" },
  { to: "/focus", icon: Zap, label: "Focus Mode" },
  { to: "/history", icon: BarChart2, label: "History" },
  { to: "/calendar", icon: CalendarDays, label: "Calendar" },
  { to: "/kanban", icon: Columns2, label: "Kanban" },
]

function MobileNavLinks({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex flex-col gap-0.5">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              isActive
                ? "bg-apex-elevated text-white border-l-2 border-apex-amber pl-[10px]"
                : "text-apex-muted hover:text-white hover:bg-apex-elevated/50"
            )
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </div>
  )
}

function InstallBanner() {
  const { installPrompt, setInstallPrompt } = useUIStore()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!installPrompt || localStorage.getItem("apex-no-install")) return
    const timer = setTimeout(() => setShow(true), 20000)
    return () => clearTimeout(timer)
  }, [installPrompt])

  if (!show || !installPrompt) return null

  const dismiss = () => {
    localStorage.setItem("apex-no-install", "1")
    setInstallPrompt(null)
    setShow(false)
  }

  const install = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (installPrompt as any).prompt()
    setInstallPrompt(null)
    setShow(false)
  }

  return (
    <div className="fixed bottom-16 lg:bottom-0 inset-x-0 z-30 bg-gradient-to-r from-amber-600 to-amber-500 text-black py-3 px-4 flex items-center justify-between gap-4">
      <span className="text-sm font-medium">📱 Install Apex for the best experience</span>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button onClick={install} className="text-sm font-bold bg-black text-amber-400 px-3 py-1 rounded-lg">
          Install
        </button>
        <button onClick={dismiss} className="text-sm opacity-70 hover:opacity-100">
          Not now
        </button>
      </div>
    </div>
  )
}

export function AppShell() {
  const { setInstallPrompt, ambientMode } = useUIStore()

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [setInstallPrompt])

  return (
    <div className="flex h-screen bg-apex-dark overflow-hidden">
      <div className={clsx("transition-all duration-300", ambientMode && "opacity-0 pointer-events-none")}>
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className={clsx("transition-all duration-300", ambientMode && "opacity-0 pointer-events-none")}>
          <TopBar />
        </div>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-thin pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileSidebarOverlay />
      <MobileNav />
      <OfflineIndicator />
      <Toast />
      <InstallBanner />
    </div>
  )
}
