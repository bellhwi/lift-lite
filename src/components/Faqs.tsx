import Image from 'next/image'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-faqs.jpg'

const faqs = [
  [
    {
      question: 'Why is LiftLite so minimal?',
      answer:
        'Because logging your workouts shouldn’t feel like a workout. Most fitness apps are overloaded with features that get in the way. LiftLite strips everything down so you can focus on what matters: lifting, logging, and moving on.',
    },
    {
      question: 'Do I need to create an account to use LiftLite?',
      answer:
        'Nope. You can log your workouts instantly without signing up. All your data is saved locally in your browser.',
    },
    {
      question: 'Where is my workout data stored?',
      answer:
        'All your logs stay on your browser — nothing is sent to any server. Just make sure to use the same browser on the same device to keep your data.',
    },
  ],
  [
    {
      question: 'What if I clear my browser or switch devices?',
      answer:
        'Your data is stored only in your current browser. To keep your logs safe across devices, LiftLite Plus will offer sync and backup features soon.',
    },
    {
      question: 'Is there a mobile app?',
      answer:
        'Nope, and that’s by design. LiftLite is a fast, lightweight web app that works beautifully on mobile — no installs, no updates, just open and log.',
    },
    {
      question: 'Can I track cardio, supersets, or detailed routines?',
      answer:
        "Not at the moment. LiftLite is built for simple PR logging. If you're looking for full workout planning tools, this probably isn't the app for you — and that's okay.",
    },
  ],
]

export function Faqs() {
  return (
    <section
      id='faq'
      aria-labelledby='faq-title'
      className='relative overflow-hidden bg-slate-50 py-20 sm:py-32'
    >
      <Image
        className='absolute top-0 left-1/2 max-w-none translate-x-[-30%] -translate-y-1/4'
        src={backgroundImage}
        alt=''
        width={1558}
        height={946}
        unoptimized
      />
      <Container className='relative'>
        <div className='mx-auto max-w-2xl lg:mx-0'>
          <h2
            id='faq-title'
            className='font-display text-3xl tracking-tight text-slate-900 sm:text-4xl'
          >
            Frequently asked questions
          </h2>
          <p className='mt-4 text-lg tracking-tight text-slate-700'>
            Everything you need to know before your first log.
          </p>
        </div>
        <ul
          role='list'
          className='mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2'
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role='list' className='flex flex-col gap-y-8'>
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className='font-display text-lg/7 text-slate-900'>
                      {faq.question}
                    </h3>
                    <p className='mt-4 text-sm text-slate-700'>{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
