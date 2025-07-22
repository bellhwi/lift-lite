// utils/workoutLogHelpers.ts
import type { WorkoutLog } from '@/utils/storage'

export function filterLogsByLift(logs: WorkoutLog[], liftName: string) {
  return logs.filter((log) => log.lift === liftName)
}

export function formatChartData(logs: WorkoutLog[]) {
  return logs
    .map((log) => ({
      date: new Date(log.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      weight: log.weight,
      maxReps: log.maxReps,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function sortLogsByDateDesc(logs: WorkoutLog[]) {
  return [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function formatLongDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })
}
