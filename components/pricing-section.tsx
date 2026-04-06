'use client';
import { useState } from 'react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    desc: 'Get free daily credits to try basic features.',
    cta: 'Start for Free',
    href: '/pricing',
    features: ['Daily free credits', 'Image generation', 'Basic upscaling', 'Community access'],
    dark: false,
    highlight: false,
  },
  {
    name: 'Basic',
    price: '$10',
    period: '/mo',
    desc: 'Access our most popular features.',
    cta: 'Get Basic',
    href: '/pricing',
    features: ['500 credits/month', 'All image models', 'HD upscaling', 'Video generation'],
    dark: false,
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$24',
    period: '/mo',
    desc: 'Advanced features and discounts on compute.',
    cta: 'Get Pro',
    href: '/pricing',
    features: ['Unlimited generations', 'All video models', 'LoRA fine-tuning', '4K upscaling', 'Priority queue'],
    dark: true,
    highlight: true,
  },
  {
    name: 'Max',
    price: '$49',
    period: '/mo',
    desc: 'Full access with higher discounts on compute.',
    cta: 'Get Max',
    href: '/pricing',
    features: ['Everything in Pro', '22K upscaling', 'API access', 'Dedicated support', 'Team collaboration'],
    dark: false,
    highlight: false,
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="bg-white py-20 sm:py-32 font-sans">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-zinc-400 font-medium text-[14px] mb-4">Simple pricing</p>
          <h2 className="text-[clamp(32px,5vw,60px)] font-bold text-black tracking-tighter leading-tight mb-6">
            Choose your plan
          </h2>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-zinc-100 rounded-full p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${
                !annual ? 'bg-white text-black shadow-sm' : 'text-zinc-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all flex items-center gap-2 ${
                annual ? 'bg-white text-black shadow-sm' : 'text-zinc-500'
              }`}
            >
              Annual
              <span className="text-[11px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                −20%
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const price = plan.price === '$0' ? plan.price : (
              annual
                ? `$${Math.round(parseInt(plan.price.slice(1)) * 0.8)}`
                : plan.price
            );

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-[24px] p-7 overflow-hidden ${
                  plan.dark
                    ? 'bg-black text-white border border-zinc-800'
                    : 'bg-[#f9f9f9] text-black border border-zinc-200'
                } ${plan.highlight ? 'ring-2 ring-black ring-offset-0 shadow-2xl' : ''}`}
              >
                {plan.highlight && (
                  <div className="absolute top-4 right-4 px-2.5 py-1 bg-white text-black text-[10px] font-black rounded-full tracking-widest uppercase">
                    Most popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className={`font-bold text-[14px] mb-3 ${plan.dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-[44px] font-black tracking-tighter leading-none">{price}</span>
                    {plan.period && (
                      <span className={`text-[14px] font-medium ${plan.dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className={`text-[13px] leading-relaxed ${plan.dark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                    {plan.desc}
                  </p>
                </div>

                {/* Feature list */}
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[13px]">
                      <svg className={`w-4 h-4 flex-shrink-0 ${plan.dark ? 'text-white/40' : 'text-zinc-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={plan.dark ? 'text-zinc-400' : 'text-zinc-600'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block text-center py-3 rounded-full text-[14px] font-bold transition-all ${
                    plan.dark
                      ? 'bg-white text-black hover:bg-zinc-100'
                      : 'bg-black text-white hover:bg-zinc-800'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Enterprise note */}
        <div className="mt-10 text-center">
          <p className="text-zinc-500 text-[14px]">
            Need more?{' '}
            <Link href="#" className="text-black font-semibold underline underline-offset-2 hover:text-zinc-600">
              Contact us for Enterprise plans
            </Link>
            {' '}— dedicated support, SSO, and admin features.
          </p>
        </div>
      </div>
    </section>
  );
}
