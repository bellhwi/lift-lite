import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import FeedbackWidget from '@/components/FeedbackWidget'
import Script from 'next/script'
import { Inter, Lexend } from 'next/font/google'
import clsx from 'clsx'

export const metadata: Metadata = {
  title: 'LiftLite',
  description:
    'LiftLite is a minimal workout tracker that lets you log daily lifts, track your progress with simple charts, and stay consistent. No sign-up required.',
}
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang='en'
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        inter.variable,
        lexend.variable
      )}
    >
      <head>
        {/* GTM HEAD SCRIPT */}
        <Script
          id='gtm-head'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5S4ZJML8');
            `,
          }}
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap'
        />
      </head>
      <body className='flex h-full flex-col'>
        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-5S4ZJML8'
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        {children}
        <FeedbackWidget />
      </body>
    </html>
  )
}
