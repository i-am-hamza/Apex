import { useState } from "react"
import { GoalHistoryChart } from "./GoalHistoryChart"
import { useGoalStore } from "@/store/goalStore"
import { getScoreColor, getScoreLabel } from "@/utils/scoring"
import { fmtDateTime } from "@/utils/formatters"

interface GoalHistoryPanelProps {
  goalId: string
}

export function GoalHistoryPanel({ goalId }: GoalHistoryPanelProps) {
  const goal = useGoalStore((s) => s.goals.find((g) => g.id === goalId))
  const getSnapshots = useGoalStore((s) => s.getSnapshots)
  const [showAll, setShowAll] = useState(false)

  if (!goal) return null

  const snapshots = getSnapshots(goalId).slice().reverse()
  const visible = showAll ? snapshots : snapshots.slice(0, 20)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{goal.emoji}</span>
        <div>
          <h3 className="font-semibold text-white">{goal.title}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-2xl font-black tabular-nums ${getScoreColor(goal.score)}`}>
              {goal.score.toFixed(2)}
            </span>
            <span className="text-apex-muted text-sm">{getScoreLabel(goal.score)}</span>
          </div>
        </div>
      </div>

      <GoalHistoryChart goalId={goalId} currentScore={goal.score} />

      {snapshots.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-white mb-2">Snapshot History</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-apex-muted border-b border-white/10">
                  <th className="text-left pb-2 pr-3">Date</th>
                  <th className="text-right pb-2 pr-3">Score</th>
                  <th className="text-right pb-2 pr-3">Δ</th>
                  <th className="text-right pb-2 pr-3">D</th>
                  <th className="text-right pb-2 pr-3">L</th>
                  <th className="text-right pb-2 pr-3">T</th>
                  <th className="text-right pb-2">E</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((snap, i) => {
                  const prev = visible[i + 1]
                  const delta = prev ? snap.score - prev.score : null
                  return (
                    <tr key={snap.id} className="border-b border-white/5">
                      <td className="py-2 pr-3 text-apex-muted">{fmtDateTime(snap.recorded_at)}</td>
                      <td className={`py-2 pr-3 text-right font-mono font-bold ${getScoreColor(snap.score)}`}>
                        {snap.score.toFixed(2)}
                      </td>
                      <td className="py-2 pr-3 text-right font-mono">
                        {delta === null ? (
                          <span className="text-apex-muted">—</span>
                        ) : delta > 0 ? (
                          <span className="text-green-400">▲ +{delta.toFixed(2)}</span>
                        ) : delta < 0 ? (
                          <span className="text-red-400">▼ {delta.toFixed(2)}</span>
                        ) : (
                          <span className="text-apex-muted">—</span>
                        )}
                      </td>
                      <td className="py-2 pr-3 text-right text-apex-muted">{snap.dream_outcome}</td>
                      <td className="py-2 pr-3 text-right text-apex-muted">{snap.likelihood}</td>
                      <td className="py-2 pr-3 text-right text-apex-muted">{snap.time_delay}</td>
                      <td className="py-2 text-right text-apex-muted">{snap.effort}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {snapshots.length > 20 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="text-xs text-apex-amber hover:underline mt-2"
            >
              Show all {snapshots.length} snapshots
            </button>
          )}
        </div>
      )}
    </div>
  )
}
