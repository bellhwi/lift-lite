'use client'

import { useEffect, useState } from 'react'
import { useUserName } from '@/hooks/useUserName'
import { useWorkoutLogs } from '@/hooks/useWorkoutLogs'
import ExerciseChart from '@/components/ExerciseChart'

export default function ProgressPage() {
  const { logs: initialLogs, loading } = useWorkoutLogs()
  const [logs, setLogs] = useState(initialLogs)
  const userName = useUserName()
  const [toast, setToast] = useState<string | null>(null)
  const [justSavedLift, setJustSavedLift] = useState<string | null>(null)

  useEffect(() => {
    setLogs(initialLogs)
  }, [initialLogs])

  useEffect(() => {
    if (!userName) return

    const saved = sessionStorage.getItem('justSaved')

    if (saved) {
      try {
        const parsed: { lift: string } = JSON.parse(saved)
        setJustSavedLift(parsed.lift)
        setToast(`✓ ${parsed.lift} saved! Keep it going, ${userName}!`)

        setTimeout(() => setToast(null), 4000)
      } catch {
        setJustSavedLift(null)
      } finally {
        sessionStorage.removeItem('justSaved')
      }
    }
  }, [userName])

  return (
    <main className='relative min-h-screen px-4 py-6'>
      {toast && (
        <div className='absolute top-4 left-4 right-4 mx-auto max-w-md bg-green-700 text-white py-2 px-4 rounded shadow text-center z-10'>
          {toast}
        </div>
      )}

      <div className='max-w-md mx-auto space-y-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Your Progress</h1>
        {loading ? (
          <p className='text-center text-gray-500'>Loading your progress...</p>
        ) : (
          <ExerciseChart
            defaultLift={justSavedLift}
            logs={logs}
            setLogs={setLogs}
          />
        )}
      </div>
    </main>
  )
}
