export interface Goal {
  id: string
  title: string
  description?: string
  dream_outcome: number
  likelihood: number
  time_delay: number
  effort: number
  score: number
  color: string
  emoji: string
  is_active: boolean
  is_focus: boolean
  focus_streak: number
  due_date?: string
  created_at: string
  updated_at: string
}

export interface GoalSnapshot {
  id: string
  goal_id: string
  dream_outcome: number
  likelihood: number
  time_delay: number
  effort: number
  score: number
  rank_position: number
  recorded_at: string
}

export interface Task {
  id: string
  goal_id: string
  title: string
  description?: string
  status: "todo" | "in_progress" | "done"
  priority: "low" | "medium" | "high" | "urgent"
  due_date?: string
  completed_at?: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  goal_id?: string
  task_id?: string
  start_at: string
  end_at?: string
  all_day: boolean
  color: string
  event_type: "goal_work" | "milestone" | "review" | "custom"
  created_at: string
}

export interface Toast {
  id: string
  type: "success" | "error" | "info" | "warning"
  message: string
}
