import { CallToAction } from '@/components/Landing/CallToAction'
import { Faqs } from '@/components/Landing/Faqs'
import { Footer } from '@/components/Landing/Footer'
import { Header } from '@/components/Landing/Header'
import { Hero } from '@/components/Landing/Hero'
import { Pricing } from '@/components/Landing/Pricing'
import { PrimaryFeatures } from '@/components/Landing/PrimaryFeatures'
import { SecondaryFeatures } from '@/components/Landing/SecondaryFeatures'
import FeedbackWidget from '@/components/Landing/FeedbackWidget'

export default function Home() {
  const siteUrl = 'https://www.liftlite.app'

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'LiftLite',
    url: siteUrl,
    description:
      'Free weightlifting training log — no download, no signup. Log in 10 seconds.',
    applicationCategory: 'FitnessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
      <FeedbackWidget />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </>
  )
}
