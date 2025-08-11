// hooks/useUserPlan.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/libs/supabase/client'
import { useUser } from './useUser'

export function useUserPlan() {
  const user = useUser() // User | null | undefined
  const [dbPlan, setDbPlan] = useState<'free' | 'plus' | undefined>(undefined)
  const [planLoading, setPlanLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    // 1) 아직 유저 판별 전
    if (user === undefined) {
      setDbPlan(undefined)
      setPlanLoading(true)
      return
    }

    // 2) 게스트(=null) → 즉시 free 확정
    if (user === null) {
      setDbPlan('free')
      setPlanLoading(false)
      return
    }

    // 3) 로그인 유저 → DB에서 플랜 조회
    ;(async () => {
      setPlanLoading(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single()
        if (error) throw error
        if (!cancelled) setDbPlan(data?.plan === 'plus' ? 'plus' : 'free')
      } catch (e) {
        console.error('❌ fetch plan:', e)
        if (!cancelled) setDbPlan('free')
      } finally {
        if (!cancelled) setPlanLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user]) // ✅ 포인트: user 자체를 의존성으로

  return { dbPlan, planLoading }
}
