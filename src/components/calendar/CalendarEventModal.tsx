import { useState } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useCalendarStore } from "@/store/calendarStore"
import { useGoalStore } from "@/store/goalStore"
import { useTaskStore } from "@/store/taskStore"
import { useUIStore } from "@/store/uiStore"
import type { CalendarEvent } from "@/types"

const COLORS = ["#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#6B7280"]
const EVENT_TYPES: { value: CalendarEvent["event_type"]; label: string }[] = [
  { value: "goal_work", label: "Goal Work" },
  { value: "milestone", label: "Milestone" },
  { value: "review", label: "Review" },
  { value: "custom", label: "Custom" },
]

interface CalendarEventModalProps {
  event?: CalendarEvent
  initialDate?: string
  onClose: () => void
}

export function CalendarEventModal({ event, initialDate, onClose }: CalendarEventModalProps) {
  const { addEvent, updateEvent, deleteEvent } = useCalendarStore()
  const goals = useGoalStore((s) => s.goals)
  const { getGoalTasks } = useTaskStore()
  const addToast = useUIStore((s) => s.addToast)

  const defaultDate = initialDate ? initialDate.slice(0, 10) : new Date().toISOString().slice(0, 10)

  const [title, setTitle] = useState(event?.title ?? "")
  const [description, setDescription] = useState(event?.description ?? "")
  const [eventType, setEventType] = useState<CalendarEvent["event_type"]>(event?.event_type ?? "custom")
  const [goalId, setGoalId] = useState(event?.goal_id ?? "")
  const [taskId, setTaskId] = useState(event?.task_id ?? "")
  const [startDate, setStartDate] = useState(event ? event.start_at.slice(0, 10) : defaultDate)
  const [startTime, setStartTime] = useState(event ? event.start_at.slice(11, 16) : "09:00")
  const [endDate, setEndDate] = useState(event?.end_at ? event.end_at.slice(0, 10) : defaultDate)
  const [endTime, setEndTime] = useState(event?.end_at ? event.end_at.slice(11, 16) : "10:00")
  const [allDay, setAllDay] = useState(event?.all_day ?? false)
  const [color, setColor] = useState(event?.color ?? "#F59E0B")
  const [loading, setLoading] = useState(false)

  const goalTasks = goalId ? getGoalTasks(goalId) : []

  const handleSave = () => {
    if (!title.trim()) return
    setLoading(true)

    const start_at = allDay ? `${startDate}T00:00:00.000Z` : `${startDate}T${startTime}:00.000Z`
    const end_at = allDay ? undefined : `${endDate}T${endTime}:00.000Z`

    const data = {
      title: title.trim(),
      description: description.trim() || undefined,
      event_type: eventType,
      goal_id: goalId || undefined,
      task_id: taskId || undefined,
      start_at,
      end_at,
      all_day: allDay,
      color,
    }

    if (event) {
      updateEvent(event.id, data)
      addToast("success", "Event updated!")
    } else {
      addEvent(data)
      addToast("success", "Event added!")
    }

    setLoading(false)
    onClose()
  }

  const handleDelete = () => {
    if (!event) return
    if (window.confirm("Delete this event?")) {
      deleteEvent(event.id)
      addToast("info", "Event deleted")
      onClose()
    }
  }

  return (
    <Modal isOpen onClose={onClose} title={event ? "Edit Event" : "Add Event"} size="md">
      <div className="flex flex-col gap-4">
        <Input
          label="Title"
          placeholder="Event title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Type</label>
          <select
            className="w-full bg-apex-elevated border border-apex-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-apex-amber"
            value={eventType}
            onChange={(e) => setEventType(e.target.value as CalendarEvent["event_type"])}
          >
            {EVENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Linked Goal (optional)</label>
          <select
            className="w-full bg-apex-elevated border border-apex-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-apex-amber"
            value={goalId}
            onChange={(e) => { setGoalId(e.target.value); setTaskId("") }}
          >
            <option value="">None</option>
            {goals.map((g) => (
              <option key={g.id} value={g.id}>{g.emoji} {g.title}</option>
            ))}
          </select>
        </div>

        {goalId && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Linked Task (optional)</label>
            <select
              className="w-full bg-apex-elevated border border-apex-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-apex-amber"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
            >
              <option value="">None</option>
              {goalTasks.map((t) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-300">All day</label>
          <button
            type="button"
            onClick={() => setAllDay(!allDay)}
            className={`w-10 h-5 rounded-full transition-colors relative ${allDay ? "bg-apex-amber" : "bg-apex-elevated"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${allDay ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Start date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          {!allDay && <Input label="Start time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />}
          <Input label="End date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          {!allDay && <Input label="End time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">Color</label>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-all ${color === c ? "ring-2 ring-white ring-offset-2 ring-offset-apex-card scale-110" : ""}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Description (optional)</label>
          <textarea
            className="w-full bg-apex-elevated border border-apex-border rounded-lg px-3 py-2 text-white placeholder-apex-muted text-sm focus:outline-none focus:border-apex-amber resize-none"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details..."
          />
        </div>

        <div className="flex gap-3 pt-2 border-t border-apex-border">
          {event && (
            <Button variant="danger" onClick={handleDelete} size="md">
              Delete
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSave} loading={loading} disabled={!title.trim()} className="flex-1">
            {event ? "Save" : "Add Event"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
