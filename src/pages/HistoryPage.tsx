import { useNavigate } from "react-router-dom"
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { useGoalStore } from "@/store/goalStore"
import { GoalHistoryChart } from "@/components/goals/GoalHistoryChart"
import { getScoreColor } from "@/utils/scoring"
import { fmtShort } from "@/utils/formatters"
import { subDays } from "date-fns"

export function HistoryPage() {
  const goals = useGoalStore((s) => s.goals)
  const snapshots = useGoalStore((s) => s.snapshots)
  const getSnapshots = useGoalStore((s) => s.getSnapshots)
  const navigate = useNavigate()

  const cutoff7 = subDays(new Date(), 7)

  // Most improved / biggest drop
  const goalDeltas = goals.map((g) => {
    const snaps = getSnapshots(g.id).filter((s) => new Date(s.recorded_at) >= cutoff7)
    if (snaps.length < 2) return { goal: g, delta: 0, count: snaps.length }
    const delta = snaps[snaps.length - 1].score - snaps[0].score
    return { goal: g, delta, count: snaps.length }
  })

  const mostImproved = [...goalDeltas].sort((a, b) => b.delta - a.delta)[0]
  const biggestDrop = [...goalDeltas].sort((a, b) => a.delta - b.delta)[0]
  const mostActive = [...goalDeltas].sort((a, b) => b.count - a.count)[0]

  // Combined chart data (last 30 days, all goals)
  const cutoff30 = subDays(new Date(), 30)
  const allDays = new Set<string>()
  for (const g of goals) {
    for (const s of getSnapshots(g.id)) {
      if (new Date(s.recorded_at) >= cutoff30) {
        allDays.add(fmtShort(s.recorded_at))
      }
    }
  }
  const sortedDays = Array.from(allDays).sort()

  const combinedData = sortedDays.map((day) => {
    const row: Record<string, number | string> = { date: day }
    for (const g of goals) {
      const snaps = getSnapshots(g.id).filter(
        (s) => fmtShort(s.recorded_at) === day && new Date(s.recorded_at) >= cutoff30
      )
      if (snaps.length) row[g.id] = snaps[snaps.length - 1].score
    }
    return row
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">History</h1>

      {/* Highlight cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            title: "Most Improved (7d)",
            item: mostImproved,
            render: (d: typeof mostImproved) =>
              d && d.delta > 0 ? (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl">{d.goal.emoji}</span>
                  <div>
                    <div className="text-white text-sm font-medium truncate">{d.goal.title}</div>
                    <div className="text-green-400 text-sm font-bold">+{d.delta.toFixed(2)}</div>
                  </div>
                </div>
              ) : (
                <p className="text-apex-muted text-sm mt-2">No improvements this week</p>
              ),
          },
          {
            title: "Biggest Drop (7d)",
            item: biggestDrop,
            render: (d: typeof biggestDrop) =>
              d && d.delta < 0 ? (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl">{d.goal.emoji}</span>
                  <div>
                    <div className="text-white text-sm font-medium truncate">{d.goal.title}</div>
                    <div className="text-red-400 text-sm font-bold">{d.delta.toFixed(2)}</div>
                  </div>
                </div>
              ) : (
                <p className="text-apex-muted text-sm mt-2">No drops this week</p>
              ),
          },
          {
            title: "Most Active (7d)",
            item: mostActive,
            render: (d: typeof mostActive) =>
              d && d.count > 0 ? (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl">{d.goal.emoji}</span>
                  <div>
                    <div className="text-white text-sm font-medium truncate">{d.goal.title}</div>
                    <div className="text-amber-400 text-sm font-bold">{d.count} updates</div>
                  </div>
                </div>
              ) : (
                <p className="text-apex-muted text-sm mt-2">No activity this week</p>
              ),
          },
        ].map((card) => (
          <div key={card.title} className="bg-apex-card border border-apex-border rounded-xl p-4">
            <h3 className="text-xs font-semibold text-apex-muted uppercase tracking-wide">{card.title}</h3>
            {card.render(card.item as typeof mostImproved)}
          </div>
        ))}
      </div>

      {/* Sparkline grid */}
      <h2 className="text-lg font-semibold text-white mb-4">Goal Score History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-apex-card border border-apex-border rounded-xl p-4 cursor-pointer hover:border-apex-amber/40 transition-colors"
            onClick={() => navigate("/goals")}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{goal.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{goal.title}</div>
                <div className={`text-lg font-black ${getScoreColor(goal.score)}`}>
                  {goal.score.toFixed(2)}
                </div>
              </div>
            </div>
            <GoalHistoryChart goalId={goal.id} currentScore={goal.score} />
          </div>
        ))}
      </div>

      {/* Combined chart */}
      {goals.length > 1 && combinedData.length > 1 && (
        <div className="bg-apex-card border border-apex-border rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-4">All Goals — Score Timeline</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={combinedData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
              <XAxis dataKey="date" stroke="#6B7280" tick={{ fill: "#6B7280", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis stroke="#6B7280" tick={{ fill: "#6B7280", fontSize: 11 }} tickLine={false} axisLine={false} width={30} />
              <Tooltip
                contentStyle={{ background: "#1F2937", border: "1px solid #374151", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#9CA3AF" }}
              />
              <Legend formatter={(value) => goals.find(g => g.id === value)?.title ?? value} />
              {goals.map((g) => (
                <Line
                  key={g.id}
                  type="monotone"
                  dataKey={g.id}
                  stroke={g.color}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {goals.length === 0 && (
        <div className="text-center py-16 text-apex-muted">
          <p>No goal history yet. Add and update goals to see their score trends.</p>
        </div>
      )}
    </div>
  )
}
