import { useEffect, useState } from 'react'
import { supabase } from '@/libs/supabase/client'
import { useUser } from './useUser'

export function useUserPlan() {
  const user = useUser()
  const [localPlan, setLocalPlan] = useState<string | null>(null)
  const [dbPlan, setDbPlan] = useState<string>('free') // ✅ 기본값 'free'

  useEffect(() => {
    const local = localStorage.getItem('userPlan')
    if (local) setLocalPlan(local)
  }, [])

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user) return // null(게스트)든 undefined(로딩 중)이든 무시

      const { data, error } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single()

      if (data?.plan) {
        setDbPlan(data.plan)
        localStorage.setItem('userPlan', data.plan)
      } else if (error) {
        console.error('❌ Failed to fetch user plan:', error)
      }
    }

    fetchPlan()
  }, [user])

  return { localPlan, dbPlan }
}
