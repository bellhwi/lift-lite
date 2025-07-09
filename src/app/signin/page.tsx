'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/Button'

export default function SignInPage() {
  const router = useRouter()
  const user = useUser()

  useEffect(() => {
    if (user) {
      router.push('/log') // 로그인된 경우 자동 이동
    }
  }, [user])

  const handleLogin = async () => {
    // ✅ 로그인 직후 flag 남기기
    sessionStorage.setItem('justLoggedIn', 'true')

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/log', // 또는 배포 주소
      },
    })

    if (error) {
      alert('Login failed!')
      console.error(error)
    }
  }

  return (
    <>
      <main className='min-h-screen bg-white px-4 py-6'>
        <div className='max-w-md mx-auto px-4 py-8 space-y-6 bg-white'>
          <h1 className='text-3xl font-bold text-center text-gray-900'>
            Sign in to LiftLite
          </h1>
          <p className='text-center text-gray-600'>
            Sync your workouts and track progress across devices
          </p>
          <Button onClick={handleLogin} className='w-full' color='blue'>
            Continue with Google
          </Button>
        </div>
      </main>
    </>
  )
}
