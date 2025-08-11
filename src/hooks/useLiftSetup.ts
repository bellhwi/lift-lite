'use client'

import { useEffect, useState } from 'react'
import { useCustomLifts } from '@/hooks/useCustomLifts'
import { useUserPlan } from '@/hooks/useUserPlan'
import {
  filterLogsByLift,
  formatChartData,
  sortLogsByDateDesc,
} from '@/utils/workoutLogHelpers'
import type { WorkoutLog } from '@/utils/storage'

const LAST_LIFT_KEY = 'lastLift'
const PRESETS = ['Squat', 'Deadlift', 'Bench Press', 'Military Press']

export function useLiftSetup({
  defaultLift,
  logs,
}: {
  defaultLift: string | null
  logs: WorkoutLog[]
}) {
  const { customLifts } = useCustomLifts()
  const { dbPlan, planLoading } = useUserPlan()

  const [allLifts, setAllLifts] = useState<string[]>(PRESETS)

  // ✅ 초기 렌더에서 바로 liftName 결정 (로그 없어도 동작)
  const [liftName, setLiftName] = useState<string | null>(() => {
    const saved =
      typeof window !== 'undefined' ? localStorage.getItem(LAST_LIFT_KEY) : null
    return defaultLift ?? saved ?? logs[0]?.lift ?? PRESETS[0] ?? null
  })

  const [data, setData] = useState<
    { date: string; weight: number; maxReps?: number }[]
  >([])

  // 플랜/커스텀 리프트에 따라 목록 구성
  useEffect(() => {
    if (dbPlan === 'plus') {
      setAllLifts([...PRESETS, ...(customLifts ?? [])])
    } else {
      setAllLifts(PRESETS)
    }
  }, [dbPlan, customLifts])

  // ✅ defaultLift가 나중에 도착하면 1회 보충 세팅
  useEffect(() => {
    if (!liftName && defaultLift) setLiftName(defaultLift)
  }, [defaultLift, liftName])

  // ✅ 로그가 나중에 생겨도 1회 보충 세팅
  useEffect(() => {
    if (!liftName && logs.length > 0) {
      setLiftName(logs[0]?.lift ?? PRESETS[0])
    }
  }, [logs.length, liftName])

  // ✅ 사용자 선택 기억
  useEffect(() => {
    if (liftName) {
      try {
        localStorage.setItem(LAST_LIFT_KEY, liftName)
      } catch {}
    }
  }, [liftName])

  // 차트 데이터 계산
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
    userPlan: dbPlan,
    planLoading,
  }
}
