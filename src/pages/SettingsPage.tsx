import { useState } from "react"
import { Trash2, Download, Info } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useUIStore } from "@/store/uiStore"

export function SettingsPage() {
  const { installPrompt, setInstallPrompt, addToast } = useUIStore()
  const [clearing, setClearing] = useState(false)

  const handleClearData = () => {
    if (!window.confirm("This will delete ALL your goals, tasks, and events. This cannot be undone. Continue?")) return
    setClearing(true)
    try {
      localStorage.clear()
      addToast("success", "All data cleared. Reload to start fresh.")
    } finally {
      setClearing(false)
    }
  }

  const handleInstall = async () => {
    if (!installPrompt) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (installPrompt as any).prompt()
    setInstallPrompt(null)
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      {/* App Info */}
      <div className="glass rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-black text-lg"
            style={{ background: "linear-gradient(135deg, #F59E0B, #FBBF24)" }}
          >
            A
          </div>
          <div>
            <div className="font-semibold text-white">Apex</div>
            <div className="text-xs text-apex-muted">Goal Ranking PWA · Phase 1 Beta</div>
          </div>
        </div>
        <p className="text-sm text-apex-muted">
          Rank your goals using the Hormozi scoring formula: (Dream × Likelihood) ÷ (Time × Effort).
          All data is stored locally in your browser.
        </p>
      </div>

      {/* Data */}
      <div className="glass rounded-2xl p-5 mb-4">
        <h2 className="font-semibold text-white mb-1">Data</h2>
        <p className="text-xs text-apex-muted mb-4">
          Your data lives entirely in localStorage — no server, no account.
        </p>
        <Button
          variant="danger"
          leftIcon={<Trash2 size={14} />}
          onClick={handleClearData}
          loading={clearing}
        >
          Clear All Data
        </Button>
      </div>

      {/* Install PWA */}
      {installPrompt && (
        <div className="glass rounded-2xl p-5 mb-4">
          <h2 className="font-semibold text-white mb-1">Install App</h2>
          <p className="text-xs text-apex-muted mb-4">
            Install Apex to your home screen for the best offline experience.
          </p>
          <Button leftIcon={<Download size={14} />} onClick={handleInstall}>
            Install Apex
          </Button>
        </div>
      )}

      {/* About */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Info size={14} className="text-apex-muted" />
          <h2 className="font-semibold text-white text-sm">About</h2>
        </div>
        <div className="text-xs text-apex-muted space-y-1">
          <p>Built by One Sentient / Lucent Labs</p>
          <p>Phase 2 will add PocketBase sync, authentication, and payments.</p>
        </div>
      </div>
    </div>
  )
}
