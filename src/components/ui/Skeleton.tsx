import clsx from "clsx"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={clsx("bg-white/4 animate-shimmer rounded-xl", className)} />
}

export function SkeletonText() {
  return <Skeleton className="h-4 w-full rounded-lg" />
}

export function SkeletonCard() {
  return <Skeleton className="h-28 w-full" />
}

export function SkeletonChart() {
  return <Skeleton className="h-48 w-full" />
}
