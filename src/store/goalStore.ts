import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { computeScore } from "@/utils/scoring"
import { newId, now } from "@/utils/id"
import type { Goal, GoalSnapshot } from "@/types"

interface GoalState {
  goals: Goal[]
  snapshots: GoalSnapshot[]
  addGoal: (data: Omit<Goal, "id" | "score" | "created_at" | "updated_at">) => Goal
  updateGoal: (id: string, data: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  toggleFocus: (id: string) => void
  getSnapshots: (goalId: string) => GoalSnapshot[]
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: [],
      snapshots: [],

      addGoal: (data) => {
        const score = computeScore(
          data.dream_outcome,
          data.likelihood,
          data.time_delay,
          data.effort
        )
        const goal: Goal = {
          ...data,
          id: newId(),
          score,
          created_at: now(),
          updated_at: now(),
        }
        const goals = [...get().goals, goal].sort((a, b) => b.score - a.score)
        const snapshot: GoalSnapshot = {
          id: newId(),
          goal_id: goal.id,
          dream_outcome: goal.dream_outcome,
          likelihood: goal.likelihood,
          time_delay: goal.time_delay,
          effort: goal.effort,
          score,
          rank_position: goals.findIndex((g) => g.id === goal.id) + 1,
          recorded_at: now(),
        }
        set((s) => ({ goals, snapshots: [...s.snapshots, snapshot] }))
        return goal
      },

      updateGoal: (id, data) => {
        set((s) => {
          const existing = s.goals.find((g) => g.id === id)
          if (!existing) return s
          const merged = { ...existing, ...data, updated_at: now() }
          merged.score = computeScore(
            merged.dream_outcome,
            merged.likelihood,
            merged.time_delay,
            merged.effort
          )
          const goals = s.goals
            .map((g) => (g.id === id ? merged : g))
            .sort((a, b) => b.score - a.score)

          let snapshots = s.snapshots
          if (merged.score !== existing.score) {
            snapshots = [
              ...s.snapshots,
              {
                id: newId(),
                goal_id: id,
                dream_outcome: merged.dream_outcome,
                likelihood: merged.likelihood,
                time_delay: merged.time_delay,
                effort: merged.effort,
                score: merged.score,
                rank_position: goals.findIndex((g) => g.id === id) + 1,
                recorded_at: now(),
              },
            ]
          }
          return { goals, snapshots }
        })
      },

      deleteGoal: (id) =>
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      toggleFocus: (id) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id ? { ...g, is_focus: !g.is_focus } : g
          ),
        })),

      getSnapshots: (goalId) =>
        get()
          .snapshots.filter((s) => s.goal_id === goalId)
          .sort(
            (a, b) =>
              new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
          ),
    }),
    { name: "apex-goals", storage: createJSONStorage(() => localStorage) }
  )
)
