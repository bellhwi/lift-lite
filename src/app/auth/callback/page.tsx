// app/auth/callback/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const redirect = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        router.replace('/log') // ✅ go to main app
      } else {
        router.replace('/') // fallback if not signed in
      }
    }

    redirect()
  }, [])

  return <p className='text-center mt-10'>Redirecting...</p>
}
