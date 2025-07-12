'use client'

import { type ImageProps } from 'next/image'
import { Tab, TabGroup, TabList } from '@headlessui/react'
import clsx from 'clsx'
import { Container } from '@/components/Container'

interface Feature {
  name: React.ReactNode
  summary: string
  description: string
  image?: ImageProps['src']
  icon: React.ComponentType
}

const features: Array<Feature> = [
  {
    name: 'One',
    summary: 'Pick your lift',
    description: 'Choose from presets like Squat, Bench, Deadlift.',

    icon: () => (
      <span className='material-symbols-outlined text-white text-[28px]'>
        fitness_center
      </span>
    ),
  },
  {
    name: 'Two',
    summary: 'Log your best set',
    description: 'Weight, reps, note (if you want). Done in seconds.',

    icon: () => (
      <span className='material-symbols-outlined text-white text-[28px]'>
        edit_note
      </span>
    ),
  },
  {
    name: 'Three',
    summary: 'Track progress',
    description: 'Get instant feedback with no-nonsense visuals.',

    icon: () => (
      <span className='material-symbols-outlined text-white text-[28px]'>
        show_chart
      </span>
    ),
  },
]

function Feature({
  feature,
  isActive,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  feature: Feature
  isActive: boolean
}) {
  return (
    <div
      className={clsx(className, !isActive && 'opacity-75 hover:opacity-100')}
      {...props}
    >
      <div
        className={clsx(
          'w-9 rounded-lg',
          isActive ? 'bg-blue-600' : 'bg-slate-500'
        )}
      >
        <div className='h-9 w-9 flex items-center justify-center'>
          <feature.icon />
        </div>
      </div>
      <h3
        className={clsx(
          'mt-6 text-sm font-medium',
          isActive ? 'text-blue-600' : 'text-slate-600'
        )}
      >
        {feature.name}
      </h3>
      <p className='mt-2 font-display text-xl text-slate-900'>
        {feature.summary}
      </p>
      <p className='mt-4 text-sm text-slate-600'>{feature.description}</p>
    </div>
  )
}

function FeaturesMobile() {
  return (
    <div className='-mx-4 mt-20 flex flex-col gap-y-10 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden'>
      {features.map((feature) => (
        <div key={feature.summary}>
          <Feature feature={feature} className='mx-auto max-w-2xl' isActive />
        </div>
      ))}
    </div>
  )
}

function FeaturesDesktop() {
  return (
    <TabGroup className='hidden lg:mt-20 lg:block'>
      {({ selectedIndex }) => (
        <>
          <TabList className='grid grid-cols-3 gap-x-8'>
            {features.map((feature, featureIndex) => (
              <Feature
                key={feature.summary}
                feature={{
                  ...feature,
                  name: (
                    <Tab className='data-selected:not-data-focus:outline-hidden'>
                      <span className='absolute inset-0' />
                      {feature.name}
                    </Tab>
                  ),
                }}
                isActive={featureIndex === selectedIndex}
                className='relative'
              />
            ))}
          </TabList>
        </>
      )}
    </TabGroup>
  )
}

export function SecondaryFeatures() {
  return (
    <section
      id='how-it-works'
      aria-label='Features for simplifying everyday business tasks'
      className='pt-20 pb-14 sm:pt-32 sm:pb-20 lg:pb-32'
    >
      <Container>
        <div className='mx-auto max-w-2xl md:text-center'>
          <h2 className='font-display text-3xl tracking-tight text-slate-900 sm:text-4xl'>
            How It Works
          </h2>
          <p className='mt-4 text-lg tracking-tight text-slate-700'>
            Weight. Reps. Maybe a note. Done.
          </p>
        </div>
        <FeaturesMobile />
        <FeaturesDesktop />
      </Container>
    </section>
  )
}
