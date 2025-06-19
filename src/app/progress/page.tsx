'use client'

import { useEffect, useState } from 'react'
import ExerciseChart from '@/components/ExerciseChart'

export default function ProgressPage() {
  const [toast, setToast] = useState<string | null>(null)
  const [justSavedLift, setJustSavedLift] = useState<string | null>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('justSaved')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setJustSavedLift(parsed.lift)
        setToast(`✓ ${parsed.lift} saved successfully!`)
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
        <div className='absolute top-4 left-4 right-4 mx-auto max-w-sm bg-green-600 text-white py-2 px-4 rounded shadow text-center z-10'>
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
