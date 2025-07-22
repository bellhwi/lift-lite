export type WorkoutLog = {
  date: string
  lift: string
  weight: number
  note?: string
  maxReps?: number
}

export const getLogs = (): WorkoutLog[] => {
  if (typeof window === 'undefined') return []

  const logs: WorkoutLog[] = []
  for (const key in localStorage) {
    if (key.startsWith('log-') && key.split('-').length >= 3) {
      try {
        const log = JSON.parse(localStorage.getItem(key) || '')
        if (log?.date && log?.lift && typeof log.weight === 'number') {
          logs.push(log)
        }
      } catch {
        continue
      }
    }
  }

  return logs.sort((a, b) => b.date.localeCompare(a.date))
}
