import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { newId, now } from "@/utils/id"
import type { CalendarEvent } from "@/types"

interface CalendarState {
  events: CalendarEvent[]
  addEvent: (data: Omit<CalendarEvent, "id" | "created_at">) => CalendarEvent
  updateEvent: (id: string, data: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      events: [],

      addEvent: (data) => {
        const event: CalendarEvent = { ...data, id: newId(), created_at: now() }
        set((s) => ({ events: [...s.events, event] }))
        return event
      },

      updateEvent: (id, data) =>
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),

      deleteEvent: (id) =>
        set((s) => ({ events: s.events.filter((e) => e.id !== id) })),
    }),
    { name: "apex-calendar", storage: createJSONStorage(() => localStorage) }
  )
)
