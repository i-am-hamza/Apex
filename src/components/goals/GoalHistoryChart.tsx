import { useState } from "react"
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts"
import { useGoalStore } from "@/store/goalStore"
import { fmtShort } from "@/utils/formatters"

interface ChartPayloadItem {
  payload: {
    date: string
    score: number
    dream: number
    like: number
    time: number
    effort: number
    __idx: number
    __prev?: number
  }
  value: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: ChartPayloadItem[]
}

interface GoalHistoryChartProps {
  goalId: string
  currentScore: number
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const idx = payload[0].payload.__idx as number
  const prev = payload[0].payload.__prev as number | undefined
  const delta = prev !== undefined ? d.score - prev : null

  return (
    <div className="glass-strong rounded-xl p-3 text-xs shadow-xl">
      <div className="text-apex-muted mb-1">{d.date}</div>
      <div className="text-apex-violet font-bold text-base mb-1">{d.score.toFixed(2)}</div>
      {delta !== null && idx > 0 && (
        <div className={delta >= 0 ? "text-green-400" : "text-red-400"}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(2)}
        </div>
      )}
      <div className="text-apex-muted mt-1 space-y-0.5">
        <div>Dream:{d.dream} Like:{d.like}</div>
        <div>Time:{d.time} Effort:{d.effort}</div>
      </div>
    </div>
  )
}

const DAYS = [7, 30, 90] as const

export function GoalHistoryChart({ goalId, currentScore }: GoalHistoryChartProps) {
  const [days, setDays] = useState<7 | 30 | 90>(30)
  const getSnapshots = useGoalStore((s) => s.getSnapshots)
  const snapshots = getSnapshots(goalId)

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  const filtered = snapshots.filter((s) => new Date(s.recorded_at) >= cutoff)

  const byDay = new Map<string, (typeof filtered)[0]>()
  for (const s of filtered) {
    const day = fmtShort(s.recorded_at)
    byDay.set(day, s)
  }

  const data = Array.from(byDay.values()).map((s, i, arr) => ({
    date: fmtShort(s.recorded_at),
    score: s.score,
    dream: s.dream_outcome,
    like: s.likelihood,
    time: s.time_delay,
    effort: s.effort,
    __idx: i,
    __prev: i > 0 ? arr[i - 1].score : undefined,
  }))

  if (data.length < 2) {
    return (
      <div className="h-[220px] flex items-center justify-center">
        <p className="text-apex-muted text-sm text-center px-4">
          Edit goal sliders to see your score history build here
        </p>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex gap-2 mb-3">
        {DAYS.map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
              days === d
                ? "glass-strong text-apex-violet font-semibold border border-apex-violet/30"
                : "text-apex-muted hover:text-white hover:bg-white/5"
            }`}
          >
            {d}d
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="scoreGradViolet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" opacity={1} />
          <XAxis
            dataKey="date"
            stroke="#475569"
            tick={{ fill: "#475569", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#475569"
            tick={{ fill: "#475569", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={currentScore}
            stroke="#fff"
            strokeDasharray="4 4"
            strokeOpacity={0.2}
            label={{ value: "Now", fill: "#475569", fontSize: 10, position: "insideTopRight" }}
          />
          <Area type="monotone" dataKey="score" fill="url(#scoreGradViolet)" stroke="none" />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#A78BFA"
            strokeWidth={2}
            dot={{ r: 3, fill: "#A78BFA", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#A78BFA" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
