import { NavLink, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Target,
  CheckSquare,
  Zap,
  BarChart2,
  CalendarDays,
  Columns2,
  Settings,
} from "lucide-react"

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", color: "#F59E0B" },
  { to: "/goals", icon: Target, label: "Goals", color: "#60A5FA" },
  { to: "/tasks", icon: CheckSquare, label: "Tasks", color: "#34D399" },
  { to: "/focus", icon: Zap, label: "Focus", color: "#A78BFA" },
  { to: "/history", icon: BarChart2, label: "History", color: "#FB923C" },
  { to: "/calendar", icon: CalendarDays, label: "Calendar", color: "#38BDF8" },
  { to: "/kanban", icon: Columns2, label: "Kanban", color: "#F472B6" },
  { to: "/settings", icon: Settings, label: "Settings", color: "#94A3B8" },
]

export function Dock() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <div className="glass-dock rounded-2xl px-2 py-2 flex items-center gap-0.5 pointer-events-auto">
        {navItems.map(({ to, icon: Icon, label, color }) => {
          const isActive = location.pathname === to
          return (
            <div key={to} className="relative group">
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 backdrop-blur text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {label}
              </div>

              <NavLink to={to} className="block">
                <motion.div
                  whileHover={{ y: -6, scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
                  style={isActive ? { background: `${color}18` } : undefined}
                >
                  <Icon
                    size={20}
                    style={{ color: isActive ? color : undefined }}
                    className={!isActive ? "text-slate-400" : ""}
                  />
                </motion.div>
              </NavLink>

              {isActive && (
                <div
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
