'use client';

import Link from 'next/link';
import { useState } from 'react';
import Script from 'next/script';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function Pricing() {
    const [loadingPack, setLoadingPack] = useState<string | null>(null);

    const handlePayment = async (amount: number, packName: string) => {
        setLoadingPack(packName);
        try {
            const response = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, packName })
            });
            const data = await response.json();
            
            if (!data.success) {
                toast.error(data.error || 'Failed to create order');
                setLoadingPack(null);
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'NextFlow',
                description: `Purchase ${packName}`,
                order_id: data.order.id,
                theme: { color: '#000000' },
                handler: function (response: any) {
                    toast.success(`${packName} purchased successfully!`);
                    console.log('Payment success', response);
                },
                modal: {
                    ondismiss: function () {
                        setLoadingPack(null);
                    }
                }
            };
            
            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                toast.error('Payment failed: ' + response.error.description);
            });
            rzp.open();

        } catch (error) {
            toast.error('Payment initialization failed');
            setLoadingPack(null);
        }
    };

    return (
        <section className="bg-black pt-32 pb-40 px-6 font-sans">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <div className="max-w-[1400px] mx-auto text-center">
                <h2 className="text-[clamp(36px,5vw,64px)] font-bold tracking-tight leading-[1.05] text-white max-w-4xl mx-auto mb-20 text-balance">
                    Trusted by over 30,000,000 users. From 191 countries. We've got a plan for everybody.
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Basic Pack */}
                    <div className="bg-[#111] border border-zinc-800 rounded-3xl p-8 text-left flex flex-col hover:border-zinc-700 transition-colors">
                        <div className="mb-2">
                            <span className="inline-block px-3 py-1 bg-white/10 text-white text-xs font-bold rounded hover:bg-white/20 transition-colors">RECHARGE</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 mt-4">Basic Pack</h3>
                        <div className="flex items-end gap-1 mb-8">
                            <span className="text-[40px] font-black text-white leading-none">US$10</span>
                        </div>
                        <button 
                            disabled={loadingPack === 'Basic Pack'}
                            onClick={() => handlePayment(10, 'Basic Pack')}
                            className="w-full flex justify-center items-center py-3.5 bg-zinc-800 text-white font-semibold text-center rounded-xl hover:bg-zinc-700 transition disabled:opacity-50"
                        >
                            {loadingPack === 'Basic Pack' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buy now'}
                        </button>
                        <p className="text-sm text-zinc-300 font-bold mt-6">+ 20,000 compute units</p>
                        <p className="text-xs text-zinc-500 font-medium mt-1">Never expires</p>
                    </div>
                    {/* Creator Pack */}
                    <div className="bg-[#111] border border-zinc-800 rounded-3xl p-8 text-left flex flex-col hover:border-zinc-700 transition-colors">
                        <div className="mb-2">
                            <span className="inline-block px-3 py-1 bg-white/10 text-white text-xs font-bold rounded hover:bg-white/20 transition-colors">RECHARGE</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 mt-4">Creator Pack</h3>
                        <div className="flex items-end gap-1 mb-8">
                            <span className="text-[40px] font-black text-white leading-none">US$25</span>
                        </div>
                        <button 
                            disabled={loadingPack === 'Creator Pack'}
                            onClick={() => handlePayment(25, 'Creator Pack')}
                            className="w-full flex justify-center items-center py-3.5 bg-zinc-800 text-white font-semibold text-center rounded-xl hover:bg-zinc-700 transition disabled:opacity-50"
                        >
                            {loadingPack === 'Creator Pack' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buy now'}
                        </button>
                        <p className="text-sm text-zinc-300 font-bold mt-6">+ 60,000 compute units</p>
                        <p className="text-xs text-zinc-500 font-medium mt-1">Never expires</p>
                    </div>
                    {/* Pro Pack */}
                    <div className="bg-[#111] border border-zinc-700 rounded-3xl p-8 text-left flex flex-col relative transform md:-translate-y-4 hover:border-zinc-500 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">MOST POPULAR</div>
                        <div className="mb-2">
                            <span className="inline-block px-3 py-1 bg-white/10 text-white text-xs font-bold rounded hover:bg-white/20 transition-colors">RECHARGE</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 mt-4">Pro Pack</h3>
                        <div className="flex items-end gap-1 mb-8">
                            <span className="text-[40px] font-black text-white leading-none">US$70</span>
                        </div>
                        <button 
                            disabled={loadingPack === 'Pro Pack'}
                            onClick={() => handlePayment(70, 'Pro Pack')}
                            className="w-full flex justify-center items-center py-3.5 bg-white text-black font-semibold text-center rounded-xl hover:bg-zinc-200 transition disabled:opacity-50"
                        >
                            {loadingPack === 'Pro Pack' ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : 'Buy now'}
                        </button>
                        <p className="text-sm text-zinc-300 font-bold mt-6">+ 200,000 compute units</p>
                        <p className="text-xs text-zinc-500 font-medium mt-1">Never expires</p>
                    </div>
                    {/* Studio Pack */}
                    <div className="bg-[#111] border border-zinc-800 rounded-3xl p-8 text-left flex flex-col hover:border-zinc-700 transition-colors">
                        <div className="mb-2">
                            <span className="inline-block px-3 py-1 bg-[#FFBD2E]/20 text-[#FFBD2E] text-xs font-bold rounded hover:bg-[#FFBD2E]/30 transition-colors">HIGH VOLUME</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 mt-4">Studio Pack</h3>
                        <div className="flex items-end gap-1 mb-8">
                            <span className="text-[40px] font-black text-white leading-none">US$180</span>
                        </div>
                        <button 
                            disabled={loadingPack === 'Studio Pack'}
                            onClick={() => handlePayment(180, 'Studio Pack')}
                            className="w-full flex justify-center items-center py-3.5 bg-zinc-800 text-white font-semibold text-center rounded-xl hover:bg-zinc-700 transition disabled:opacity-50"
                        >
                            {loadingPack === 'Studio Pack' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buy now'}
                        </button>
                        <p className="text-sm text-zinc-300 font-bold mt-6">+ 600,000 compute units</p>
                        <p className="text-xs text-zinc-500 font-medium mt-1">Never expires</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
