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
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setLogs(initialLogs)
  }, [initialLogs])

  useEffect(() => {
    if (!userName) return

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
          setToast(`✓ ${parsed.lift} saved! Keep it going, ${userName}!`)
        }

        setTimeout(() => setToast(null), 3000)
      } catch {
        setJustSavedLift(null)
      } finally {
        sessionStorage.removeItem('justSaved')
        setReady(true) // ✅ 여기서만 호출
      }
    } else {
      setReady(true) // ✅ justSaved 없으면 즉시 렌더 준비 완료
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
        {!ready && loading ? (
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
