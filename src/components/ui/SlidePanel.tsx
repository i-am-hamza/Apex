import { type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

interface SlidePanelProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  width?: string
}

export function SlidePanel({
  isOpen,
  onClose,
  title,
  children,
  width = "480px",
}: SlidePanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{ width, maxWidth: "100vw" }}
            className="relative bg-apex-card border-l border-apex-border h-full flex flex-col"
          >
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-apex-border bg-apex-card z-10">
              <h3 className="font-semibold text-white truncate pr-2">{title}</h3>
              <button
                onClick={onClose}
                className="text-apex-muted hover:text-white transition-colors p-1 rounded-lg hover:bg-apex-elevated flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
