import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useTaskStore } from "@/store/taskStore"
import { KanbanColumn } from "./KanbanColumn"
import { KanbanCard } from "./KanbanCard"
import type { Task } from "@/types"
import { useState } from "react"

interface KanbanBoardProps {
  goalFilter: string
}

export function KanbanBoard({ goalFilter }: KanbanBoardProps) {
  const { tasks, updateTask, reorderTasks, addTask } = useTaskStore()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const filteredTasks = goalFilter === "all"
    ? tasks
    : tasks.filter((t) => t.goal_id === goalFilter)

  const todo = filteredTasks.filter((t) => t.status === "todo").sort((a, b) => a.sort_order - b.sort_order)
  const inProgress = filteredTasks.filter((t) => t.status === "in_progress").sort((a, b) => a.sort_order - b.sort_order)
  const done = filteredTasks.filter((t) => t.status === "done").sort((a, b) => a.sort_order - b.sort_order)

  const handleDragStart = (e: DragStartEvent) => {
    const task = tasks.find((t) => t.id === e.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = e
    if (!over || !activeTask) return

    const overData = over.data.current
    const overStatus: Task["status"] = overData?.status ?? overData?.task?.status ?? activeTask.status

    if (overStatus !== activeTask.status) {
      updateTask(String(active.id), { status: overStatus, sort_order: 0 })
    } else {
      const colTasks = filteredTasks.filter((t) => t.status === activeTask.status)
      const oldIdx = colTasks.findIndex((t) => t.id === active.id)
      const newIdx = colTasks.findIndex((t) => t.id === over.id)
      if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
        const reordered = arrayMove(colTasks, oldIdx, newIdx)
        reorderTasks(activeTask.goal_id, reordered.map((t) => t.id))
      }
    }
  }

  const handleAddTask = (status: Task["status"], title: string) => {
    const colTasks = filteredTasks.filter((t) => t.status === status)
    const goalId = goalFilter !== "all" ? goalFilter : (tasks[0]?.goal_id ?? "")
    if (!goalId) return
    addTask({ goal_id: goalId, title, status, priority: "medium", sort_order: colTasks.length })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x scroll-smooth h-full">
        <KanbanColumn status="todo" tasks={todo} onAddTask={(t) => handleAddTask("todo", t)} />
        <KanbanColumn status="in_progress" tasks={inProgress} onAddTask={(t) => handleAddTask("in_progress", t)} />
        <KanbanColumn status="done" tasks={done} onAddTask={(t) => handleAddTask("done", t)} />
      </div>
      <DragOverlay>
        {activeTask && <KanbanCard task={activeTask} isDragOverlay />}
      </DragOverlay>
    </DndContext>
  )
}
