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

const columnConfig: Record<
  Task["status"],
  { label: string; accentColor: string; badgeColor: "amber" | "blue" | "green" }
> = {
  todo: { label: "To Do", accentColor: "#F59E0B", badgeColor: "amber" },
  in_progress: { label: "In Progress", accentColor: "#60A5FA", badgeColor: "blue" },
  done: { label: "Done", accentColor: "#34D399", badgeColor: "green" },
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
        "min-w-[280px] w-[280px] flex flex-col glass rounded-xl transition-all",
        isOver && "border-white/20"
      )}
    >
      <div
        className="p-4 border-b-2 flex items-center justify-between rounded-t-xl"
        style={{ borderBottomColor: config.accentColor }}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-sm">{config.label}</span>
          <Badge color={config.badgeColor} size="sm">{tasks.length}</Badge>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="text-slate-400 hover:text-white transition-colors p-0.5 rounded"
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
          <div
            className="h-20 border-2 border-dashed rounded-xl flex items-center justify-center text-xs"
            style={{ borderColor: `${config.accentColor}40`, color: `${config.accentColor}80` }}
          >
            Drop here
          </div>
        )}

        {adding && (
          <div className="mt-1">
            <input
              autoFocus
              className="w-full bg-white/5 border border-apex-amber/40 rounded-xl px-3 py-1.5 text-white text-sm focus:outline-none placeholder-slate-500"
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
