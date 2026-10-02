import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Sparkles,
  TrendingUp,
  Shield,
  Wifi,
  Battery,
  Star,
  Tv,
  Lightbulb,
  Heart,
  Clock,
  Palette,
  Zap,
} from 'lucide-react';

export const BentoGridShowcase: React.FC = () => {
  const [bentoTheme, setBentoTheme] = useState<'pastel' | 'dark'>('pastel');
  const [activeDay, setActiveDay] = useState<number>(4); // Friday active

  const pillDays = [
    { day: 'Mon', height: '40%' },
    { day: 'Tue', height: '55%' },
    { day: 'Wed', height: '50%' },
    { day: 'Thu', height: '65%' },
    { day: 'Fri', height: '95%', active: true },
    { day: 'Sat', height: '60%' },
    { day: 'Sun', height: '55%' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Mode Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-[#0B0B0B] border border-white/10 shadow-2xl">
          <button
            onClick={() => setBentoTheme('pastel')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              bentoTheme === 'pastel'
                ? 'bg-gradient-to-r from-[#F8DFE2] via-[#D9CEFF] to-[#F5FF91] text-[#171717] shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Pastel Version (Images 2–3)</span>
          </button>

          <button
            onClick={() => setBentoTheme('dark')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              bentoTheme === 'dark'
                ? 'bg-[#7456E8] text-white shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Dark Version (Image 1)</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* =========================================================================
            1. PASTEL VERSION (Images 2 & 3 Exact Recreation)
           ========================================================================= */}
        {bentoTheme === 'pastel' && (
          <motion.div
            key="pastel-bento"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-[10px] text-[#171717]"
          >
            {/* 1. Left Vertical Card (First Round of Funding - Soft Blush #F8DFE2) */}
            <div className="md:col-span-1 rounded-[22px] bg-[#F8DFE2] p-6 flex flex-col justify-between shadow-lg min-h-[270px]">
              <div>
                <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider block">
                  First Round of funding
                </span>

                {/* Circular Progress Ring 75% */}
                <div className="relative w-20 h-20 mx-auto my-4 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-pink-200"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#FF9B9B]"
                      strokeDasharray="75, 100"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-sm font-black text-[#171717]">75%</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-black text-[#171717] tracking-tight">2.5K</div>
                <span className="text-[10px] text-zinc-600 font-medium">263 Contributions in the last year</span>
              </div>
            </div>

            {/* 2. Top-Center Left (Mint Green #5CA481 Card) */}
            <div className="md:col-span-1 rounded-[22px] bg-[#5CA481] text-white p-6 flex flex-col justify-between shadow-lg min-h-[190px]">
              <div className="flex justify-between items-start">
                <div className="text-4xl font-black tracking-tight text-white">4.875</div>
                <Heart className="w-4 h-4 fill-white text-white" />
              </div>
              <div>
                <span className="text-xs font-bold text-white/90 block">Project Views</span>
                <span className="text-[10px] text-white/70">last year</span>
              </div>
            </div>

            {/* 3. Top-Center Right (Off-White #F8F5F0 New Users Card) */}
            <div className="md:col-span-1 rounded-[22px] bg-[#F8F5F0] text-[#171717] p-6 flex flex-col justify-between shadow-lg min-h-[190px]">
              <span className="text-[11px] font-bold text-zinc-500 block">New Users</span>
              <div className="my-auto">
                <div className="text-4xl font-black tracking-tight text-[#171717]">57K</div>
                <span className="text-xs font-bold text-[#58C875]">+10%</span>
              </div>
              <span className="text-[10px] text-zinc-500">Verified identity accounts</span>
            </div>

            {/* 4. Top-Right (Pale Yellow #F5FF91 Passionate Team Card) */}
            <div className="md:col-span-1 rounded-[22px] bg-[#F5FF91] text-[#171717] p-6 flex flex-col justify-between shadow-lg min-h-[190px]">
              <div>
                <span className="text-sm font-black leading-snug block">
                  Team of passionate designers and developers
                </span>
              </div>

              <div className="flex items-center mt-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                  alt="Avatar 1"
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#F5FF91] -mr-2 shadow-sm"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                  alt="Avatar 2"
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#F5FF91] -mr-2 shadow-sm"
                />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80"
                  alt="Avatar 3"
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#F5FF91] -mr-2 shadow-sm"
                />
                <div className="w-8 h-8 rounded-full bg-[#171717] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#F5FF91]">
                  +2
                </div>
              </div>
            </div>

            {/* 5. Left Vertical Card 2 (Lavender Agency Card) */}
            <div className="md:col-span-1 rounded-[22px] bg-[#D9CEFF] text-[#171717] p-6 flex flex-col justify-between shadow-lg min-h-[290px]">
              <span className="text-xs font-black block leading-snug">
                Smart Digital Agency For Your Business
              </span>

              <div className="grid grid-cols-2 gap-2 my-2">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80"
                  alt="Agency Member"
                  className="w-full h-20 rounded-xl object-cover border-2 border-white/60 shadow-sm"
                />
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80"
                  alt="Agency Member 2"
                  className="w-full h-20 rounded-xl object-cover border-2 border-white/60 shadow-sm"
                />
              </div>

              <div className="text-[10px] font-bold text-purple-950">
                ⚡ Realtime Operations
              </div>
            </div>

            {/* 6. CENTER FOCAL POINT: Lavender Large Revenue Spline Card (2 Cols) */}
            <div className="md:col-span-2 rounded-[22px] bg-[#D9CEFF] text-[#171717] p-7 flex flex-col justify-between shadow-lg min-h-[290px] relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-3 py-1 rounded-full bg-purple-200 text-purple-950 text-xs font-bold inline-block mb-1">
                    Complete Revenue This Year
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-[#171717] tracking-tight">4.93%</div>
                  <span className="text-xs font-semibold text-rose-600">-2.3%</span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-[#171717] text-white text-[11px] font-mono font-bold flex items-center gap-1 shadow-md">
                  <Clock className="w-3 h-3 text-[#C8FA27]" />
                  <span>2h 12m</span>
                </div>
              </div>

              <div className="w-full h-28 relative flex items-end">
                <svg viewBox="0 0 200 60" className="w-full h-full stroke-[#8D7AFF] fill-none stroke-[3]">
                  <path d="M0,50 Q40,55 70,35 T130,20 T180,45 T200,30" />
                </svg>
                <div className="absolute left-[35%] top-[55%] w-3 h-3 rounded-full bg-[#8D7AFF] border-2 border-white shadow-lg animate-ping" />
                <div className="absolute left-[35%] top-[55%] w-3 h-3 rounded-full bg-[#8D7AFF] border-2 border-white shadow-lg" />
              </div>

              <div className="flex justify-between text-[10px] font-bold text-purple-950 pt-2 border-t border-purple-300">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
              </div>
            </div>

            {/* 7. Right Card (Daily New Clients + 3D Chrome Star) */}
            <div className="md:col-span-1 rounded-[22px] bg-[#F8F5F0] text-[#171717] p-6 flex flex-col justify-between shadow-lg min-h-[290px]">
              <div>
                <span className="text-xs font-bold text-zinc-500 block">Daily New clients</span>
                <div className="text-4xl font-black text-[#171717] mt-1">54</div>
                <span className="text-xs font-bold text-[#58C875]">+40%</span>
              </div>

              <div className="my-auto flex items-center justify-center">
                <svg viewBox="0 0 60 60" className="w-14 h-14 animate-spin duration-[30000ms]">
                  <path d="M30,5 L35,25 L55,30 L35,35 L30,55 L25,35 L5,30 L25,25 Z" fill="#171717" />
                  <circle cx="30" cy="30" r="5" fill="#D9CEFF" stroke="#171717" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="text-[10px] text-zinc-500 text-center">Autonomous Onboarding</div>
            </div>

            {/* 8. Bottom Left (CUBO Pink Card #F8DFE2) */}
            <div className="md:col-span-1 rounded-[22px] bg-[#F8DFE2] text-[#171717] p-6 flex flex-col items-center justify-center text-center shadow-lg min-h-[160px]">
              <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-[#171717] fill-none stroke-[2] mb-1">
                <circle cx="20" cy="14" r="9" />
                <circle cx="14" cy="24" r="9" />
                <circle cx="26" cy="24" r="9" />
              </svg>
              <span className="text-sm font-black tracking-widest text-[#171717]">CUBO</span>
            </div>

            {/* 9. Bottom Center (Font Swatch Card #F8F5F0) */}
            <div className="md:col-span-1 rounded-[22px] bg-[#F8F5F0] text-[#171717] p-6 flex flex-col justify-between shadow-lg min-h-[160px]">
              <div>
                <span className="text-xs font-black text-[#171717] block">Font</span>
                <span className="text-[11px] text-zinc-500">Sk-Modernist</span>
              </div>

              <div className="flex gap-2 mt-2">
                <div className="w-6 h-6 rounded-lg bg-[#F8DFE2] border border-black/10" />
                <div className="w-6 h-6 rounded-lg bg-[#D9CEFF]" />
                <div className="w-6 h-6 rounded-lg bg-[#5CA481]" />
                <div className="w-6 h-6 rounded-lg bg-[#F5FF91]" />
              </div>
            </div>

            {/* 10. Bottom Right (Mint Green #5CA481 Concentric Rings Card - 2 Cols) */}
            <div className="md:col-span-2 rounded-[22px] bg-[#5CA481] text-white p-6 flex items-center justify-between shadow-lg min-h-[160px] relative overflow-hidden">
              <div className="max-w-[220px]">
                <h4 className="text-base font-black text-white leading-tight">
                  We Build Future of Design Industry
                </h4>
                <p className="text-[10px] text-white/80 mt-1">Crafting Meaningful UX/UI Design</p>
              </div>

              <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-white/80 fill-none stroke-[1.5]">
                  <ellipse cx="50" cy="50" rx="45" ry="45" />
                  <ellipse cx="50" cy="60" rx="35" ry="30" />
                  <ellipse cx="50" cy="70" rx="25" ry="18" />
                  <ellipse cx="50" cy="78" rx="15" ry="9" />
                </svg>
              </div>
            </div>
          </motion.div>
        )}

        {/* =========================================================================
            2. DARK VERSION (Image 1 Exact Recreation)
           ========================================================================= */}
        {bentoTheme === 'dark' && (
          <motion.div
            key="dark-bento"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-[10px] text-[#F5F5F5]"
          >
            {/* 1. Phone Card */}
            <div className="bento-card-dark flex flex-col justify-between min-h-[380px] md:min-h-[420px]">
              <div className="w-full max-w-[250px] mx-auto bg-black rounded-[32px] border-[2px] border-zinc-800 shadow-2xl p-3 relative overflow-hidden">
                <div className="w-16 h-3.5 bg-zinc-900 rounded-full mx-auto mb-2 flex items-center justify-between px-2">
                  <span className="text-[7px] text-zinc-400 font-mono">9:41</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white">Alexandre's Home</span>
                    <div className="w-2 h-2 rounded-full bg-[#7456E8]" />
                  </div>

                  <div className="p-3 rounded-2xl bg-gradient-to-br from-[#473099] to-[#251859] text-white shadow-md">
                    <div className="flex justify-between text-[8px] text-purple-200">
                      <span>Evergreen Terrace</span>
                      <span>10:18 AM</span>
                    </div>
                    <div className="text-xl font-black mt-0.5">-5° C</div>
                    <div className="text-[8px] text-purple-200 mt-0.5">💧 58% • ☀️ 3.2</div>
                  </div>

                  <div className="p-2 rounded-xl bg-zinc-900/90 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-[#7456E8]" />
                    <span className="text-[8px] font-bold text-white">Smart Lamp • 1 Action</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <span className="text-xs font-bold text-white">Mobile Executive Control</span>
                <p className="text-[10px] text-zinc-500">Realtime live feed synced to your cloud ledger</p>
              </div>
            </div>

            {/* 2. Sales Analytics with Pill Bars */}
            <div className="bento-card-dark flex flex-col justify-between min-h-[260px]">
              <div>
                <span className="text-xs font-semibold text-zinc-400 block">Sales Analytics</span>
                <div className="text-4xl sm:text-5xl font-black text-white mt-1 tracking-tight">25,500</div>
                <span className="text-[11px] text-zinc-500">for all time volume</span>
              </div>

              <div className="mt-4 flex items-end justify-between gap-1.5 h-28 pt-2">
                {pillDays.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveDay(idx)}
                    className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer"
                  >
                    <div className="w-full bg-zinc-900 rounded-full h-full flex items-end p-0.5 overflow-hidden">
                      <div
                        className={`w-full rounded-full transition-all duration-300 ${
                          idx === activeDay
                            ? 'bg-[#7456E8] shadow-[0_0_15px_rgba(116,86,232,0.6)]'
                            : 'bg-white hover:bg-zinc-300'
                        }`}
                        style={{ height: item.height }}
                      />
                    </div>
                    <span
                      className={`text-[9px] font-semibold ${
                        idx === activeDay ? 'text-[#E2DCFE] font-bold' : 'text-zinc-500'
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. 3D Geometric Sphere */}
            <div className="bento-card-dark flex flex-col justify-between min-h-[260px] relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                  <Crown className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7456E8]/20 text-[#E2DCFE]">
                  PREMIUM
                </span>
              </div>

              <div className="my-auto flex items-center justify-center py-2">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#7456E8]/20 rounded-full blur-xl" />
                  <svg viewBox="0 0 100 100" className="w-full h-full transform transition-transform duration-700 hover:rotate-45">
                    <defs>
                      <linearGradient id="darkSwirlShowcase1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E2DCFE" />
                        <stop offset="50%" stopColor="#7456E8" />
                        <stop offset="100%" stopColor="#301B74" />
                      </linearGradient>
                      <linearGradient id="darkSwirlShowcase2" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#0F172A" />
                      </linearGradient>
                    </defs>
                    <ellipse cx="50" cy="50" rx="36" ry="18" fill="url(#darkSwirlShowcase1)" transform="rotate(0 50 50)" opacity="0.95" />
                    <ellipse cx="50" cy="50" rx="36" ry="18" fill="url(#darkSwirlShowcase2)" transform="rotate(45 50 50)" opacity="0.9" />
                    <ellipse cx="50" cy="50" rx="36" ry="18" fill="url(#darkSwirlShowcase1)" transform="rotate(90 50 50)" opacity="0.85" />
                    <ellipse cx="50" cy="50" rx="36" ry="18" fill="url(#darkSwirlShowcase2)" transform="rotate(135 50 50)" opacity="0.95" />
                    <circle cx="50" cy="50" r="10" fill="#0B0B0B" stroke="#7456E8" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              <div className="text-center">
                <h4 className="text-xs font-bold text-white">Premium Member Features</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Automated wealth heuristics</p>
              </div>
            </div>

            {/* 4. Google Rating */}
            <div className="bento-card-dark flex flex-col justify-between min-h-[260px]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Google Rating</span>
                  <span className="text-xs font-black text-amber-400">4.8</span>
                </div>
                <div className="flex gap-1 mt-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xs">★</span>
                  ))}
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">Based on 2,400+ reviews</span>
              </div>

              <div className="rounded-2xl bg-zinc-900/80 p-3 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                  alt="Markwood"
                  className="w-10 h-10 rounded-xl object-cover border border-[#7456E8]/40"
                />
                <div>
                  <h5 className="text-xs font-bold text-white">Markwood Sterling</h5>
                  <p className="text-[10px] text-zinc-400">CTO, Devision Capital</p>
                </div>
              </div>
            </div>

            {/* 5. Brand Pill & Split Mini Cards */}
            <div className="bento-card-dark flex flex-col justify-between min-h-[260px] space-y-3">
              <div className="p-3 rounded-2xl bg-zinc-900 flex items-center justify-between">
                <span className="font-extrabold text-xs text-white">Neratech / AURA</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#7456E8]/20 text-[#E2DCFE]">
                  PRO
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 flex-1">
                <div className="p-3 rounded-2xl bg-zinc-900/60 flex flex-col justify-between">
                  <span className="text-lg font-black text-white">100%</span>
                  <span className="text-[10px] text-zinc-400 font-medium">Creativity</span>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-900/60 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-zinc-400">€682.5</span>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#7456E8] text-white">+2.4%</span>
                  </div>
                  <div className="w-full h-8 mt-1">
                    <svg viewBox="0 0 100 30" className="w-full h-full stroke-[#7456E8] fill-none stroke-[2.5]">
                      <path d="M0,25 Q15,5 30,20 T60,10 T90,5 T100,15" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. 55% New Users */}
            <div className="bento-card-dark flex flex-col justify-between min-h-[260px]">
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">55 %</div>
                  <div className="p-2 rounded-xl bg-[#7456E8] text-white">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-xs font-bold text-[#E2DCFE] mt-1 block">New Users Growth</span>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Our smart wealth application will help members to control cash flows, auto-budget, and optimize savings vaults.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
