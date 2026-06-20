import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import clsx from "clsx"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl"
}

export function Modal({
  isOpen, onClose, title, children, footer, size = "md"
}: ModalProps) {

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={onClose}
          />

          {/* Modal positioned absolutely, centered, with fixed top/bottom clearance */}
          <div
            className="fixed inset-x-0 z-50 flex justify-center px-4"
            style={{
              top: "5rem",
              bottom: "7rem",
              alignItems: "flex-start",
              overflowY: "auto",
            }}
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={e => e.stopPropagation()}
              className={clsx(
                "w-full rounded-2xl flex flex-col my-4",
                size === "sm" && "max-w-sm",
                size === "md" && "max-w-lg",
                size === "lg" && "max-w-2xl",
                size === "xl" && "max-w-4xl",
              )}
              style={{
                background: "#1a1f2e",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.60)",
              }}
            >
              {/* Header — never scrolls */}
              <div
                className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <h2 className="text-base font-semibold text-slate-100">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body — scrolls when content is taller than available space */}
              <div className="px-6 py-5 overflow-y-auto scrollbar-thin">
                {children}
              </div>

              {/* Footer — never scrolls */}
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
        </>
      )}
    </AnimatePresence>
  )
}
