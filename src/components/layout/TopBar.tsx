import { useLocation } from "react-router-dom"
import { Badge } from "@/components/ui/Badge"

const pageConfig: Record<string, { title: string; color: string }> = {
  "/dashboard": { title: "Dashboard", color: "#F59E0B" },
  "/goals": { title: "Goals", color: "#60A5FA" },
  "/tasks": { title: "Tasks", color: "#34D399" },
  "/focus": { title: "Focus Mode", color: "#A78BFA" },
  "/history": { title: "History", color: "#FB923C" },
  "/calendar": { title: "Calendar", color: "#38BDF8" },
  "/kanban": { title: "Kanban", color: "#F472B6" },
  "/settings": { title: "Settings", color: "#94A3B8" },
}

export function TopBar() {
  const location = useLocation()
  const page = pageConfig[location.pathname] ?? { title: "Apex", color: "#F59E0B" }

  return (
    <header
      className="h-14 flex-shrink-0 flex items-center justify-between px-4 sticky top-0 z-30"
      style={{
        background: "rgba(15,12,29,0.75)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-black text-sm flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #F59E0B, #FBBF24)" }}
        >
          A
        </div>
        <span className="font-semibold text-base" style={{ color: page.color }}>
          {page.title}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Badge color="amber" size="sm">Beta</Badge>
      </div>
    </header>
  )
}
