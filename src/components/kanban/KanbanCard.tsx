import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Pencil } from "lucide-react"
import { useGoalStore } from "@/store/goalStore"
import { Badge } from "@/components/ui/Badge"
import { TaskForm } from "@/components/tasks/TaskForm"
import { fmtDate, isOverdue } from "@/utils/formatters"
import type { Task } from "@/types"
import clsx from "clsx"

const priorityDot: Record<Task["priority"], string> = {
  low: "bg-green-400",
  medium: "bg-amber-400",
  high: "bg-orange-400",
  urgent: "bg-red-400",
}

interface KanbanCardProps {
  task: Task
  isDragOverlay?: boolean
}

export function KanbanCard({ task, isDragOverlay }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "Task", task, status: task.status },
  })
  const goals = useGoalStore((s) => s.goals)
  const [editing, setEditing] = useState(false)

  const goal = goals.find((g) => g.id === task.goal_id)
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={clsx(
          "bg-apex-elevated border border-apex-border rounded-lg p-3 cursor-grab active:cursor-grabbing select-none hover:border-apex-amber/40 transition-colors",
          isDragging && !isDragOverlay && "opacity-30",
          isDragOverlay && "shadow-2xl scale-105 cursor-grabbing opacity-100"
        )}
      >
        <div className="flex items-start gap-2">
          <div {...listeners} className="text-apex-muted hover:text-white mt-0.5 flex-shrink-0">
            <GripVertical size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white break-words">{task.title}</p>
            {goal && (
              <div className="mt-1.5">
                <Badge color="amber" size="sm">{goal.emoji} {goal.title}</Badge>
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot[task.priority]}`} />
              {task.due_date && (
                <Badge color={isOverdue(task.due_date) ? "red" : "gray"} size="sm">
                  {fmtDate(task.due_date)}
                </Badge>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setEditing(true) }}
                className="ml-auto text-apex-muted hover:text-white p-0.5 rounded transition-colors"
              >
                <Pencil size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {editing && <TaskForm task={task} onClose={() => setEditing(false)} />}
    </>
  )
}
