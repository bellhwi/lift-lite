import { useEffect, useState } from 'react'
import { supabase } from '@/libs/supabase/client'
import { useUser } from './useUser'

export function useCustomLifts() {
  const user = useUser()
  const [customLifts, setCustomLifts] = useState<string[]>([])

  useEffect(() => {
    if (!user) return
    const fetchLifts = async () => {
      const { data, error } = await supabase
        .from('custom_exercises')
        .select('name')
        .eq('user_id', user.id)

      if (!error && data) {
        setCustomLifts(data.map((d) => d.name))
      }
    }

    fetchLifts()
  }, [user])

  return { customLifts }
}
