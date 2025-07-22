import { useEffect, useState } from 'react'
import { supabase } from '@/libs/supabase/client'
import { useUser } from './useUser'

export function useUserName() {
  const user = useUser()
  const [name, setName] = useState('You') // fallback

  useEffect(() => {
    const loadName = async () => {
      // ✅ 클라이언트 환경에서만 localStorage 접근
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('userName')
        if (cached) {
          setName(cached)
          return
        }

        // ❗️처음 로그인 이후: Supabase에서 fetch
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single()

          if (profile?.full_name) {
            const firstName = profile.full_name.split(' ')[0]
            setName(firstName)
            localStorage.setItem('userName', firstName)
          }
        }
      }
    }

    loadName()
  }, [user])

  return name
}
