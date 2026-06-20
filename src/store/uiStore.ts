import { create } from "zustand"
import { newId } from "@/utils/id"
import type { Toast } from "@/types"

interface UIState {
  sidebarOpen: boolean
  activePanel: string | null
  installPrompt: Event | null
  toasts: Toast[]
  ambientMode: boolean
  setSidebarOpen: (v: boolean) => void
  setActivePanel: (v: string | null) => void
  setInstallPrompt: (e: Event | null) => void
  addToast: (type: Toast["type"], message: string) => void
  removeToast: (id: string) => void
  setAmbientMode: (v: boolean) => void
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: false,
  activePanel: null,
  installPrompt: null,
  toasts: [],
  ambientMode: false,

  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  setActivePanel: (v) => set({ activePanel: v }),
  setInstallPrompt: (e) => set({ installPrompt: e }),
  setAmbientMode: (v) => set({ ambientMode: v }),

  addToast: (type, message) => {
    const id = newId()
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }))
    setTimeout(
      () => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      4000
    )
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
