import { type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

interface SlidePanelProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  width?: string
}

export function SlidePanel({
  isOpen,
  onClose,
  title,
  children,
  footer,
  width = "480px",
}: SlidePanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{ width, maxWidth: "100vw", background: "#1a1f2e", border: "none", borderLeft: "1px solid rgba(255,255,255,0.12)" }}
            className="relative h-full flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10 z-10 shrink-0" style={{ background: "#1a1f2e" }}>
              <h3 className="font-semibold text-white truncate pr-2">{title}</h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">{children}</div>

            {/* Sticky footer */}
            {footer && (
              <div
                className="px-6 py-4 shrink-0 flex justify-end gap-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
