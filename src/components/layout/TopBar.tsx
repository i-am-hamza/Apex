import { useLocation } from "react-router-dom"
import { Menu, GitBranch } from "lucide-react"
import { useUIStore } from "@/store/uiStore"
import { Badge } from "@/components/ui/Badge"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/goals": "Goals",
  "/tasks": "Tasks",
  "/focus": "Focus Mode",
  "/history": "History",
  "/calendar": "Calendar",
  "/kanban": "Kanban",
}

export function TopBar() {
  const location = useLocation()
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen)
  const title = pageTitles[location.pathname] ?? "Apex"

  return (
    <header className="h-14 flex-shrink-0 flex items-center justify-between px-4 bg-apex-card/80 backdrop-blur border-b border-apex-border">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-apex-muted hover:text-white transition-colors p-1"
        >
          <Menu size={20} />
        </button>
        <span className="font-semibold text-white">{title}</span>
      </div>

      <div className="flex items-center gap-3">
        <Badge color="amber" size="sm">Beta</Badge>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-apex-muted hover:text-white transition-colors p-1"
        >
          <GitBranch size={18} />
        </a>
      </div>
    </header>
  )
}
