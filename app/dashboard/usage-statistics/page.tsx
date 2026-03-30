'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const dailyData = [
  { day: 'Mon', generations: 12, credits: 45 },
  { day: 'Tue', generations: 8, credits: 32 },
  { day: 'Wed', generations: 23, credits: 89 },
  { day: 'Thu', generations: 5, credits: 18 },
  { day: 'Fri', generations: 17, credits: 64 },
  { day: 'Sat', generations: 31, credits: 112 },
  { day: 'Sun', generations: 4, credits: 14 },
];

const toolUsage = [
  { tool: 'Image', count: 48, color: '#4B9FFF' },
  { tool: 'Video', count: 12, color: '#FF8A4B' },
  { tool: 'Enhancer', count: 21, color: '#9CA3AF' },
  { tool: 'Nano Banana', count: 7, color: '#FFD93D' },
  { tool: 'Realtime', count: 9, color: '#A78BFA' },
  { tool: 'Edit', count: 3, color: '#A78BFA' },
];

export default function UsageStatisticsPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#09090b] [&::-webkit-scrollbar]:hidden">
      <div className="max-w-[860px] mx-auto px-6 py-8 space-y-8">

        <div>
          <h1 className="text-[20px] font-semibold text-white">Usage Statistics</h1>
          <p className="text-[13px] text-zinc-500 mt-1">Track your generations and credit usage over time.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Generations', value: '100', sub: 'This week' },
            { label: 'Credits Used', value: '374', sub: 'This week' },
            { label: 'Credits Remaining', value: '17', sub: 'Daily allowance' },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
              <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mb-2">{stat.sub}</p>
              <p className="text-[36px] font-black text-white leading-none">{stat.value}</p>
              <p className="text-[12px] text-zinc-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Daily chart */}
        <div className="bg-[#111] border border-white/[0.06] rounded-xl p-6">
          <p className="text-[14px] font-semibold text-white mb-5">Generations per day</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#fff' }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey="generations" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tool breakdown */}
        <div className="bg-[#111] border border-white/[0.06] rounded-xl p-6">
          <p className="text-[14px] font-semibold text-white mb-5">Usage by tool</p>
          <div className="space-y-3">
            {toolUsage.map((t) => (
              <div key={t.tool} className="flex items-center gap-4">
                <div className="w-[80px] text-[12px] text-zinc-400 flex-shrink-0">{t.tool}</div>
                <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(t.count / 48) * 100}%`, background: t.color }}
                  />
                </div>
                <div className="w-[32px] text-[12px] text-zinc-400 text-right">{t.count}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
