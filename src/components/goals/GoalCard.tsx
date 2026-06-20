import { Pencil, ListChecks, BarChart2, Zap, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { getRankBadge, getScoreColor } from "@/utils/scoring"
import { fmtDate, isOverdue } from "@/utils/formatters"
import { useGoalStore } from "@/store/goalStore"
import { useTaskStore } from "@/store/taskStore"
import { useUIStore } from "@/store/uiStore"
import type { Goal } from "@/types"

interface GoalCardProps {
  goal: Goal
  rank: number
  onEdit: (goal: Goal) => void
}

export function GoalCard({ goal, rank, onEdit }: GoalCardProps) {
  const { deleteGoal, toggleFocus } = useGoalStore()
  const { getGoalTasks } = useTaskStore()
  const { setActivePanel } = useUIStore()

  const tasks = getGoalTasks(goal.id)
  const doneTasks = tasks.filter((t) => t.status === "done").length
  const badge = getRankBadge(rank)
  const badgeColor = badge.color as "amber" | "orange" | "blue" | "gray"

  return (
    <div
      className={`bg-apex-card border border-apex-border rounded-xl p-4 hover:border-apex-amber/40 transition-all duration-200 ${
        goal.is_focus ? "border-l-2 border-l-apex-amber" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge color={badgeColor}>{badge.label}</Badge>
          <span className="text-2xl">{goal.emoji}</span>
        </div>
        <div className={`text-3xl font-black tabular-nums ${getScoreColor(goal.score)}`}>
          {goal.score.toFixed(2)}
        </div>
      </div>

      {/* Title + meta */}
      <div className="mt-2">
        <h3 className="font-semibold text-white">{goal.title}</h3>
        <p className="text-xs text-apex-muted font-mono mt-0.5">
          D:{goal.dream_outcome} × L:{goal.likelihood} ÷ T:{goal.time_delay} × E:{goal.effort}
        </p>
        {goal.due_date && (
          <div className="mt-1.5">
            <Badge color={isOverdue(goal.due_date) ? "red" : "gray"} size="sm">
              {isOverdue(goal.due_date) ? "Overdue · " : ""}{fmtDate(goal.due_date)}
            </Badge>
          </div>
        )}
      </div>

      {/* Task progress */}
      {tasks.length > 0 && (
        <div className="flex items-center gap-2 mt-3">
          <ProgressBar value={(doneTasks / tasks.length) * 100} color="amber" size="sm" />
          <span className="text-xs text-apex-muted flex-shrink-0">
            {doneTasks}/{tasks.length}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-apex-border/50">
        <button
          onClick={() => onEdit(goal)}
          className="p-1.5 text-apex-muted hover:text-white hover:bg-apex-elevated rounded-lg transition-colors"
          title="Edit goal"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => setActivePanel(`tasks-${goal.id}`)}
          className="p-1.5 text-apex-muted hover:text-white hover:bg-apex-elevated rounded-lg transition-colors"
          title="Tasks"
        >
          <ListChecks size={15} />
        </button>
        <button
          onClick={() => setActivePanel(`history-${goal.id}`)}
          className="p-1.5 text-apex-muted hover:text-white hover:bg-apex-elevated rounded-lg transition-colors"
          title="Score history"
        >
          <BarChart2 size={15} />
        </button>
        <button
          onClick={() => toggleFocus(goal.id)}
          className={`p-1.5 hover:bg-apex-elevated rounded-lg transition-colors ${
            goal.is_focus ? "text-apex-amber" : "text-apex-muted hover:text-white"
          }`}
          title="Toggle focus"
        >
          <Zap size={15} />
        </button>
        <button
          onClick={() => {
            if (window.confirm("Delete this goal?")) deleteGoal(goal.id)
          }}
          className="p-1.5 text-apex-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-auto"
          title="Delete goal"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}
