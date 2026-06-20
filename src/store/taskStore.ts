import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { newId, now } from "@/utils/id"
import type { Task } from "@/types"

interface TaskState {
  tasks: Task[]
  addTask: (data: Omit<Task, "id" | "created_at" | "updated_at">) => Task
  updateTask: (id: string, data: Partial<Task>) => void
  deleteTask: (id: string) => void
  reorderTasks: (goalId: string, orderedIds: string[]) => void
  getGoalTasks: (goalId: string) => Task[]
  getAllTasks: () => Task[]
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (data) => {
        const task: Task = { ...data, id: newId(), created_at: now(), updated_at: now() }
        set((s) => ({ tasks: [...s.tasks, task] }))
        return task
      },

      updateTask: (id, data) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...data,
                  completed_at:
                    data.status === "done" && !t.completed_at ? now() : t.completed_at,
                  updated_at: now(),
                }
              : t
          ),
        })),

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      reorderTasks: (goalId, orderedIds) =>
        set((s) => ({
          tasks: s.tasks.map((t) => {
            const idx = orderedIds.indexOf(t.id)
            return t.goal_id === goalId && idx !== -1 ? { ...t, sort_order: idx } : t
          }),
        })),

      getGoalTasks: (goalId) =>
        get()
          .tasks.filter((t) => t.goal_id === goalId)
          .sort((a, b) => a.sort_order - b.sort_order),

      getAllTasks: () => get().tasks.sort((a, b) => a.sort_order - b.sort_order),
    }),
    { name: "apex-tasks", storage: createJSONStorage(() => localStorage) }
  )
)
