// hooks/useUserPlan.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from './useUser'

export function useUserPlan() {
  const user = useUser()
  const [plan, setPlan] = useState<string | null>(
    () => localStorage.getItem('userPlan') || null // 1️⃣ 초기 로컬 값 사용
  )

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user) return

      const { data } = await supabase
        .from('profiles') // 또는 사용자 테이블 이름
        .select('plan')
        .eq('id', user.id)
        .single()

      if (data?.plan) {
        setPlan(data.plan)
        localStorage.setItem('userPlan', data.plan) // 2️⃣ 캐시 저장
      }
    }

    fetchPlan()
  }, [user])

  return plan
}
