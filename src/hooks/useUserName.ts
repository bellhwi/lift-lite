import { useEffect, useState } from 'react'
import { supabase } from '@/libs/supabase/client'
import { useUser } from './useUser'

export function useUserName() {
  const user = useUser()
  const [name, setName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('userName')
      if (cached) return cached
    }
    return '' // empty first; we’ll fall back to “You” at render time if still empty
  })

  useEffect(() => {
    const loadName = async () => {
      if (typeof window === 'undefined') return
      const cached = localStorage.getItem('userName')
      if (cached) {
        setName(cached)
        return
      }
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
    loadName()
  }, [user])

  return name || 'You'
}
