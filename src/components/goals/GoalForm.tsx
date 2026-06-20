import { useState } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { GoalScoreSliders } from "./GoalScoreSliders"
import { useGoalStore } from "@/store/goalStore"
import { useUIStore } from "@/store/uiStore"
import type { Goal } from "@/types"

const EMOJIS = ["🎯", "🏆", "💡", "🚀", "💰", "❤️", "🎓", "💪", "🌟", "🔥", "📈", "🎨", "🏃", "🧠", "🌍", "🎵", "📝", "🤝", "🏠", "⚡"]
const COLORS = ["#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#F97316", "#EC4899", "#6B7280"]

interface GoalFormProps {
  goal?: Goal
  onClose: () => void
}

export function GoalForm({ goal, onClose }: GoalFormProps) {
  const { addGoal, updateGoal } = useGoalStore()
  const addToast = useUIStore((s) => s.addToast)

  const [title, setTitle] = useState(goal?.title ?? "")
  const [description, setDescription] = useState(goal?.description ?? "")
  const [emoji, setEmoji] = useState(goal?.emoji ?? "🎯")
  const [color, setColor] = useState(goal?.color ?? "#F59E0B")
  const [dueDate, setDueDate] = useState(goal?.due_date ?? "")
  const [loading, setLoading] = useState(false)
  const [scores, setScores] = useState({
    dream_outcome: goal?.dream_outcome ?? 5,
    likelihood: goal?.likelihood ?? 5,
    time_delay: goal?.time_delay ?? 5,
    effort: goal?.effort ?? 5,
  })

  const handleSliderChange = (field: string, value: number) => {
    setScores((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (!title.trim()) return
    setLoading(true)
    const data = {
      title: title.trim(),
      description: description.trim() || undefined,
      emoji,
      color,
      due_date: dueDate || undefined,
      is_active: true,
      is_focus: goal?.is_focus ?? false,
      focus_streak: goal?.focus_streak ?? 0,
      ...scores,
    }
    if (goal) {
      updateGoal(goal.id, data)
      addToast("success", "Goal updated!")
    } else {
      addGoal(data)
      addToast("success", "Goal added!")
    }
    setLoading(false)
    onClose()
  }

  return (
    <Modal isOpen onClose={onClose} title={goal ? "Edit Goal" : "Add Goal"} size="lg">
      <div className="flex flex-col gap-6">
        {/* Identity */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">Emoji</label>
            <div className="grid grid-cols-10 gap-1">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`text-xl p-1.5 rounded-lg transition-all ${
                    emoji === e
                      ? "ring-2 ring-apex-amber bg-white/8"
                      : "hover:bg-white/5"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Title"
            placeholder="What's your goal?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-all ${
                    color === c ? "ring-2 ring-white ring-offset-2 ring-offset-[#0D1535] scale-110" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scores */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">Score Factors</h3>
          <GoalScoreSliders values={scores} onChange={handleSliderChange} />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Description (optional)</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-apex-amber/60 focus:ring-1 focus:ring-amber-500/30 transition-colors resize-none"
              placeholder="Describe your goal..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Input
            label="Due Date (optional)"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-2 border-t border-white/10">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} loading={loading} disabled={!title.trim()} className="flex-1">
            {goal ? "Save Changes" : "Add Goal"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
