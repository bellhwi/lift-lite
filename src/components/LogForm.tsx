'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
  }, [])

  const handleSave = () => {
    if (!weight) {
      alert('Enter a weight!')
      return
    }

    const log = {
      date: today,
      lift,
      weight: parseInt(weight),
      maxReps: parseInt(maxReps) || null,
      note,
    }

    const key = `log-${today}-${lift}`

    localStorage.setItem(key, JSON.stringify(log))
    sessionStorage.setItem('justSaved', JSON.stringify({ lift }))

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
          <button
            onClick={handleNameSubmit}
            className='w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-900'
          >
            Let’s Get Started
          </button>
        </>
      ) : (
        <>
          <p className='text-center text-gray-700 text-lg'>
            Welcome, <span className='font-semibold'>{userName}</span> 👋
          </p>
          <p className='text-center text-gray-500 text-sm mt-1'>
            Pick your workout, enter the weight, and log it below.
          </p>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Workout & Weight
            </label>
            <div className='flex gap-2'>
              <select
                value={lift}
                onChange={(e) => setLift(e.target.value)}
                className='flex-1 border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black'
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
                className='w-24 border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black'
                placeholder='lbs'
              />

              <input
                type='number'
                value={maxReps}
                onChange={(e) => setMaxReps(e.target.value)}
                className='w-24 border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black'
                placeholder='reps'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Daily Note
            </label>
            <input
              placeholder='How’d it feel today?'
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className='w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black'
            />
          </div>

          <div className='flex gap-2 pt-2'>
            <button
              onClick={handleSave}
              className='w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-900'
            >
              Save Workout
            </button>
            <button
              onClick={() => router.push('/progress')}
              className='w-full border border-black text-black py-3 rounded font-medium hover:bg-gray-100'
            >
              See Progress
            </button>
          </div>
        </>
      )}
    </div>
  )
}
