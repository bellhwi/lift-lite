// utils/workoutLogHelpers.ts
import type { WorkoutLog } from '@/utils/storage'

// ✅ 공통: 로컬 자정 기준으로 안전 파싱 (YYYY-MM-DD / ISO 모두 대응)
function parseLocalDate(dateStr: string): Date {
  if (!dateStr) return new Date(NaN)
  const iso = dateStr.slice(0, 10) // YYYY-MM-DD
  const [y, m, d] = iso.split('-').map(Number)
  if (y && m && d) return new Date(y, m - 1, d) // 로컬 자정
  // 백업: 기타 형식은 브라우저 파서에 위임
  return new Date(dateStr)
}

const SHORT_FMT: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }

export function formatShortDateLocal(dateStr: string): string {
  const dt = parseLocalDate(dateStr)
  return Number.isNaN(dt.getTime())
    ? ''
    : dt.toLocaleDateString('en-US', SHORT_FMT)
}

export function filterLogsByLift(logs: WorkoutLog[], liftName: string) {
  return logs.filter((log) => log.lift === liftName)
}

// ✅ 정렬은 원본 날짜로, 표시만 'Aug 10' 같은 short 형식
export function formatChartData(logs: WorkoutLog[]) {
  return [...logs]
    .sort(
      (a, b) =>
        parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime()
    )
    .map((log) => ({
      date: formatShortDateLocal(log.date),
      weight: log.weight,
      maxReps: log.maxReps,
    }))
}

export function sortLogsByDateDesc(logs: WorkoutLog[]) {
  return [...logs].sort(
    (a, b) =>
      parseLocalDate(b.date).getTime() - parseLocalDate(a.date).getTime()
  )
}
