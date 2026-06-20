import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Target,
  CheckSquare,
  Zap,
  BarChart2,
  CalendarDays,
  Columns2,
} from "lucide-react"
import clsx from "clsx"

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/tasks", icon: CheckSquare, label: "Tasks" },
  { to: "/focus", icon: Zap, label: "Focus Mode" },
  { to: "/history", icon: BarChart2, label: "History" },
  { to: "/calendar", icon: CalendarDays, label: "Calendar" },
  { to: "/kanban", icon: Columns2, label: "Kanban" },
]

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-shrink-0 bg-apex-card border-r border-apex-border flex-col">
      <div className="p-5 border-b border-apex-border">
        <div className="font-bold text-xl text-apex-amber">Apex</div>
        <div className="text-apex-muted text-xs mt-0.5">Rank your goals. Focus on what wins.</div>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
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
      </nav>

      <div className="p-4 border-t border-apex-border">
        <p className="text-apex-muted text-xs">Apex Beta v1.0 · One Sentient</p>
      </div>
    </aside>
  )
}
