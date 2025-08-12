// app/components/UserBadge.tsx
'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { useUserPlan } from '@/hooks/useUserPlan'
import { supabase } from '@/libs/supabase/client'

export default function UserBadge() {
  const user = useUser()
  const { dbPlan, planLoading } = useUserPlan()
  const isPlus = dbPlan === 'plus'
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)

  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] ??
    user?.email?.split('@')[0] ??
    'Friend'

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return
      const t = e.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(t) &&
        btnRef.current &&
        !btnRef.current.contains(t)
      ) {
        setOpen(false)
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // ok to clear legacy local flags, but UI logic must use DB plan only
    localStorage.removeItem('userName')
    router.push('/')
  }

  const handlePortal = async () => {
    const res = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
    })
    if (!res.ok) {
      console.error('Portal session error')
      return
    }
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  if (!user) {
    return (
      <div className='flex justify-end items-center gap-3 px-4 py-2'>
        <Link href='/signin' className='text-sm text-blue-600'>
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className='relative flex justify-end items-center px-4 py-2'>
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className='flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100 focus:outline-none'
        aria-haspopup='menu'
        aria-expanded={open}
      >
        {user.user_metadata?.avatar_url && (
          <img
            src={user.user_metadata.avatar_url || '/default-avatar.png'}
            alt='profile'
            referrerPolicy='no-referrer'
            className='w-8 h-8 rounded-full'
          />
        )}
        <span className='text-sm text-gray-700'>{firstName}</span>
        <svg
          className='w-4 h-4'
          viewBox='0 0 20 20'
          fill='currentColor'
          aria-hidden='true'
        >
          <path d='M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z' />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          role='menu'
          className='absolute right-4 top-12 w-56 rounded-xl border border-gray-300 bg-white shadow-lg p-1'
        >
          <div className='px-3 py-2 text-xs text-gray-500'>
            {planLoading
              ? 'Checking plan…'
              : isPlus
              ? 'Plan: Plus'
              : 'Plan: Free'}
          </div>
          {!isPlus && !planLoading && (
            <button
              role='menuitem'
              onClick={() => router.push('/upgrade')}
              className='w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-gray-100'
            >
              Upgrade to Plus
            </button>
          )}
          {isPlus && !planLoading && (
            <button
              role='menuitem'
              onClick={handlePortal}
              className='w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-gray-100'
            >
              Cancel subscription
            </button>
          )}
          <button
            role='menuitem'
            onClick={handleLogout}
            className='w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-gray-100'
          >
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
