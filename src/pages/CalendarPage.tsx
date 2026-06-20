import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { CalendarView } from "@/components/calendar/CalendarView"
import { CalendarEventModal } from "@/components/calendar/CalendarEventModal"

export function CalendarPage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem-3rem)]">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white">Calendar</h1>
        <Button onClick={() => setShowModal(true)} leftIcon={<Plus size={16} />}>
          + Event
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        <CalendarView />
      </div>

      {showModal && (
        <CalendarEventModal onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
