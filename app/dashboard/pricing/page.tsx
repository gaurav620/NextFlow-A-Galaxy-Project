'use client';

import { Check, Zap, Plus } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'For individuals getting started.',
    features: [
      '100 free credits per day',
      'Access to free models',
      'Node editor',
      'Basic assets manager',
    ],
    cta: 'Current plan',
    disabled: true,
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$24',
    period: '/month',
    description: 'For creators who need more power.',
    features: [
      '3,000 credits per month',
      'Access to all 64+ models',
      'Lora fine-tuning',
      'Upscale to 4K',
      'Priority generation speed',
      'No throttling',
    ],
    cta: 'Upgrade to Pro',
    disabled: false,
    highlight: true,
  },
  {
    name: 'Max',
    price: '$79',
    period: '/month',
    description: 'For professionals and teams.',
    features: [
      '15,000 credits per month',
      'Everything in Pro',
      'Upscale to 22K',
      'API access',
      'Team workspaces',
      'Priority support',
    ],
    cta: 'Upgrade to Max',
    disabled: false,
    highlight: false,
  },
];

const computePacks = [
  { credits: 1000, price: '$10', per: '$0.01 per credit' },
  { credits: 5000, price: '$40', per: '$0.008 per credit', popular: true },
  { credits: 15000, price: '$100', per: '$0.0067 per credit' },
];

export default function PricingPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#09090b] [&::-webkit-scrollbar]:hidden">
      <div className="max-w-[900px] mx-auto px-6 py-10 space-y-14">

        {/* Plans */}
        <div>
          <h1 className="text-[24px] font-bold text-white text-center mb-2">Simple, transparent pricing</h1>
          <p className="text-[14px] text-zinc-500 text-center mb-8">Start for free. Upgrade when you need more.</p>

          <div className="grid grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 border flex flex-col gap-5 relative ${
                  plan.highlight
                    ? 'border-white/20 bg-gradient-to-b from-zinc-800/60 to-zinc-900/60'
                    : 'border-white/[0.06] bg-[#111]'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-3 py-0.5 rounded-full">
                    POPULAR
                  </div>
                )}
                <div>
                  <p className="text-[13px] font-semibold text-zinc-400 mb-1">{plan.name}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-[36px] font-black text-white leading-none">{plan.price}</span>
                    <span className="text-[13px] text-zinc-500 mb-1">{plan.period}</span>
                  </div>
                  <p className="text-[12px] text-zinc-500 mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[12px] text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={plan.disabled}
                  className={`w-full py-2.5 rounded-xl text-[13px] font-semibold transition-colors ${
                    plan.disabled
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : plan.highlight
                      ? 'bg-white text-black hover:bg-zinc-100'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Compute Packs */}
        <div id="compute-packs">
          <h2 className="text-[20px] font-bold text-white mb-2">Compute Packs</h2>
          <p className="text-[13px] text-zinc-500 mb-6">Buy one-time credits that never expire. Use them anytime.</p>

          <div className="grid grid-cols-3 gap-4">
            {computePacks.map((pack) => (
              <div
                key={pack.credits}
                className={`rounded-2xl p-6 border flex flex-col gap-4 relative ${
                  pack.popular ? 'border-blue-500/30 bg-blue-500/5' : 'border-white/[0.06] bg-[#111]'
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
                    BEST VALUE
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-[20px] font-black text-white">{pack.credits.toLocaleString()}</span>
                  <span className="text-[12px] text-zinc-500">credits</span>
                </div>
                <div>
                  <p className="text-[28px] font-black text-white leading-none">{pack.price}</p>
                  <p className="text-[11px] text-zinc-500 mt-1">{pack.per}</p>
                </div>
                <button className="w-full py-2 rounded-xl bg-white text-black text-[12px] font-semibold hover:bg-zinc-100 transition-colors flex items-center justify-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Buy Pack
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
