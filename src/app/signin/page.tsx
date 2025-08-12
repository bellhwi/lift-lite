'use client'

import { useEffect } from 'react'
import { supabase } from '@/libs/supabase/client'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/Landing/Button'

export default function SignInPage() {
  const router = useRouter()
  const user = useUser()

  useEffect(() => {
    if (user) {
      router.push('/log')
    }
  }, [user])

  const handleLogin = async () => {
    const base = typeof window !== 'undefined' ? window.location.origin : ''
    const isDev = base.includes('localhost')

    const redirectTo = isDev
      ? `${base}/log` // dev: land on /log directly
      : `${base}/auth/callback?next=/log` // prod: use callback

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    if (error) {
      alert('Login failed!')
      console.error(error)
    }
  }

  return (
    <main className='min-h-screen bg-white px-4 py-6'>
      <div className='max-w-md mx-auto px-4 py-8 space-y-6 bg-white'>
        <h1 className='text-3xl font-bold text-center text-gray-900'>
          Sign in to LiftLite
        </h1>
        <p className='text-center text-gray-600'>
          Add your name to your log. <br />
          Start personalizing your workouts.
        </p>
        <Button onClick={handleLogin} className='w-full' color='blue'>
          Continue with Google
        </Button>
      </div>
    </main>
  )
}
