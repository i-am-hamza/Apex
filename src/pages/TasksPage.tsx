import { useState } from "react"
import { Plus, CheckCircle, Clock, AlertTriangle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { TaskCard } from "@/components/tasks/TaskCard"
import { TaskForm } from "@/components/tasks/TaskForm"
import { useTaskStore } from "@/store/taskStore"
import { useGoalStore } from "@/store/goalStore"
import { isOverdue, isDueToday } from "@/utils/formatters"
import { isThisWeek } from "date-fns"
import type { Task } from "@/types"
import clsx from "clsx"

type StatusFilter = "all" | Task["status"]
type PriorityFilter = "all" | Task["priority"]
type GroupBy = "goal" | "status" | "due"

const statusLabels: Record<Task["status"], string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
}

export function TasksPage() {
  const getAllTasks = useTaskStore((s) => s.getAllTasks)
  const goals = useGoalStore((s) => s.goals)
  const [showForm, setShowForm] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all")
  const [goalFilter, setGoalFilter] = useState("all")
  const [groupBy, setGroupBy] = useState<GroupBy>("goal")

  const tasks = getAllTasks()

  const totalDoneToday = tasks.filter(
    (t) => t.completed_at && isDueToday(t.completed_at)
  ).length
  const overdue = tasks.filter((t) => t.due_date && isOverdue(t.due_date) && t.status !== "done").length
  const dueThisWeek = tasks.filter(
    (t) => t.due_date && isThisWeek(new Date(t.due_date), { weekStartsOn: 1 }) && t.status !== "done"
  ).length

  const filtered = tasks.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false
    if (goalFilter !== "all" && t.goal_id !== goalFilter) return false
    return true
  })

  const grouped: Record<string, Task[]> = {}
  if (groupBy === "goal") {
    for (const goal of goals) {
      const gt = filtered.filter((t) => t.goal_id === goal.id)
      if (gt.length) grouped[goal.id] = gt
    }
  } else if (groupBy === "status") {
    for (const s of ["todo", "in_progress", "done"] as Task["status"][]) {
      const st = filtered.filter((t) => t.status === s)
      if (st.length) grouped[s] = st
    }
  } else {
    const overdueTasks = filtered.filter((t) => t.due_date && isOverdue(t.due_date))
    const todayTasks = filtered.filter((t) => t.due_date && isDueToday(t.due_date))
    const weekTasks = filtered.filter(
      (t) =>
        t.due_date &&
        isThisWeek(new Date(t.due_date), { weekStartsOn: 1 }) &&
        !isOverdue(t.due_date) &&
        !isDueToday(t.due_date)
    )
    const rest = filtered.filter((t) => !t.due_date)
    if (overdueTasks.length) grouped["Overdue"] = overdueTasks
    if (todayTasks.length) grouped["Today"] = todayTasks
    if (weekTasks.length) grouped["This Week"] = weekTasks
    if (rest.length) grouped["No Due Date"] = rest
  }

  const pillBase = "text-xs px-2.5 py-1 rounded-full transition-colors"
  const pillActive = "bg-apex-amber text-black font-semibold"
  const pillInactive = "bg-white/5 text-slate-400 hover:text-white hover:bg-white/8"

  const statCards = [
    { label: "Total Tasks", value: tasks.length, icon: CheckCircle, color: "#F1F5F9" },
    { label: "Done Today", value: totalDoneToday, icon: CheckCircle, color: "#34D399" },
    { label: "Overdue", value: overdue, icon: AlertTriangle, color: "#F87171" },
    { label: "Due This Week", value: dueThisWeek, icon: Calendar, color: "#F59E0B" },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Tasks</h1>
        <Button onClick={() => setShowForm(true)} leftIcon={<Plus size={16} />}>
          Add Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-3 right-3 opacity-10" style={{ color: stat.color }}>
              <stat.icon size={48} />
            </div>
            <div className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-apex-muted text-sm mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-apex-muted">Status:</span>
          {(["all", "todo", "in_progress", "done"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={clsx(pillBase, statusFilter === s ? pillActive : pillInactive)}
            >
              {s === "all" ? "All" : statusLabels[s as Task["status"]]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-apex-muted">Priority:</span>
          {(["all", "low", "medium", "high", "urgent"] as PriorityFilter[]).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={clsx(pillBase, "capitalize", priorityFilter === p ? pillActive : pillInactive)}
            >
              {p === "all" ? "All" : p}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-apex-muted">Goal:</span>
            <select
              className="bg-white/5 border border-white/10 rounded-xl px-2 py-1 text-white text-xs focus:outline-none"
              value={goalFilter}
              onChange={(e) => setGoalFilter(e.target.value)}
            >
              <option value="all">All Goals</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>{g.emoji} {g.title}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            {(["goal", "status", "due"] as GroupBy[]).map((g) => (
              <button
                key={g}
                onClick={() => setGroupBy(g)}
                className={clsx(pillBase, "capitalize", groupBy === g ? pillActive : pillInactive)}
              >
                {g === "due" ? "Due Date" : `By ${g.charAt(0).toUpperCase() + g.slice(1)}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-6">
        {Object.entries(grouped).map(([groupKey, groupTasks]) => {
          const label = groupBy === "goal"
            ? goals.find((g) => g.id === groupKey)
              ? `${goals.find((g) => g.id === groupKey)!.emoji} ${goals.find((g) => g.id === groupKey)!.title}`
              : groupKey
            : groupBy === "status"
            ? statusLabels[groupKey as Task["status"]] ?? groupKey
            : groupKey

          return (
            <div key={groupKey}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-white text-sm">{label}</h3>
                <span className="text-xs text-apex-muted bg-white/5 px-1.5 py-0.5 rounded-full">
                  {groupTasks.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {groupTasks.map((t) => (
                  <TaskCard key={t.id} task={t} showGoalName={groupBy !== "goal"} />
                ))}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-apex-muted">
            <Clock size={40} className="mx-auto mb-3 opacity-30" />
            <p>No tasks match your filters</p>
          </div>
        )}
      </div>

      {showForm && <TaskForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
