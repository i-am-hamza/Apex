import { useState } from "react"
import { Zap, Moon, Plus } from "lucide-react"
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
          <Zap className="text-apex-violet" size={24} />
          <h1 className="text-2xl font-bold text-white">Focus Mode</h1>
        </div>
        <button
          onClick={() => setAmbientMode(!ambientMode)}
          className={clsx(
            "p-2 rounded-xl transition-colors",
            ambientMode ? "text-apex-violet bg-violet-500/10" : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
          title="Toggle ambient mode"
        >
          <Moon size={18} />
        </button>
      </div>

      {/* Streak card */}
      {focusedGoals.length > 0 && (
        <div
          className="glass-strong rounded-2xl p-6 mb-6 relative overflow-hidden"
          style={{ boxShadow: "0 0 40px rgba(167,139,250,0.08)" }}
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 80% at 0% 50%, #A78BFA, transparent)",
            }}
          />
          <div className="flex items-center justify-between relative">
            <div>
              <div className="text-6xl font-black text-violet-300 leading-none">
                {focusedGoals[0]?.focus_streak ?? 0}
              </div>
              <div className="text-white font-semibold mt-1">Day Focus Streak 🔥</div>
              <div className="text-apex-muted text-sm mt-0.5">Keep the momentum going</div>
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
            <div
              key={goal.id}
              className="glass rounded-2xl p-6"
              style={{ boxShadow: `-3px 0 0 #A78BFA` }}
            >
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
                  className="p-2 rounded-xl bg-violet-500/10 text-apex-violet hover:bg-violet-500/20 transition-colors"
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
                    className="flex items-center justify-between p-3 glass rounded-xl"
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
          className="fixed bottom-24 right-6 z-50 glass-strong rounded-xl px-4 py-2 text-sm text-white shadow-lg hover:bg-white/10 transition-colors"
        >
          Exit ambient mode
        </button>
      )}
    </div>
  )
}
