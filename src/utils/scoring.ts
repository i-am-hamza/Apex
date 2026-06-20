export const computeScore = (d: number, l: number, t: number, e: number): number =>
  parseFloat(((d * l) / Math.max(t * e, 0.01)).toFixed(4))

export const getRankBadge = (rank: number) => {
  if (rank === 1) return { label: "Top Priority", color: "amber", icon: "trophy" }
  if (rank <= 3) return { label: "High Priority", color: "orange", icon: "zap" }
  if (rank <= 5) return { label: "In Focus", color: "blue", icon: "target" }
  return { label: "Queued", color: "gray", icon: "clock" }
}

export const getScoreColor = (s: number) =>
  s >= 5 ? "text-green-400" : s >= 2 ? "text-amber-400" : "text-red-400"

export const getScoreLabel = (s: number) =>
  s >= 8 ? "Exceptional" : s >= 5 ? "Strong" : s >= 2 ? "Moderate" : "Low"
