import { useEffect, useState } from 'react'
import { supabase } from '@/libs/supabase/client'
import { useUser } from './useUser'

export function useUserPlan() {
  const user = useUser()
  const [localPlan, setLocalPlan] = useState<string | null>(null)
  const [dbPlan, setDbPlan] = useState<string | null>(null)

  useEffect(() => {
    // ✅ localStorage에서 빠르게 가져와서 UI에 사용
    const local = localStorage.getItem('userPlan')
    if (local) setLocalPlan(local)
  }, [])

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single()

      if (data?.plan) {
        setDbPlan(data.plan)
        localStorage.setItem('userPlan', data.plan) // 캐싱도 여전히 유지
      }
    }

    fetchPlan()
  }, [user])

  return { localPlan, dbPlan }
}
