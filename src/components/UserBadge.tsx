// app/components/UserBadge.tsx
'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { useUserPlan } from '@/hooks/useUserPlan'
import { supabase } from '@/libs/supabase/client'

type CancelInfo = { scheduled: boolean; cancelAt: Date | null }

export default function UserBadge() {
  const user = useUser()
  const { dbPlan, planLoading } = useUserPlan()
  const isPlus = dbPlan === 'plus'
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)

  const [cancelInfo, setCancelInfo] = useState<CancelInfo>({
    scheduled: false,
    cancelAt: null,
  })
  const [syncing, setSyncing] = useState(false)

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

  // 메뉴를 열 때: 상태 동기화 + 취소예약 상태 로드
  useEffect(() => {
    if (!open || !user) return
    ;(async () => {
      try {
        setSyncing(true)
        // 1) 서버와 강제 동기화 (웹훅 누락 대비)
        await fetch('/api/stripe/sync-subscription', { method: 'POST' }).catch(
          () => {}
        )

        // 2) 내 프로필에서 취소예약 상태만 읽기 (RLS에서 본인 row select 허용 가정)
        const { data, error } = await supabase
          .from('profiles')
          .select('cancel_at, cancel_at_period_end')
          .eq('id', user.id)
          .single()

        if (!error && data) {
          setCancelInfo({
            scheduled: !!data.cancel_at_period_end,
            cancelAt: data.cancel_at ? new Date(data.cancel_at) : null,
          })
        }
      } finally {
        setSyncing(false)
      }
    })()
  }, [open, user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
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

  const fmt = (d: Date | null) =>
    d
      ? d.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : ''

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
          className='absolute right-4 top-12 w-64 rounded-xl border border-gray-300 bg-white shadow-lg p-1'
        >
          <div className='px-3 py-2 text-xs text-gray-500'>
            {planLoading || syncing
              ? 'Checking plan…'
              : isPlus
              ? cancelInfo.scheduled
                ? `Plan: Plus · Cancels ${fmt(cancelInfo.cancelAt)}`
                : 'Plan: Plus'
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
              Manage subscription
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
