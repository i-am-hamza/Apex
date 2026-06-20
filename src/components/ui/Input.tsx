import clsx from "clsx"
import type { InputHTMLAttributes, ReactNode } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
}

export function Input({ label, error, hint, leftIcon, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-apex-muted">
            {leftIcon}
          </span>
        )}
        <input
          {...props}
          className={clsx(
            "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-apex-amber/60 focus:ring-1 focus:ring-amber-500/30 transition-colors",
            leftIcon && "pl-9",
            className
          )}
        />
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {hint && <p className="text-apex-muted text-xs">{hint}</p>}
    </div>
  )
}
