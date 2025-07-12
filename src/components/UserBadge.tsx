// UserBadge.tsx
'use client'

import Link from 'next/link'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function UserBadge() {
  const user = useUser()
  const router = useRouter()

  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] ??
    user?.email?.split('@')[0] ??
    'Friend'

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('userName')
    localStorage.removeItem('userPlan')
    router.push('/') // Redirect after logout
  }

  return (
    <div className='flex justify-end items-center gap-3 px-4 py-2'>
      {user ? (
        <>
          {user.user_metadata?.avatar_url && (
            <img
              src={user.user_metadata.avatar_url}
              alt='profile'
              className='w-8 h-8 rounded-full'
            />
          )}
          <span className='text-sm text-gray-700'>{firstName}</span>
          <button
            onClick={handleLogout}
            className='text-xs text-gray-400 hover:underline'
          >
            Log out
          </button>
        </>
      ) : (
        <Link href='/signin' className='text-sm text-blue-600'>
          Sign in
        </Link>
      )}
    </div>
  )
}
