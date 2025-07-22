'use client'

export default function LiftSelector({
  liftName,
  setLiftName,
  allLifts,
}: {
  liftName: string
  setLiftName: (name: string) => void
  allLifts: string[]
}) {
  return (
    <div>
      <select
        value={liftName}
        onChange={(e) => setLiftName(e.target.value)}
        className='text-xl font-bold text-gray-900 border-b border-gray-400 p-1 bg-transparent focus:outline-none'
      >
        {allLifts.map((lift) => (
          <option key={lift} value={lift}>
            {lift}
          </option>
        ))}
      </select>
    </div>
  )
}
