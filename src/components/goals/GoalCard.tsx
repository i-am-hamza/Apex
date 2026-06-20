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
      className="glass rounded-2xl p-5 group"
      style={goal.is_focus ? { boxShadow: `-3px 0 0 ${goal.color}` } : undefined}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: `${goal.color}20`,
              color: goal.color,
              border: `1px solid ${goal.color}40`,
            }}
          >
            #{rank}
          </span>
          <span className="text-2xl">{goal.emoji}</span>
        </div>
        <div className={`text-4xl font-black tabular-nums animate-score-pop ${getScoreColor(goal.score)}`}>
          {goal.score.toFixed(2)}
        </div>
      </div>

      {/* Title + meta */}
      <div className="mb-3">
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
        <div className="flex items-center gap-2 mb-3">
          <ProgressBar value={(doneTasks / tasks.length) * 100} color="amber" size="sm" />
          <span className="text-xs text-apex-muted flex-shrink-0">
            {doneTasks}/{tasks.length}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 pt-3 border-t border-white/8">
        <button
          onClick={() => onEdit(goal)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors"
          title="Edit goal"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => setActivePanel(`tasks-${goal.id}`)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors"
          title="Tasks"
        >
          <ListChecks size={14} />
        </button>
        <button
          onClick={() => setActivePanel(`history-${goal.id}`)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors"
          title="Score history"
        >
          <BarChart2 size={14} />
        </button>
        <button
          onClick={() => toggleFocus(goal.id)}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          style={goal.is_focus ? { color: goal.color, background: `${goal.color}15` } : undefined}
          title="Toggle focus"
        >
          <Zap
            size={14}
            className={!goal.is_focus ? "text-slate-400 hover:text-white" : ""}
          />
        </button>
        <button
          onClick={() => {
            if (window.confirm("Delete this goal?")) deleteGoal(goal.id)
          }}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-auto"
          title="Delete goal"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
