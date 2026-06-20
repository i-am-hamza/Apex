import clsx from "clsx"
import type { ReactNode } from "react"

interface BadgeProps {
  children: ReactNode
  color?: "amber" | "green" | "blue" | "red" | "gray" | "purple" | "orange"
  size?: "sm" | "md"
}

export function Badge({ children, color = "gray", size = "md" }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-medium",
        {
          "text-[10px] px-2 py-0.5": size === "sm",
          "text-xs px-2.5 py-1": size === "md",
          "bg-amber-500/15 text-amber-400": color === "amber",
          "bg-green-500/15 text-green-400": color === "green",
          "bg-blue-500/15 text-blue-400": color === "blue",
          "bg-red-500/15 text-red-400": color === "red",
          "bg-gray-500/15 text-gray-400": color === "gray",
          "bg-purple-500/15 text-purple-400": color === "purple",
          "bg-orange-500/15 text-orange-400": color === "orange",
        }
      )}
    >
      {children}
    </span>
  )
}
