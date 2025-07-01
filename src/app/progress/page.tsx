'use client'

import { useEffect, useState } from 'react'
import ExerciseChart from '@/components/ExerciseChart'

export default function ProgressPage() {
  const [toast, setToast] = useState<string | null>(null)
  const [justSavedLift, setJustSavedLift] = useState<string | null>(null)

  useEffect(() => {
    const userName = localStorage.getItem('username') ?? 'You'

    const saved = sessionStorage.getItem('justSaved')
    if (saved) {
      try {
        const parsed: { lift: string; isFirst?: boolean; isPR?: boolean } =
          JSON.parse(saved)
        setJustSavedLift(parsed.lift)

        if (parsed.isFirst) {
          setToast(
            `👏 Congrats, ${userName}! First ${parsed.lift} on the board!`
          )
        } else if (parsed.isPR) {
          setToast(`🔥 You crushed it, ${userName}! New ${parsed.lift} record!`)
        } else {
          setToast(`✓ ${parsed.lift} saved! Keep it going, ${userName}! `)
        }
      } catch {
        setJustSavedLift(null)
      } finally {
        sessionStorage.removeItem('justSaved')
        setTimeout(() => setToast(null), 3000)
      }
    }
  }, [])

  return (
    <main className='relative min-h-screen px-4 py-6'>
      {toast && (
        <div className='absolute top-4 left-4 right-4 mx-auto max-w-md bg-green-700 text-white py-2 px-4 rounded shadow text-center z-10'>
          {toast}
        </div>
      )}

      <div className='max-w-md mx-auto space-y-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Your Progress</h1>
        <ExerciseChart defaultLift={justSavedLift} />
      </div>
    </main>
  )
}
