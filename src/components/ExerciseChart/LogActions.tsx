'use client'

import { supabase } from '@/libs/supabase/client'
import type { WorkoutLog } from '@/utils/storage'
import type { User } from '@supabase/supabase-js'

export async function updateLog(
  user: User | null,
  log: WorkoutLog,
  updated: WorkoutLog
) {
  if (user) {
    await supabase
      .from('workouts')
      .update(updated)
      .eq('user_id', user.id)
      .eq('date', log.date)
      .eq('lift', log.lift)
  } else {
    const key = `log-${log.date}-${log.lift}`
    localStorage.setItem(key, JSON.stringify(updated))
  }
}

export async function deleteLog(
  user: User | null,
  log: WorkoutLog,
  setLogs: React.Dispatch<React.SetStateAction<WorkoutLog[]>>
) {
  if (user) {
    await supabase
      .from('workouts')
      .delete()
      .eq('user_id', user.id)
      .eq('date', new Date(log.date).toISOString())
    setLogs((prev) =>
      prev.filter((l) => !(l.date === log.date && l.lift === log.lift))
    )
  } else {
    const key = `log-${log.date}-${log.lift}`
    localStorage.removeItem(key)
    setLogs((prev) =>
      prev.filter((l) => !(l.date === log.date && l.lift === log.lift))
    )
  }
}
