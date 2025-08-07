'use client'

import { useEffect, useState } from 'react'
import { useCustomLifts } from '@/hooks/useCustomLifts'
import {
  filterLogsByLift,
  formatChartData,
  sortLogsByDateDesc,
} from '@/utils/workoutLogHelpers'
import type { WorkoutLog } from '@/utils/storage'

export function useLiftSetup({
  defaultLift,
  logs,
}: {
  defaultLift: string | null
  logs: WorkoutLog[]
}) {
  const presetLifts = ['Squat', 'Deadlift', 'Bench Press', 'Military Press']
  const { customLifts } = useCustomLifts()

  const [userPlan, setUserPlan] = useState<'free' | 'plus' | null>(null)
  const [allLifts, setAllLifts] = useState<string[]>(presetLifts)
  const [liftName, setLiftName] = useState<string | null>(null)
  const [data, setData] = useState<
    { date: string; weight: number; maxReps?: number }[]
  >([])

  // 1. userPlan 읽기 (localStorage는 비동기적 영향이 있음)
  useEffect(() => {
    const plan = localStorage.getItem('userPlan') as 'free' | 'plus' | null
    setUserPlan(plan || 'free')
  }, [])

  // 2. userPlan 또는 customLifts가 바뀔 때 allLifts 업데이트
  useEffect(() => {
    if (userPlan === 'plus') {
      setAllLifts([...presetLifts, ...(customLifts ?? [])])
    } else {
      setAllLifts(presetLifts)
    }
  }, [userPlan, customLifts])

  useEffect(() => {
    if (!liftName && userPlan && logs.length > 0) {
      const fallbackLift = logs[0]?.lift || 'Deadlift'
      setLiftName(defaultLift || fallbackLift)
    }
  }, [defaultLift, logs, userPlan, liftName])

  useEffect(() => {
    if (!liftName) return
    const filtered = filterLogsByLift(logs, liftName)
    setData(formatChartData(filtered))
  }, [liftName, logs])

  const filteredLogs = liftName
    ? sortLogsByDateDesc(filterLogsByLift(logs, liftName))
    : []

  return {
    liftName,
    setLiftName,
    allLifts,
    data,
    filteredLogs,
    userPlan,
  }
}
