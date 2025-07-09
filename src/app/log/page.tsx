import LogForm from '@/components/LogForm'
import UserBadge from '@/components/UserBadge'

export default function Log() {
  return (
    <main className='min-h-screen bg-white px-4 py-6'>
      <UserBadge />

      <div className='max-w-md mx-auto'>
        <LogForm />
      </div>
    </main>
  )
}
