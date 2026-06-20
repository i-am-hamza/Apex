import { useState, useRef, type KeyboardEvent } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Plus, ChevronDown, ChevronRight } from "lucide-react"
import { useTaskStore } from "@/store/taskStore"
import { TaskCard } from "./TaskCard"
import type { Task } from "@/types"

function SortableTaskCard({ task, showGoalName }: { task: Task; showGoalName?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "Task", task },
  })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "opacity-30" : ""}
    >
      <TaskCard
        task={task}
        showGoalName={showGoalName}
        showDragHandle
        dragListeners={listeners}
        dragAttributes={attributes}
      />
    </div>
  )
}

interface TaskSectionProps {
  title: string
  status: Task["status"]
  tasks: Task[]
  goalId: string
  onReorder: (ids: string[]) => void
}

function TaskSection({ title, tasks, goalId, onReorder }: TaskSectionProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const { addTask } = useTaskStore()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIdx = tasks.findIndex((t) => t.id === active.id)
    const newIdx = tasks.findIndex((t) => t.id === over.id)
    if (oldIdx !== -1 && newIdx !== -1) {
      onReorder(arrayMove(tasks, oldIdx, newIdx).map((t) => t.id))
    }
  }

  const submitNew = () => {
    if (!newTitle.trim()) return
    addTask({
      goal_id: goalId,
      title: newTitle.trim(),
      status: "todo",
      priority: "medium",
      sort_order: tasks.length,
    })
    setNewTitle("")
    setAdding(false)
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submitNew()
    if (e.key === "Escape") { setAdding(false); setNewTitle("") }
  }

  return (
    <div>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 w-full text-left py-2 text-sm font-semibold text-white"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
        {title}
        <span className="text-xs font-normal text-apex-muted bg-white/5 px-1.5 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </button>

      {!collapsed && (
        <div className="flex flex-col gap-1.5 pl-1">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              {tasks.map((t) => (
                <SortableTaskCard key={t.id} task={t} />
              ))}
            </SortableContext>
          </DndContext>

          {adding ? (
            <div className="flex gap-2 mt-1">
              <input
                ref={inputRef}
                autoFocus
                className="flex-1 bg-white/5 border border-apex-amber/40 rounded-xl px-3 py-1.5 text-white text-sm focus:outline-none placeholder-slate-500"
                placeholder="Task title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={handleKey}
              />
            </div>
          ) : (
            <button
              onClick={() => { setAdding(true); setTimeout(() => inputRef.current?.focus(), 50) }}
              className="flex items-center gap-1.5 text-xs text-apex-muted hover:text-white py-1 transition-colors"
            >
              <Plus size={13} />
              Add task
            </button>
          )}
        </div>
      )}
    </div>
  )
}

interface TaskListProps {
  goalId: string
}

export function TaskList({ goalId }: TaskListProps) {
  const { getGoalTasks, reorderTasks } = useTaskStore()
  const tasks = getGoalTasks(goalId)

  const todo = tasks.filter((t) => t.status === "todo")
  const inProgress = tasks.filter((t) => t.status === "in_progress")
  const done = tasks.filter((t) => t.status === "done")

  const handleReorder = (ids: string[]) => reorderTasks(goalId, ids)

  return (
    <div className="flex flex-col gap-4">
      <TaskSection title="To Do" status="todo" tasks={todo} goalId={goalId} onReorder={handleReorder} />
      <TaskSection title="In Progress" status="in_progress" tasks={inProgress} goalId={goalId} onReorder={handleReorder} />
      <TaskSection title="Done" status="done" tasks={done} goalId={goalId} onReorder={handleReorder} />
    </div>
  )
}
