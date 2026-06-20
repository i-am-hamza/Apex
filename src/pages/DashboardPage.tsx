import { useState } from "react"
import { Link } from "react-router-dom"
import { Target, Trophy, CheckCircle, Zap, Plus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { GoalForm } from "@/components/goals/GoalForm"
import { TaskForm } from "@/components/tasks/TaskForm"
import { GoalScoreSliders } from "@/components/goals/GoalScoreSliders"
import { useGoalStore } from "@/store/goalStore"
import { useTaskStore } from "@/store/taskStore"
import { useCalendarStore } from "@/store/calendarStore"
import { useUIStore } from "@/store/uiStore"
import { getScoreColor, getRankBadge } from "@/utils/scoring"
import { fmtDate, fmtDateTime, isDueToday, isOverdue } from "@/utils/formatters"
import { isThisWeek, format } from "date-fns"
import type { Task } from "@/types"
import clsx from "clsx"

const priorityDot: Record<Task["priority"], string> = {
  low: "#34D399",
  medium: "#F59E0B",
  high: "#FB923C",
  urgent: "#F87171",
}

function Greeting() {
  const goals = useGoalStore((s) => s.goals)
  const h = new Date().getHours()
  const time = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"
  if (!goals.length) return <span>Welcome to Apex</span>
  return <span>{time}</span>
}

function QuickAdd() {
  const [tab, setTab] = useState<"goal" | "task">("goal")
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)

  const [title, setTitle] = useState("")
  const [goalId, setGoalId] = useState("")
  const [priority, setPriority] = useState<Task["priority"]>("medium")
  const [showSliders, setShowSliders] = useState(false)
  const [scores, setScores] = useState({ dream_outcome: 5, likelihood: 5, time_delay: 5, effort: 5 })

  const goals = useGoalStore((s) => s.goals)
  const { addGoal } = useGoalStore()
  const { addTask } = useTaskStore()
  const addToast = useUIStore((s) => s.addToast)

  const handleAdd = () => {
    if (!title.trim()) return
    if (tab === "goal") {
      addGoal({ title, emoji: "🎯", color: "#F59E0B", is_active: true, is_focus: false, focus_streak: 0, ...scores })
      addToast("success", "Goal added!")
    } else {
      if (!goalId) return
      const allTasks = useTaskStore.getState().getAllTasks()
      addTask({ goal_id: goalId, title, status: "todo", priority, sort_order: allTasks.filter(t => t.goal_id === goalId).length })
      addToast("success", "Task added!")
    }
    setTitle("")
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-semibold text-white text-sm">Quick Add</h3>
        <div className="flex bg-white/5 rounded-xl p-0.5">
          {(["goal", "task"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                "text-xs px-3 py-1 rounded-lg transition-colors capitalize",
                tab === t ? "bg-apex-amber text-black font-semibold" : "text-slate-400 hover:text-white"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <input
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-apex-amber/60 transition-colors"
          placeholder={tab === "goal" ? "Goal title..." : "Task title..."}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />

        {tab === "goal" && (
          <button
            onClick={() => setShowSliders(!showSliders)}
            className="text-xs text-apex-amber text-left"
          >
            {showSliders ? "▾ Hide score sliders" : "▸ Set score factors"}
          </button>
        )}

        {tab === "goal" && showSliders && (
          <GoalScoreSliders values={scores} onChange={(f, v) => setScores((p) => ({ ...p, [f]: v }))} />
        )}

        {tab === "task" && (
          <select
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-apex-amber/60 transition-colors"
            value={goalId}
            onChange={(e) => setGoalId(e.target.value)}
          >
            <option value="">Select goal...</option>
            {goals.map((g) => <option key={g.id} value={g.id}>{g.emoji} {g.title}</option>)}
          </select>
        )}

        <Button
          onClick={handleAdd}
          disabled={!title.trim() || (tab === "task" && !goalId)}
          leftIcon={<Plus size={14} />}
          size="sm"
        >
          Add {tab}
        </Button>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const goals = useGoalStore((s) => s.goals)
  const getAllTasks = useTaskStore((s) => s.getAllTasks)
  const events = useCalendarStore((s) => s.events)
  const [showGoalForm, setShowGoalForm] = useState(false)

  const tasks = getAllTasks()
  const todayDone = tasks.filter((t) => t.completed_at && isDueToday(t.completed_at)).length
  const focusCount = goals.filter((g) => g.is_focus).length

  const todayTasks = tasks
    .filter((t) => (t.due_date && isDueToday(t.due_date)) || t.status === "in_progress")
    .slice(0, 5)

  const upcoming: { date: string; title: string; color: string; time?: string }[] = []
  const next7 = new Date()
  next7.setDate(next7.getDate() + 7)

  for (const ev of events) {
    const d = new Date(ev.start_at)
    if (d >= new Date() && d <= next7) {
      upcoming.push({ date: format(d, "MMM d"), title: ev.title, color: ev.color, time: format(d, "h:mm a") })
    }
  }
  for (const t of tasks) {
    if (t.due_date) {
      const d = new Date(t.due_date)
      if (d >= new Date() && d <= next7 && t.status !== "done") {
        upcoming.push({ date: format(d, "MMM d"), title: `✓ ${t.title}`, color: "#6B7280", time: format(d, "h:mm a") })
      }
    }
  }
  upcoming.sort((a, b) => a.date.localeCompare(b.date))

  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="text-6xl mb-6">🎯</div>
        <h2 className="text-2xl font-bold text-white mb-3">Start ranking your goals</h2>
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg">
          {[
            { icon: "📊", title: "Score", desc: "Rate each goal across 4 factors" },
            { icon: "🏆", title: "Rank", desc: "Goals auto-sort by Hormozi score" },
            { icon: "⚡", title: "Focus", desc: "Pin your top goals to Focus Mode" },
          ].map((s) => (
            <div key={s.title} className="glass rounded-2xl p-4">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-semibold text-white text-sm">{s.title}</div>
              <div className="text-apex-muted text-xs mt-1">{s.desc}</div>
            </div>
          ))}
        </div>
        <Button onClick={() => setShowGoalForm(true)} leftIcon={<Plus size={16} />} size="lg">
          Add your first goal
        </Button>
        {showGoalForm && <GoalForm onClose={() => setShowGoalForm(false)} />}
      </div>
    )
  }

  const statCards = [
    { label: "Goals Ranked", value: goals.length, icon: Target, color: "#F59E0B", glow: "0 0 20px rgba(245,158,11,0.15)" },
    { label: "Top Score", value: goals[0]?.score.toFixed(2) ?? "—", icon: Trophy, color: "#F59E0B", glow: "0 0 20px rgba(245,158,11,0.15)" },
    { label: "Done Today", value: todayDone, icon: CheckCircle, color: "#34D399", glow: "0 0 20px rgba(52,211,153,0.15)" },
    { label: "In Focus", value: focusCount, icon: Zap, color: "#A78BFA", glow: "0 0 20px rgba(167,139,250,0.15)" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        <Greeting />
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="glass rounded-2xl p-5 relative overflow-hidden"
            style={{ boxShadow: stat.glow }}
          >
            <div
              className="absolute top-3 right-3 opacity-10"
              style={{ color: stat.color }}
            >
              <stat.icon size={48} />
            </div>
            <div className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-apex-muted text-sm mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        {/* Top Goals */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Top Goals</h3>
            <Link to="/goals" className="text-xs text-apex-amber hover:underline flex items-center gap-1">
              See all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {goals.slice(0, 3).map((goal, idx) => {
              const badge = getRankBadge(idx + 1)
              return (
                <div key={goal.id} className="flex items-center gap-3 p-3 bg-white/4 rounded-xl">
                  <span className="text-xl">{goal.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm truncate">{goal.title}</div>
                    <Badge color={badge.color as "amber" | "orange" | "blue" | "gray"} size="sm">{badge.label}</Badge>
                  </div>
                  <div className={`text-xl font-black tabular-nums ${getScoreColor(goal.score)}`}>
                    {goal.score.toFixed(2)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Today's Tasks</h3>
            <Link to="/tasks" className="text-xs text-apex-amber hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {todayTasks.length === 0 ? (
            <p className="text-apex-muted text-sm text-center py-6">No tasks due today</p>
          ) : (
            <div className="flex flex-col gap-2">
              {todayTasks.map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-sm">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: priorityDot[t.priority] }}
                  />
                  <span className={clsx("text-white truncate", t.status === "done" && "line-through opacity-50")}>
                    {t.title}
                  </span>
                </div>
              ))}
              {tasks.filter(t => (t.due_date && isDueToday(t.due_date)) || t.status === "in_progress").length > 5 && (
                <Link to="/tasks" className="text-xs text-apex-amber hover:underline mt-1">
                  View all tasks →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Upcoming */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-4">Upcoming (7 days)</h3>
          {upcoming.length === 0 ? (
            <p className="text-apex-muted text-sm text-center py-6">No upcoming events</p>
          ) : (
            <div className="flex flex-col gap-2">
              {upcoming.slice(0, 8).map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-apex-muted text-xs w-12 flex-shrink-0">{item.date}</span>
                  <span className="text-white truncate">{item.title}</span>
                  {item.time && <span className="text-apex-muted text-xs ml-auto flex-shrink-0">{item.time}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Add */}
        <QuickAdd />
      </div>

      {showGoalForm && <GoalForm onClose={() => setShowGoalForm(false)} />}
    </div>
  )
}
