import { format, isToday, isPast, formatDistanceToNow } from "date-fns"

export const fmtDate = (d: string) => format(new Date(d), "MMM d, yyyy")
export const fmtShort = (d: string) => format(new Date(d), "MMM d")
export const fmtDateTime = (d: string) => format(new Date(d), "MMM d, h:mm a")
export const fmtRelative = (d: string) =>
  formatDistanceToNow(new Date(d), { addSuffix: true })
export const isOverdue = (d?: string) => (d ? isPast(new Date(d)) && !isToday(new Date(d)) : false)
export const isDueToday = (d?: string) => (d ? isToday(new Date(d)) : false)
