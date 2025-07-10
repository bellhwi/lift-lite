import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from './useUser'

export function useUserName() {
  const user = useUser()
  const [name, setName] = useState('You') // fallback default

  useEffect(() => {
    const fetchName = async () => {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()

        if (profile?.full_name) {
          setName(profile.full_name.split(' ')[0]) // or just use full_name as-is
        }
      } else {
        // Fallback to localStorage for guests
        const localName = localStorage.getItem('username')
        if (localName) setName(localName)
      }
    }

    fetchName()
  }, [user])

  return name
}
