import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import FeedbackWidget from '@/components/FeedbackWidget'

export const metadata: Metadata = {
  title: 'LiftLite',
  description:
    'LiftLite is a minimal workout tracker that lets you log daily lifts, track your progress with simple charts, and stay consistent. No sign-up required.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body>
        {children}
        <FeedbackWidget />
      </body>
    </html>
  )
}
