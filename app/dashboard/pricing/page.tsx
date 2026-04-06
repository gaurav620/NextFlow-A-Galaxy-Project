'use client';

import { useState } from 'react';
import { Check, Zap, Plus, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const plans = [
  {
    name: 'Free',
    priceMonthly: 0,
    priceAnnual: 0,
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
    priceMonthly: 24,
    priceAnnual: 19,
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
    priceMonthly: 79,
    priceAnnual: 63,
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

const faqItems = [
  {
    q: 'What are credits?',
    a: 'Credits are the currency used to generate images, videos, and other content on NextFlow. Different tools and models consume different amounts of credits per generation.',
  },
  {
    q: 'Do unused credits roll over?',
    a: 'Free daily credits reset each day and do not roll over. Credits from compute packs never expire and can be used anytime.',
  },
  {
    q: 'Can I cancel my subscription?',
    a: 'Yes, you can cancel anytime from your Settings page. Your plan remains active until the end of the billing period.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards through our payment processor Razorpay, including Visa, Mastercard, and UPI.',
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'All users start with a free plan that includes 100 credits per day. You can explore the platform before upgrading.',
  },
  {
    q: 'What happens if I run out of credits?',
    a: 'Free users can wait for their daily allowance to reset. You can also purchase one-time compute packs that never expire.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.06] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-[14px] text-zinc-200 font-medium group-hover:text-white transition-colors pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-zinc-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-[13px] text-zinc-500 leading-relaxed pb-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const loadRazorpay = async () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (amount: number, name: string) => {
    if (isNaN(amount) || amount <= 0) return;
    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SZwdjVacEhnkjd",
      amount: amount * 100,
      currency: "USD",
      name: "NextFlow AI",
      description: name,
      image: "https://v0-next-flow-landing-page.vercel.app/favicon.ico",
      handler: function (response: any) {
        toast.success("Payment successful! ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "NextFlow User",
      },
      theme: {
        color: "#111111",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#09090b] [&::-webkit-scrollbar]:hidden">
      <div className="max-w-[900px] mx-auto px-6 py-10 space-y-14">

        {/* Plans */}
        <div>
          <h1 className="text-[24px] font-bold text-white text-center mb-2">Simple, transparent pricing</h1>
          <p className="text-[14px] text-zinc-500 text-center mb-6">Start for free. Upgrade when you need more.</p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8 gap-1">
            <div className="flex items-center bg-[#111] border border-white/[0.06] rounded-full p-1">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all ${
                  billingPeriod === 'annual'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Annual
              </button>
            </div>
            {billingPeriod === 'annual' && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[12px] text-emerald-400 font-semibold ml-2"
              >
                Save 20%
              </motion.span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const price = billingPeriod === 'monthly' ? plan.priceMonthly : plan.priceAnnual;
              return (
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
                      <span className="text-[36px] font-black text-white leading-none">${price}</span>
                      <span className="text-[13px] text-zinc-500 mb-1">/{billingPeriod === 'monthly' ? 'mo' : 'mo, billed annually'}</span>
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
                    onClick={() => handlePayment(price, `${plan.name} Plan (${billingPeriod})`)}
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
              );
            })}
          </div>
        </div>

        {/* Compute Packs */}
        <div id="compute-packs">
          <h2 className="text-[20px] font-bold text-white mb-2">Compute Packs</h2>
          <p className="text-[13px] text-zinc-500 mb-6">Buy one-time credits that never expire. Use them anytime.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <button
                  onClick={() => handlePayment(parseInt(pack.price.replace('$', '')), `${pack.credits} Credits Pack`)}
                  className="w-full py-2 rounded-xl bg-white text-black text-[12px] font-semibold hover:bg-zinc-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Buy Pack
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-[20px] font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-6">
            {faqItems.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
