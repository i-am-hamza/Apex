import { useState } from "react"
import { Pencil, Trash2, GripVertical } from "lucide-react"
import { useTaskStore } from "@/store/taskStore"
import { useGoalStore } from "@/store/goalStore"
import { useUIStore } from "@/store/uiStore"
import { fmtDate, isOverdue } from "@/utils/formatters"
import { Badge } from "@/components/ui/Badge"
import { TaskForm } from "./TaskForm"
import type { Task } from "@/types"
import clsx from "clsx"

interface TaskCardProps {
  task: Task
  showGoalName?: boolean
  showDragHandle?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragListeners?: Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragAttributes?: Record<string, any>
}

const priorityDot: Record<Task["priority"], string> = {
  low: "bg-green-400",
  medium: "bg-amber-400",
  high: "bg-orange-400",
  urgent: "bg-red-400",
}

export function TaskCard({
  task,
  showGoalName,
  showDragHandle,
  dragListeners,
  dragAttributes,
}: TaskCardProps) {
  const { updateTask, deleteTask } = useTaskStore()
  const goals = useGoalStore((s) => s.goals)
  const addToast = useUIStore((s) => s.addToast)
  const [editing, setEditing] = useState(false)

  const goal = goals.find((g) => g.id === task.goal_id)
  const isDone = task.status === "done"

  const toggleDone = () => {
    updateTask(task.id, { status: isDone ? "todo" : "done" })
  }

  const handleDelete = () => {
    if (window.confirm("Delete this task?")) {
      deleteTask(task.id)
      addToast("info", "Task deleted")
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 p-3 bg-apex-card border border-apex-border rounded-lg hover:border-apex-border/80 transition-colors group">
        {showDragHandle && (
          <div
            {...dragListeners}
            {...dragAttributes}
            className="text-apex-muted hover:text-white cursor-grab active:cursor-grabbing flex-shrink-0"
          >
            <GripVertical size={14} />
          </div>
        )}

        <button
          onClick={toggleDone}
          className={clsx(
            "w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors",
            isDone
              ? "bg-green-500 border-green-500"
              : "border-apex-border hover:border-apex-amber"
          )}
        >
          {isDone && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={clsx("text-sm text-white truncate", isDone && "line-through opacity-50")}
            >
              {task.title}
            </span>
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot[task.priority]}`} />
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {task.due_date && !isDone && (
              <Badge color={isOverdue(task.due_date) ? "red" : "gray"} size="sm">
                {fmtDate(task.due_date)}
              </Badge>
            )}
            {showGoalName && goal && (
              <Badge color="amber" size="sm">
                {goal.emoji} {goal.title}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="p-1 text-apex-muted hover:text-white rounded transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-apex-muted hover:text-red-400 rounded transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {editing && <TaskForm task={task} onClose={() => setEditing(false)} />}
    </>
  )
}
