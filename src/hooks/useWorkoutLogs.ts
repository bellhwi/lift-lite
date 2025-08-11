// hooks/useWorkoutLogs.ts
import { useEffect, useState } from 'react'
import { useUser } from './useUser'
import { useUserPlan } from './useUserPlan'
import { supabase } from '@/libs/supabase/client'
import { getLogs, type WorkoutLog } from '@/utils/storage'

export function useWorkoutLogs() {
  const user = useUser()
  const { dbPlan, planLoading } = useUserPlan()
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log(user)
    // ✅ 유저/플랜 둘 다 확정되기 전에는 절대 진행하지 않음
    if (user === undefined || planLoading || dbPlan === undefined) return

    let cancelled = false
    const run = async () => {
      setLoading(true)
      try {
        if (user && dbPlan === 'plus') {
          const { data, error } = await supabase
            .from('workouts')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false })

          if (error) throw error
          if (!cancelled) setLogs(data ?? [])
        } else {
          if (!cancelled) setLogs(getLogs())
        }
      } catch (err) {
        console.error('❌ Failed to fetch workouts:', err)
        if (!cancelled) setLogs((prev) => (prev.length ? prev : getLogs()))
      } finally {
        if (!cancelled) setLoading(false) // ✅ true → false가 한 번만 발생
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [user, dbPlan, planLoading])

  return { logs, setLogs, loading, user }
}
