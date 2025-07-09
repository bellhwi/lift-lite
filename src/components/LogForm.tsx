'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'

const presetLifts = ['Squat', 'Deadlift', 'Bench Press', 'Military Press']

export default function LogForm() {
  const router = useRouter()
  const today = new Date().toLocaleDateString('en-CA') // e.g., "2025-06-19"

  const [userName, setUserName] = useState('')
  const [hasName, setHasName] = useState(false)

  const [lift, setLift] = useState(presetLifts[0])
  const [weight, setWeight] = useState('')
  const [note, setNote] = useState('')
  const [maxReps, setMaxReps] = useState('')

  useEffect(() => {
    const savedName = localStorage.getItem('username')
    if (savedName) {
      setUserName(savedName)
      setHasName(true)
    }

    const justLoggedIn = sessionStorage.getItem('justLoggedIn')
    if (justLoggedIn) {
      const confirmed = confirm(
        'Would you like to sync your name and previous workout logs to your account?'
      )

      if (confirmed) {
        // Dynamically import both sync functions
        Promise.all([
          import('@/lib/syncProfile').then((m) => m.syncUserProfile()),
          import('@/lib/sync').then((m) => m.syncLocalLogsToSupabase()),
        ]).then(() => {
          console.log('✅ Synced profile and workouts')
        })
      }

      sessionStorage.removeItem('justLoggedIn')
    }
  }, [])

  const handleSave = () => {
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
    localStorage.setItem(key, JSON.stringify(log))

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

  const handleNameSubmit = () => {
    if (!userName.trim()) return
    localStorage.setItem('username', userName.trim())
    setHasName(true)
  }

  return (
    <div className='max-w-md mx-auto px-4 py-8 space-y-6 bg-white'>
      <h1 className='text-3xl font-bold text-center text-gray-900'>LiftLite</h1>

      {!hasName ? (
        <>
          <p className='text-center text-gray-600'>
            Log workouts in seconds. See your strength grow.
          </p>
          <input
            type='text'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className='w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black'
            placeholder="What's your name?"
          />
          <Button onClick={handleNameSubmit} className='w-full' color='blue'>
            Let’s Get Started
          </Button>
        </>
      ) : (
        <>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Workout
            </label>
            <div className='flex flex-wrap gap-2'>
              <select
                value={lift}
                onChange={(e) => setLift(e.target.value)}
                className='flex-[2] min-w-0 border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black'
              >
                {presetLifts.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>

              <input
                type='number'
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className='flex-1 min-w-0 border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black'
                placeholder='lbs'
              />

              <input
                type='number'
                value={maxReps}
                onChange={(e) => setMaxReps(e.target.value)}
                className='flex-1 min-w-0 border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black'
                placeholder='reps'
              />
            </div>
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
        </>
      )}
    </div>
  )
}
