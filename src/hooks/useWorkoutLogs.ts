import { useEffect, useState } from 'react'
import { useUser } from './useUser'
import { useUserPlan } from './useUserPlan'
import { supabase } from '@/libs/supabase/client'
import { getLogs, WorkoutLog } from '@/utils/storage'

export function useWorkoutLogs() {
  const user = useUser()
  const { dbPlan } = useUserPlan()
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)

      // 게스트 또는 free 플랜 유저
      if (user === null || dbPlan === 'free') {
        setLogs(getLogs())
        setLoading(false)
        return
      }

      // 유료 플랜 유저
      if (user) {
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
    }

    if (user !== undefined) {
      fetchLogs()
    }
  }, [user, dbPlan])

  return { logs, setLogs, loading }
}
