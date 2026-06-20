import { useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import type { EventClickArg, DateSelectArg, EventDropArg } from "@fullcalendar/core"
import type { EventResizeDoneArg } from "@fullcalendar/interaction"
import { useCalendarStore } from "@/store/calendarStore"
import { useGoalStore } from "@/store/goalStore"
import { useTaskStore } from "@/store/taskStore"
import { CalendarEventModal } from "./CalendarEventModal"
import type { CalendarEvent } from "@/types"

export function CalendarView() {
  const { events, updateEvent } = useCalendarStore()
  const goals = useGoalStore((s) => s.goals)
  const tasks = useTaskStore((s) => s.getAllTasks())

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const userEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    start: e.start_at,
    end: e.end_at,
    allDay: e.all_day,
    backgroundColor: e.color,
    borderColor: "transparent",
    extendedProps: { isUserEvent: true, eventType: e.event_type },
  }))

  const syntheticEvents = [
    ...goals
      .filter((g) => g.due_date)
      .map((g) => ({
        id: `goal-${g.id}`,
        title: `${g.emoji} ${g.title} due`,
        start: g.due_date,
        allDay: true,
        backgroundColor: g.color,
        borderColor: "transparent",
        extendedProps: { isUserEvent: false },
      })),
    ...tasks
      .filter((t) => t.due_date)
      .map((t) => ({
        id: `task-${t.id}`,
        title: `✓ ${t.title}`,
        start: t.due_date,
        allDay: false,
        backgroundColor: "#6B7280",
        borderColor: "transparent",
        extendedProps: { isUserEvent: false },
      })),
  ]

  const handleEventClick = (info: EventClickArg) => {
    if (!info.event.extendedProps.isUserEvent) return
    const found = events.find((e) => e.id === info.event.id)
    if (found) {
      setSelectedEvent(found)
      setModalOpen(true)
    }
  }

  const handleSelect = (info: DateSelectArg) => {
    setSelectedDate(info.startStr)
    setSelectedEvent(null)
    setModalOpen(true)
  }

  const handleEventDrop = (info: EventDropArg) => {
    updateEvent(info.event.id, {
      start_at: info.event.startStr,
      end_at: info.event.endStr || undefined,
    })
  }

  const handleEventResize = (info: EventResizeDoneArg) => {
    updateEvent(info.event.id, { end_at: info.event.endStr })
  }

  return (
    <>
      <div className="h-full">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="100%"
          editable
          selectable
          eventResizableFromStart
          events={[...userEvents, ...syntheticEvents]}
          eventClick={handleEventClick}
          select={handleSelect}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
        />
      </div>

      {modalOpen && (
        <CalendarEventModal
          event={selectedEvent ?? undefined}
          initialDate={selectedDate ?? undefined}
          onClose={() => { setModalOpen(false); setSelectedEvent(null); setSelectedDate(null) }}
        />
      )}
    </>
  )
}
