import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from './useUser'

export function useUserPlan() {
  const user = useUser()
  const [plan, setPlan] = useState<'free' | 'plus'>('free')

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
      }
    }

    fetchPlan()
  }, [user])

  return plan
}
