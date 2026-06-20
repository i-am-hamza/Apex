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

const priorityColors: Record<Task["priority"], string> = {
  low: "#34D399",
  medium: "#F59E0B",
  high: "#FB923C",
  urgent: "#F87171",
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
          "glass rounded-xl p-3 cursor-grab active:cursor-grabbing select-none hover:border-white/20 transition-all",
          isDragging && !isDragOverlay && "opacity-30",
          isDragOverlay && "shadow-2xl scale-105 cursor-grabbing opacity-100"
        )}
      >
        <div className="flex items-start gap-2">
          <div {...listeners} className="text-slate-500 hover:text-slate-300 mt-0.5 flex-shrink-0">
            <GripVertical size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white break-words">{task.title}</p>
            {goal && (
              <div className="mt-1.5">
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{
                    background: `${goal.color}18`,
                    color: goal.color,
                    border: `1px solid ${goal.color}30`,
                  }}
                >
                  {goal.emoji} {goal.title}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: priorityColors[task.priority] }}
              />
              {task.due_date && (
                <Badge color={isOverdue(task.due_date) ? "red" : "gray"} size="sm">
                  {fmtDate(task.due_date)}
                </Badge>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setEditing(true) }}
                className="ml-auto text-slate-400 hover:text-white p-0.5 rounded transition-colors"
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
