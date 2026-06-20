import { useState } from "react"
import { KanbanBoard } from "@/components/kanban/KanbanBoard"
import { useGoalStore } from "@/store/goalStore"
import clsx from "clsx"

export function KanbanPage() {
  const goals = useGoalStore((s) => s.goals)
  const [goalFilter, setGoalFilter] = useState("all")

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem-3rem)]">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white">Kanban Board</h1>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 flex-shrink-0 scrollbar-thin">
        <button
          onClick={() => setGoalFilter("all")}
          className={clsx(
            "text-xs px-3 py-1.5 rounded-full transition-colors whitespace-nowrap flex-shrink-0",
            goalFilter === "all"
              ? "bg-apex-amber text-black font-medium"
              : "bg-apex-elevated text-apex-muted hover:text-white"
          )}
        >
          All Goals
        </button>
        {goals.map((g) => (
          <button
            key={g.id}
            onClick={() => setGoalFilter(g.id)}
            className={clsx(
              "text-xs px-3 py-1.5 rounded-full transition-colors whitespace-nowrap flex-shrink-0",
              goalFilter === g.id
                ? "bg-apex-amber text-black font-medium"
                : "bg-apex-elevated text-apex-muted hover:text-white"
            )}
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
