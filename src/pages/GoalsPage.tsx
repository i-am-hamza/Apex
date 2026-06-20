import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Plus, Target } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { GoalCard } from "@/components/goals/GoalCard"
import { GoalForm } from "@/components/goals/GoalForm"
import { SlidePanel } from "@/components/ui/SlidePanel"
import { TaskList } from "@/components/tasks/TaskList"
import { GoalHistoryPanel } from "@/components/goals/GoalHistoryPanel"
import { useGoalStore } from "@/store/goalStore"
import { useUIStore } from "@/store/uiStore"
import type { Goal } from "@/types"
import clsx from "clsx"

const sortOptions = [
  { key: "score", label: "Score" },
  { key: "created", label: "Added" },
  { key: "due", label: "Due Date" },
  { key: "alpha", label: "A-Z" },
]

export function GoalsPage() {
  const goals = useGoalStore((s) => s.goals)
  const { activePanel, setActivePanel } = useUIStore()
  const [showForm, setShowForm] = useState(false)
  const [editGoal, setEditGoal] = useState<Goal | null>(null)
  const [sortBy, setSortBy] = useState("score")

  const sorted = [...goals].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score
    if (sortBy === "created") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    if (sortBy === "due") {
      if (!a.due_date && !b.due_date) return 0
      if (!a.due_date) return 1
      if (!b.due_date) return -1
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    }
    if (sortBy === "alpha") return a.title.localeCompare(b.title)
    return 0
  })

  const activePanelGoalId = activePanel?.startsWith("tasks-")
    ? activePanel.replace("tasks-", "")
    : activePanel?.startsWith("history-")
    ? activePanel.replace("history-", "")
    : null
  const activePanelGoal = goals.find((g) => g.id === activePanelGoalId)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Your Goals</h1>
        <Button onClick={() => setShowForm(true)} leftIcon={<Plus size={16} />}>
          Add Goal
        </Button>
      </div>

      {/* Sort bar */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {sortOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={clsx(
              "text-xs px-3 py-1.5 rounded-full transition-colors font-medium",
              sortBy === opt.key
                ? "bg-apex-amber text-black"
                : "bg-apex-elevated text-apex-muted hover:text-white"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-xl font-semibold text-white mb-2">No goals yet</h2>
          <p className="text-apex-muted mb-6">Add your first goal to get your Hormozi score</p>
          <Button onClick={() => setShowForm(true)} leftIcon={<Target size={16} />}>
            Add your first goal
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {sorted.map((goal, idx) => (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <GoalCard
                  goal={goal}
                  rank={idx + 1}
                  onEdit={(g) => setEditGoal(g)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {(showForm || editGoal) && (
        <GoalForm
          goal={editGoal ?? undefined}
          onClose={() => { setShowForm(false); setEditGoal(null) }}
        />
      )}

      <SlidePanel
        isOpen={activePanel?.startsWith("tasks-") ?? false}
        onClose={() => setActivePanel(null)}
        title={activePanelGoal ? `${activePanelGoal.emoji} ${activePanelGoal.title} — Tasks` : "Tasks"}
      >
        {activePanelGoalId && <TaskList goalId={activePanelGoalId} />}
      </SlidePanel>

      <SlidePanel
        isOpen={activePanel?.startsWith("history-") ?? false}
        onClose={() => setActivePanel(null)}
        title="Score History"
        width="540px"
      >
        {activePanelGoalId && <GoalHistoryPanel goalId={activePanelGoalId} />}
      </SlidePanel>
    </div>
  )
}
