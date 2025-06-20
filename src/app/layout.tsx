import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import FeedbackWidget from '@/components/FeedbackWidget'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'LiftLite',
  description:
    'LiftLite is a minimal workout tracker that lets you log daily lifts, track your progress with simple charts, and stay consistent. No sign-up required.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
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
      </head>
      <body>
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
