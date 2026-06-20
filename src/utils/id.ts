export const newId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const now = (): string => new Date().toISOString()
