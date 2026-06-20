import { useState } from "react"
import { SlidePanel } from "@/components/ui/SlidePanel"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useTaskStore } from "@/store/taskStore"
import { useGoalStore } from "@/store/goalStore"
import { useUIStore } from "@/store/uiStore"
import type { Task } from "@/types"

interface TaskFormProps {
  task?: Task
  goalId?: string
  onClose: () => void
}

export function TaskForm({ task, goalId, onClose }: TaskFormProps) {
  const { addTask, updateTask } = useTaskStore()
  const goals = useGoalStore((s) => s.goals)
  const addToast = useUIStore((s) => s.addToast)

  const [title, setTitle] = useState(task?.title ?? "")
  const [description, setDescription] = useState(task?.description ?? "")
  const [selectedGoalId, setSelectedGoalId] = useState(task?.goal_id ?? goalId ?? "")
  const [status, setStatus] = useState<Task["status"]>(task?.status ?? "todo")
  const [priority, setPriority] = useState<Task["priority"]>(task?.priority ?? "medium")
  const [dueDate, setDueDate] = useState(task?.due_date ?? "")
  const [loading, setLoading] = useState(false)

  const handleSave = () => {
    if (!title.trim() || !selectedGoalId) return
    setLoading(true)

    const allTasks = useTaskStore.getState().getAllTasks()
    const goalTasks = allTasks.filter((t) => t.goal_id === selectedGoalId)

    if (task) {
      updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        goal_id: selectedGoalId,
        status,
        priority,
        due_date: dueDate || undefined,
      })
      addToast("success", "Task updated!")
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        goal_id: selectedGoalId,
        status,
        priority,
        due_date: dueDate || undefined,
        sort_order: goalTasks.length,
      })
      addToast("success", "Task added!")
    }

    setLoading(false)
    onClose()
  }

  const priorityColors: Record<Task["priority"], string> = {
    low: "#34D399",
    medium: "#F59E0B",
    high: "#FB923C",
    urgent: "#F87171",
  }

  const selectClass = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-apex-amber/60 transition-colors"

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
      <Button
        onClick={handleSave}
        loading={loading}
        disabled={!title.trim() || !selectedGoalId}
      >
        {task ? "Save Changes" : "Add Task"}
      </Button>
    </>
  )

  return (
    <SlidePanel
      isOpen
      onClose={onClose}
      title={task ? "Edit Task" : "Add Task"}
      width="480px"
      footer={footer}
    >
      <div className="flex flex-col gap-4">
        {!goalId && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Goal</label>
            <select
              className={selectClass}
              value={selectedGoalId}
              onChange={(e) => setSelectedGoalId(e.target.value)}
            >
              <option value="">Select a goal...</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.emoji} {g.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <Input
          label="Title"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Status</label>
            <select
              className={selectClass}
              value={status}
              onChange={(e) => setStatus(e.target.value as Task["status"])}
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Priority</label>
            <select
              className={selectClass}
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task["priority"])}
            >
              {(["low", "medium", "high", "urgent"] as Task["priority"][]).map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(["low", "medium", "high", "urgent"] as Task["priority"][]).map((p) => (
            <div key={p} className="flex items-center gap-1.5 text-xs text-apex-muted">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityColors[p] }} />
              {p}
            </div>
          ))}
        </div>

        <Input
          label="Due Date (optional)"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300">Description (optional)</label>
          <textarea
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-apex-amber/60 focus:ring-1 focus:ring-amber-500/30 transition-colors resize-none"
            placeholder="Additional details..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
    </SlidePanel>
  )
}
