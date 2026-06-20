import { useState } from "react"
import { KanbanBoard } from "@/components/kanban/KanbanBoard"
import { useGoalStore } from "@/store/goalStore"
import clsx from "clsx"

export function KanbanPage() {
  const goals = useGoalStore((s) => s.goals)
  const [goalFilter, setGoalFilter] = useState("all")

  const pillBase = "text-xs px-3 py-1.5 rounded-full transition-colors whitespace-nowrap flex-shrink-0"
  const pillActive = "bg-apex-amber text-black font-semibold"
  const pillInactive = "bg-white/5 text-slate-400 hover:text-white"

  return (
    <div className="flex flex-col h-[calc(100dvh-3.5rem-7rem)]">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white">Kanban Board</h1>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 flex-shrink-0 scrollbar-thin">
        <button
          onClick={() => setGoalFilter("all")}
          className={clsx(pillBase, goalFilter === "all" ? pillActive : pillInactive)}
        >
          All Goals
        </button>
        {goals.map((g) => (
          <button
            key={g.id}
            onClick={() => setGoalFilter(g.id)}
            className={clsx(pillBase, goalFilter === g.id ? pillActive : pillInactive)}
          >
            {g.emoji} {g.title}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <KanbanBoard goalFilter={goalFilter} />
      </div>
    </div>
  )
}
