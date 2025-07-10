// hooks/useWorkoutLogs.ts
import { useEffect, useState } from 'react'
import { useUser } from './useUser'
import { supabase } from '@/lib/supabase'
import { getLogs, WorkoutLog } from '@/lib/storage'

export function useWorkoutLogs() {
  const user = useUser()
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)

      if (!user) {
        // not logged in, fallback to localStorage
        setLogs(getLogs())
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) {
        console.error('❌ Failed to fetch workouts:', error)
        setLogs([])
      } else {
        setLogs(data)
      }

      setLoading(false)
    }

    if (user !== undefined) {
      fetchLogs()
    }
  }, [user])

  return { logs, loading }
}
