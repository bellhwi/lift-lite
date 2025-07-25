'use client'
import { useState } from 'react'
import { Button } from '@/components/Button'

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const data = new FormData(form)

    fetch('https://formspree.io/f/xyzjdzwk', {
      method: 'POST',
      body: data,
      headers: {
        Accept: 'application/json',
      },
    }).then(() => {
      setSubmitted(true)
    })
  }

  return (
    <>
      {/* Floating Feedback Button */}
      <Button
        onClick={() => setOpen(true)}
        className='fixed bottom-4 right-4 z-50 rounded-full'
      >
        💬 Feedback
      </Button>

      {/* Slide-Up Box */}
      {open && (
        <div className='fixed bottom-16 right-4 z-50 w-80 bg-white border shadow-lg rounded-xl p-4'>
          <div className='flex justify-between items-center mb-2'>
            <h2 className='text-sm font-semibold'>Feedback?</h2>
            <button
              onClick={() => {
                setOpen(false)
                setSubmitted(false)
              }}
              className='text-gray-500 hover:text-gray-700'
            >
              ✕
            </button>
          </div>

          {submitted ? (
            <p className='text-sm text-gray-700'>
              Thanks! Got your feedback 💪
            </p>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-3'>
              <textarea
                name='message'
                required
                placeholder='Type your feedback here…'
                className='w-full h-24 p-2 border rounded resize-none text-sm'
              />
              <input
                type='email'
                name='email'
                placeholder='Email'
                className='w-full p-2 border rounded text-sm block'
              />

              <Button type='submit' className='w-full'>
                Send Feedback
              </Button>
            </form>
          )}
        </div>
      )}
    </>
  )
}
