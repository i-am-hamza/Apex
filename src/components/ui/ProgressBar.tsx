import clsx from "clsx"

interface ProgressBarProps {
  value: number
  color?: "amber" | "green" | "blue" | "red"
  size?: "sm" | "md"
}

export function ProgressBar({ value, color = "amber", size = "sm" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className="w-full">
      <div
        className={clsx("w-full bg-apex-elevated rounded-full overflow-hidden", {
          "h-1.5": size === "sm",
          "h-2.5": size === "md",
        })}
      >
        <div
          className={clsx("rounded-full transition-all duration-500", {
            "h-1.5": size === "sm",
            "h-2.5": size === "md",
            "bg-amber-400": color === "amber",
            "bg-green-400": color === "green",
            "bg-blue-400": color === "blue",
            "bg-red-400": color === "red",
          })}
          style={{ width: `${clamped}%` }}
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
