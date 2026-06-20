import clsx from "clsx"

interface ProgressBarProps {
  value: number
  color?: "amber" | "green" | "blue" | "red"
  size?: "sm" | "md"
}

const fillColors = {
  amber: "#F59E0B",
  green: "#34D399",
  blue: "#60A5FA",
  red: "#F87171",
}

export function ProgressBar({ value, color = "amber", size = "sm" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className="w-full">
      <div
        className={clsx("w-full bg-white/6 rounded-full overflow-hidden", {
          "h-1.5": size === "sm",
          "h-2.5": size === "md",
        })}
      >
        <div
          className={clsx("rounded-full transition-all duration-500", {
            "h-1.5": size === "sm",
            "h-2.5": size === "md",
          })}
          style={{ width: `${clamped}%`, backgroundColor: fillColors[color] }}
        />
      </div>
      {size === "md" && (
        <div className="flex justify-end mt-1">
          <span className="text-xs text-apex-muted">{Math.round(clamped)}%</span>
        </div>
      )}
    </div>
  )
}
