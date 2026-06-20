import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react"
import { useUIStore } from "@/store/uiStore"

const icons = {
  success: <CheckCircle size={16} className="text-green-400 flex-shrink-0" />,
  error: <XCircle size={16} className="text-red-400 flex-shrink-0" />,
  info: <Info size={16} className="text-blue-400 flex-shrink-0" />,
  warning: <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />,
}

const borderColors = {
  success: "#34D399",
  error: "#F87171",
  info: "#60A5FA",
  warning: "#F59E0B",
}

export function Toast() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="glass-strong rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg pointer-events-auto min-w-[280px]"
            style={{ borderLeft: `2px solid ${borderColors[toast.type]}` }}
          >
            {icons[toast.type]}
            <span className="text-sm text-white flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
