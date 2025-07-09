// components/AuthButtons.tsx
'use client'

import { supabase } from '@/lib/supabase'

export default function AuthButtons() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) console.error('Login error:', error)
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Logout error:', error)
  }

  return (
    <div className='flex gap-4'>
      <button
        onClick={handleLogin}
        className='px-4 py-2 bg-black text-white rounded'
      >
        Sign in with Google
      </button>
      <button onClick={handleLogout} className='px-4 py-2 bg-gray-300 rounded'>
        Log out
      </button>
    </div>
  )
}
