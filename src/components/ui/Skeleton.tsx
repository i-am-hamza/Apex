import clsx from "clsx"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={clsx("bg-apex-elevated animate-shimmer rounded", className)} />
}

export function SkeletonText() {
  return <Skeleton className="h-4 w-full" />
}

export function SkeletonCard() {
  return <Skeleton className="h-28 w-full rounded-xl" />
}

export function SkeletonChart() {
  return <Skeleton className="h-48 w-full rounded-xl" />
}
