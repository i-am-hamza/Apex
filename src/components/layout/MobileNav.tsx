import { NavLink } from "react-router-dom"
import { LayoutDashboard, Target, CheckSquare, Zap, Columns2 } from "lucide-react"
import clsx from "clsx"

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/tasks", icon: CheckSquare, label: "Tasks" },
  { to: "/focus", icon: Zap, label: "Focus" },
  { to: "/kanban", icon: Columns2, label: "Kanban" },
]

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 h-16 bg-apex-card border-t border-apex-border z-30 pb-safe">
      <div className="grid grid-cols-5 h-full">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors relative",
                isActive ? "text-apex-amber" : "text-apex-muted"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute top-1 w-1 h-1 rounded-full bg-apex-amber" />
                )}
                <Icon size={20} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
