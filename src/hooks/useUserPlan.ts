import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from './useUser'

export function useUserPlan() {
  const user = useUser()
  const [plan, setPlan] = useState<string | null>(null)

  useEffect(() => {
    // ✅ Only run in browser
    const localPlan = localStorage.getItem('userPlan')
    if (localPlan) {
      setPlan(localPlan)
    }
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
        setPlan(data.plan)
        localStorage.setItem('userPlan', data.plan)
      }
    }

    fetchPlan()
  }, [user])

  return plan
}
