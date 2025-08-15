'use client'

import { type ImageProps } from 'next/image'
import { Tab, TabGroup, TabList } from '@headlessui/react'
import clsx from 'clsx'
import { Container } from '@/components/Landing/Container'

interface Feature {
  name: React.ReactNode
  summary: string
  description: string
  image?: ImageProps['src']
  icon: React.ComponentType
}

// Icons
const BarbellIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className,
  ...props
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 -960 960 960'
    width='24'
    height='24'
    className={clsx('h-6 w-6 text-white', className)}
    fill='currentColor'
    {...props}
  >
    <path d='m536-84-56-56 142-142-340-340-142 142-56-56 56-58-56-56 84-84-56-58 56-56 58 56 84-84 56 56 58-56 56 56-142 142 340 340 142-142 56 56-56 58 56 56-84 84 56 58-56 56-58-56-84 84-56-56-58 56Z' />
  </svg>
)

export const EditNoteIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className,
  ...props
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 -960 960 960'
    width='24'
    height='24'
    fill='currentColor'
    className={clsx('h-6 w-6 text-white', className)}
    {...props}
  >
    <path d='M160-400v-80h280v80H160Zm0-160v-80h440v80H160Zm0-160v-80h440v80H160Zm360 560v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z' />
  </svg>
)

export const ProgressIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className,
  ...props
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 -960 960 960'
    width='24'
    height='24'
    fill='currentColor'
    className={clsx('h-6 w-6 text-white', className)}
    {...props}
  >
    <path d='m140-220-60-60 300-300 160 160 284-320 56 56-340 384-160-160-240 240Z' />
  </svg>
)

const features: Array<Feature> = [
  {
    name: 'One',
    summary: 'Pick your lift',
    description: 'Choose from presets like Squat, Bench, Deadlift.',

    icon: () => <BarbellIcon />,
  },
  {
    name: 'Two',
    summary: 'Log your best set',
    description: 'Weight, reps, note (if you want). Done in seconds.',

    icon: () => <EditNoteIcon />,
  },
  {
    name: 'Three',
    summary: 'Track progress',
    description: 'Get instant feedback with no-nonsense visuals.',

    icon: () => <ProgressIcon />,
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
