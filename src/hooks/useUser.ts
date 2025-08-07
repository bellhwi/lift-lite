// hooks/useUser.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/libs/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined) // ✅ default: undefined

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [])

  return user
}
