import { useState, type KeyboardEvent } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import { KanbanCard } from "./KanbanCard"
import { Badge } from "@/components/ui/Badge"
import type { Task } from "@/types"
import clsx from "clsx"

interface KanbanColumnProps {
  status: Task["status"]
  tasks: Task[]
  onAddTask: (title: string) => void
}

const columnConfig: Record<Task["status"], { label: string; accent: string; badgeColor: "amber" | "blue" | "green" }> = {
  todo: { label: "To Do", accent: "border-b-amber-400", badgeColor: "amber" },
  in_progress: { label: "In Progress", accent: "border-b-blue-400", badgeColor: "blue" },
  done: { label: "Done", accent: "border-b-green-400", badgeColor: "green" },
}

export function KanbanColumn({ status, tasks, onAddTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status, data: { status } })
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")

  const config = columnConfig[status]

  const submit = () => {
    if (!newTitle.trim()) return
    onAddTask(newTitle.trim())
    setNewTitle("")
    setAdding(false)
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit()
    if (e.key === "Escape") { setAdding(false); setNewTitle("") }
  }

  return (
    <div
      className={clsx(
        "min-w-[280px] w-[280px] flex flex-col bg-apex-card rounded-xl border border-apex-border transition-colors",
        isOver && "border-apex-amber/50"
      )}
    >
      <div className={clsx("p-4 border-b-2 flex items-center justify-between", config.accent)}>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-sm">{config.label}</span>
          <Badge color={config.badgeColor} size="sm">{tasks.length}</Badge>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="text-apex-muted hover:text-white transition-colors p-0.5 rounded"
        >
          <Plus size={16} />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className="p-2 flex-1 overflow-y-auto min-h-[120px] flex flex-col gap-2"
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((t) => (
            <KanbanCard key={t.id} task={t} />
          ))}
        </SortableContext>

        {isOver && tasks.length === 0 && (
          <div className="h-20 border-2 border-dashed border-apex-amber/30 rounded-lg flex items-center justify-center text-apex-amber/50 text-xs">
            Drop here
          </div>
        )}

        {adding && (
          <div className="mt-1">
            <input
              autoFocus
              className="w-full bg-apex-elevated border border-apex-amber rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none placeholder-apex-muted"
              placeholder="Task title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKey}
              onBlur={() => { if (!newTitle.trim()) setAdding(false) }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
