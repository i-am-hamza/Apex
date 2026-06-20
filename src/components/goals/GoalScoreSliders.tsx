import { computeScore } from "@/utils/scoring"
import { getScoreColor, getScoreLabel } from "@/utils/scoring"

interface ScoreValues {
  dream_outcome: number
  likelihood: number
  time_delay: number
  effort: number
}

interface GoalScoreSlidersProps {
  values: ScoreValues
  onChange: (field: string, value: number) => void
}

const sliders = [
  {
    field: "dream_outcome",
    label: "Dream Outcome",
    emoji: "🌟",
    minLabel: "Minor change",
    maxLabel: "Life-changing",
    inverted: false,
  },
  {
    field: "likelihood",
    label: "Perceived Likelihood",
    emoji: "🎯",
    minLabel: "Very unlikely",
    maxLabel: "Near certain",
    inverted: false,
  },
  {
    field: "time_delay",
    label: "Time Delay",
    emoji: "⏱",
    minLabel: "Years away",
    maxLabel: "Days away",
    inverted: true,
    note: "(lower = faster = better)",
  },
  {
    field: "effort",
    label: "Effort & Sacrifice",
    emoji: "💪",
    minLabel: "Massive effort",
    maxLabel: "Effortless",
    inverted: true,
    note: "(lower = easier = better)",
  },
]

export function GoalScoreSliders({ values, onChange }: GoalScoreSlidersProps) {
  const score = computeScore(
    values.dream_outcome,
    values.likelihood,
    values.time_delay,
    values.effort
  )

  return (
    <div className="flex flex-col gap-5">
      {sliders.map((s) => {
        const val = values[s.field as keyof ScoreValues]
        return (
          <div key={s.field} className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-white">
                {s.emoji} {s.label}
              </span>
              <span className="text-apex-violet font-bold tabular-nums">{val}</span>
            </div>
            {s.note && (
              <span className="text-xs text-apex-muted">{s.note}</span>
            )}
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              className="w-full accent-violet-400 cursor-pointer"
              value={val}
              onChange={(e) => onChange(s.field, Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>{s.minLabel}</span>
              <span>{s.maxLabel}</span>
            </div>
          </div>
        )
      })}

      <div className="mt-2 glass rounded-2xl p-5 text-center">
        <div className="text-apex-muted text-xs mb-1">(Dream × Likely) ÷ (Time × Effort)</div>
        <div className={`text-5xl font-black animate-score-pop ${getScoreColor(score)}`}>
          {score.toFixed(2)}
        </div>
        <div className="text-sm text-apex-muted mt-1">{getScoreLabel(score)}</div>
      </div>
    </div>
  )
}
