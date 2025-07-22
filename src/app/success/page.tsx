'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/libs/supabase/client'

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const upgrade = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      await supabase.from('profiles').update({ plan: 'plus' }).eq('id', user.id)
      localStorage.setItem('userPlan', 'plus')
      router.push('/log')
    }

    upgrade()
  }, [])

  return (
    <main className='min-h-screen flex items-center justify-center'>
      <p className='text-xl font-bold'>You're all set. Redirecting...</p>
    </main>
  )
}
