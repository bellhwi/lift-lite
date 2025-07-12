'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { useUser } from '@/hooks/useUser'
import { useUserName } from '@/hooks/useUserName'
import { useUserPlan } from '@/hooks/useUserPlan'
import { supabase } from '@/lib/supabase'
import CustomWorkoutManager from '@/components/CustomWorkoutManager'

const presetLifts = ['Squat', 'Deadlift', 'Bench Press', 'Military Press']

export default function LogForm() {
  const router = useRouter()
  const user = useUser()
  const userName = useUserName()
  const userPlan = useUserPlan()
  const today = new Date().toLocaleDateString('en-CA') // e.g., "2025-06-19"
  const [lift, setLift] = useState(presetLifts[0])
  const [weight, setWeight] = useState('')
  const [note, setNote] = useState('')
  const [maxReps, setMaxReps] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [customLifts, setCustomLifts] = useState<
    { name: string; id: string }[]
  >([])

  useEffect(() => {
    // 초기 Supabase fetch
    const fetchCustomLifts = async () => {
      const { data } = await supabase
        .from('custom_exercises')
        .select('id, name')
        .eq('user_id', user?.id)

      if (data) setCustomLifts(data)
    }

    fetchCustomLifts()
  }, [user])

  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem('justLoggedIn')
    const hasSyncedBefore = localStorage.getItem('hasSyncedBefore')

    if (justLoggedIn && !hasSyncedBefore) {
      const confirmed = confirm(
        'Would you like to sync your name and previous workout logs to your account?'
      )

      if (confirmed) {
        Promise.all([
          import('@/lib/syncProfile').then((m) => m.syncUserProfile()),
          import('@/lib/sync').then((m) => m.syncLocalLogsToSupabase()),
        ]).then(() => {
          localStorage.setItem('hasSyncedBefore', 'true') // ✅ 최초 동기화 체크
        })
      }

      sessionStorage.removeItem('justLoggedIn')
    }
  }, [])

  const handleSave = async () => {
    if (!weight) {
      alert('Enter a weight!')
      return
    }

    const currentWeight = parseInt(weight)
    const log = {
      date: today,
      lift,
      weight: currentWeight,
      maxReps: parseInt(maxReps) || null,
      note,
    }

    const key = `log-${today}-${lift}`

    if (user) {
      // 로그인 상태 → Supabase upsert (insert or update)
      await supabase
        .from('workouts')
        .upsert(
          [
            {
              ...log,
              user_id: user.id,
            },
          ],
          {
            onConflict: 'user_id,date,lift', // ✅ comma-separated string
          }
        )
        .select()
    } else {
      // 비로그인 상태 → localStorage 저장 (덮어쓰기)
      localStorage.setItem(key, JSON.stringify(log))
    }

    // Analyze all previous logs for this lift
    let isFirst = true
    let isPR = true

    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith('log-') && k.includes(lift) && k !== key) {
        try {
          const pastLog = JSON.parse(localStorage.getItem(k) || '{}')
          if (pastLog.lift === lift) {
            isFirst = false
            if (pastLog.weight >= currentWeight) {
              isPR = false
            }
          }
        } catch {}
      }
    }

    sessionStorage.setItem('justSaved', JSON.stringify({ lift, isFirst, isPR }))

    router.push('/progress')
  }

  return (
    <div className='max-w-md mx-auto px-4 py-8 space-y-6 bg-white'>
      <h1
        className='text-3xl font-bold text-center text-gray-900 cursor-default'
        onClick={() => router.push('/')}
      >
        LiftLite{userPlan === 'plus' && <sup>+</sup>}
      </h1>
      <p className='text-center text-xl text-gray-700'>
        Welcome, {userName} 👋
      </p>

      <div>
        <label className='mb-2 block text-sm font-medium text-gray-700'>
          Workout
        </label>
        <div className='flex flex-wrap gap-2'>
          {/* Workout dropdown + add custom text */}
          <div className='flex flex-col flex-[2] min-w-0'>
            <select
              value={lift}
              onChange={(e) => setLift(e.target.value)}
              className='border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black'
            >
              {presetLifts.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
              {customLifts.map((l) => (
                <option key={l.id} value={l.name}>
                  {l.name}
                </option>
              ))}
            </select>

            {showUpgradeModal && (
              <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
                <div className='bg-white rounded-lg shadow-lg max-w-sm w-full p-6 space-y-4'>
                  <h2 className='text-lg font-bold text-gray-800'>
                    Custom workouts are for Plus users
                  </h2>
                  <p className='text-sm text-gray-600'>
                    Upgrade to the Plus plan to add and track custom lifts.
                  </p>
                  <div className='flex justify-end gap-2'>
                    <button
                      onClick={() => setShowUpgradeModal(false)}
                      className='text-sm text-gray-500'
                    >
                      Maybe later
                    </button>
                    <a
                      href='/upgrade'
                      className='text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                    >
                      Upgrade
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Weight input */}
          <input
            type='number'
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className='flex-1 min-w-0 border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black'
            placeholder='lbs'
          />

          {/* Reps input */}
          <input
            type='number'
            value={maxReps}
            onChange={(e) => setMaxReps(e.target.value)}
            className='flex-1 min-w-0 border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black'
            placeholder='reps'
          />
        </div>

        <button
          type='button'
          onClick={() => {
            if (userPlan === 'plus') {
              setShowCustomInput(true)
            } else {
              setShowUpgradeModal(true)
            }
          }}
          className='mt-1 text-sm text-gray-500 hover:underline text-left'
        >
          + Add custom workout
        </button>

        {showCustomInput && (
          <CustomWorkoutManager
            currentLift={lift}
            onSelectLift={(newLift) => setLift(newLift)}
            onClose={() => setShowCustomInput(false)}
            customLifts={customLifts}
            setCustomLifts={setCustomLifts}
          />
        )}
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Note
        </label>
        <input
          placeholder='How did it feel?'
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className='w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black'
        />
      </div>

      <div className='flex gap-2 pt-2'>
        <Button onClick={handleSave} color='blue' className='w-full'>
          Save Workout
        </Button>
        <Button
          onClick={() => router.push('/progress')}
          variant='outline'
          className='w-full'
        >
          See Progress
        </Button>
      </div>
    </div>
  )
}
