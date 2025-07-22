import Image from 'next/image'

import { Container } from '@/components/Landing/Container'
import backgroundImage from '@/images/background-faqs.jpg'

const faqs = [
  [
    {
      question: 'Why is this so minimal?',
      answer: "Because workouts should be hard. Logging them shouldn't.",
    },
    {
      question: 'Do I need an account?',
      answer: 'Nope. Start logging right now in your browser.',
    },
    {
      question: 'What if I switch devices?',
      answer:
        'Local data stays in your browser. Want cloud sync? That’s what Plus is for.',
    },
  ],
  [
    {
      question: 'If I upgrade to Plus, can I sync my old logs?',
      answer:
        'Yup. When you sign in, we’ll ask if you want to sync your local logs to your account. Just confirm, and they’ll be saved to the cloud.',
    },
    {
      question: 'Is there a lifetime plan?',
      answer:
        'Not yet. We’re keeping it lean and growing slow. Monthly helps us build sustainably.',
    },
    {
      question: 'Can I track cardio or routines?',
      answer:
        'Nope. This is for top sets and PRs. If you want full planning tools, there are other apps for that—and we’re cool with it.',
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
            We stripped the fluff from our answers too.
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
