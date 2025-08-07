'use client'

import { Button } from '@/components/Landing/Button'
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'

export default function UpgradePage() {
  const user = useUser()
  const router = useRouter()
  const handleUpgrade = async () => {
    if (!user) {
      router.push('/signin')
      return
    }

    const res = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      credentials: 'include',
    })

    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    } else {
      alert('Something went wrong.')
    }
  }

  return (
    <main className='min-h-screen bg-white px-4 py-6'>
      <div className='max-w-md mx-auto px-4 py-8 space-y-6 bg-white'>
        <h1 className='text-3xl font-bold text-center text-gray-900'>
          Upgrade to LiftLite Plus
        </h1>
        <p className='text-center text-gray-600'>
          Custom lifts. Cloud sync. A log that follows you anywhere.
        </p>
        <p className='text-center text-sm text-gray-500'>
          $5/month – early access pricing. Yours for good.
        </p>

        <div className='flex gap-2 pt-2'>
          <Button onClick={handleUpgrade} className='w-full' color='blue'>
            Go to Checkout
          </Button>
          <Button
            onClick={() => router.push('/log')}
            variant='outline'
            className='w-full'
          >
            Back to Log
          </Button>
        </div>
      </div>
    </main>
  )
}
