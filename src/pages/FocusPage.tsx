import { useState, useEffect } from "react"
import { Zap, Moon, Target, Plus } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/Button"
import { TaskList } from "@/components/tasks/TaskList"
import { useGoalStore } from "@/store/goalStore"
import { useCalendarStore } from "@/store/calendarStore"
import { useUIStore } from "@/store/uiStore"
import { getScoreColor } from "@/utils/scoring"
import clsx from "clsx"

export function FocusPage() {
  const goals = useGoalStore((s) => s.goals)
  const updateGoal = useGoalStore((s) => s.updateGoal)
  const toggleFocus = useGoalStore((s) => s.toggleFocus)
  const addEvent = useCalendarStore((s) => s.addEvent)
  const { addToast, ambientMode, setAmbientMode } = useUIStore()

  const focusedGoals = goals.filter((g) => g.is_focus && g.is_active)
  const todayKey = `apex-focus-${format(new Date(), "yyyy-MM-dd")}`
  const [markedToday, setMarkedToday] = useState(() => !!localStorage.getItem(todayKey))

  const markComplete = () => {
    focusedGoals.forEach((g) => {
      updateGoal(g.id, { focus_streak: g.focus_streak + 1 })
    })
    localStorage.setItem(todayKey, "1")
    setMarkedToday(true)
    addToast("success", "Focus day logged! 🔥 Keep it up!")
    addEvent({
      title: "Focus day complete 🔥",
      start_at: new Date().toISOString().slice(0, 10) + "T00:00:00.000Z",
      all_day: true,
      color: "#F59E0B",
      event_type: "review",
    })
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap className="text-apex-amber" size={24} />
          <h1 className="text-2xl font-bold text-white">Focus Mode</h1>
        </div>
        <button
          onClick={() => setAmbientMode(!ambientMode)}
          className={clsx(
            "p-2 rounded-lg transition-colors",
            ambientMode ? "text-apex-amber bg-amber-500/10" : "text-apex-muted hover:text-white hover:bg-apex-elevated"
          )}
          title="Toggle ambient mode"
        >
          <Moon size={18} />
        </button>
      </div>

      {/* Streak card */}
      {focusedGoals.length > 0 && (
        <div className="bg-gradient-to-r from-amber-600/20 to-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-black text-amber-400">
                Day {focusedGoals[0]?.focus_streak ?? 0} Focus Streak 🔥
              </div>
              <div className="text-apex-muted text-sm mt-1">Keep the momentum going</div>
            </div>
            <Button
              onClick={markedToday ? undefined : markComplete}
              disabled={markedToday}
              variant={markedToday ? "secondary" : "primary"}
            >
              {markedToday ? "✓ Logged for today" : "Mark Today Complete"}
            </Button>
          </div>
        </div>
      )}

      {focusedGoals.length > 0 ? (
        <div className="flex flex-col gap-6">
          {focusedGoals.map((goal) => (
            <div key={goal.id} className="bg-apex-card border border-apex-amber/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{goal.emoji}</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">{goal.title}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-2xl font-black ${getScoreColor(goal.score)}`}>
                        {goal.score.toFixed(2)}
                      </span>
                      <span className="text-apex-muted text-sm">score</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleFocus(goal.id)}
                  className="p-2 rounded-lg bg-apex-elevated text-apex-amber hover:bg-apex-elevated/80 transition-colors"
                  title="Remove from focus"
                >
                  <Zap size={16} />
                </button>
              </div>
              <TaskList goalId={goal.id} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="text-xl font-semibold text-white mb-2">No goals in Focus Mode</h2>
          <p className="text-apex-muted mb-8">
            Pin goals to Focus Mode by clicking ⚡ on any goal card
          </p>

          {goals.length > 0 && (
            <div className="w-full max-w-md">
              <h3 className="text-sm font-semibold text-apex-muted uppercase tracking-wide mb-3">
                Quick pin — top goals
              </h3>
              <div className="flex flex-col gap-2">
                {goals.slice(0, 3).map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between p-3 bg-apex-card border border-apex-border rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{g.emoji}</span>
                      <span className="text-white text-sm font-medium">{g.title}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toggleFocus(g.id)}
                      leftIcon={<Plus size={12} />}
                    >
                      Add to Focus
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Exit ambient mode button */}
      {ambientMode && (
        <button
          onClick={() => setAmbientMode(false)}
          className="fixed bottom-20 lg:bottom-6 right-6 z-50 bg-apex-elevated border border-apex-border rounded-xl px-4 py-2 text-sm text-white shadow-lg hover:bg-apex-card transition-colors"
        >
          Exit ambient mode
        </button>
      )}
    </div>
  )
}
