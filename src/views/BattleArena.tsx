/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Timer, 
  Zap, 
  Crown, 
  Sword,
  Target,
  Gift,
  Award,
  Lock,
  Medal,
  Star,
  Flame,
  Zap as ZapIcon,
  Trees
} from 'lucide-react';
import { AppState, DepartmentId } from '../types';
import { DEPT_LIST, DEPT_ICONS, COLORS } from '../constants';
import { calculateSavings, getBestDept, getWorstDept, hasGridData } from '../utils';

interface BattleProps {
  state: AppState;
}

export const BattleArenaView: React.FC<BattleProps> = ({ state }) => {
  const sortedDepts = [...DEPT_LIST].sort((a, b) => {
    const savingsA = calculateSavings(state.departments[a].kwh, state.departments[a].lastMonth);
    const savingsB = calculateSavings(state.departments[b].kwh, state.departments[b].lastMonth);
    return savingsB - savingsA;
  });

  const bestDeptId = getBestDept(state.departments);
  const dataSync = hasGridData(state);
  
  const userDept = state.currentUser.dept as DepartmentId;
  const userDeptData = userDept ? state.departments[userDept] : null;
  const userSavings = userDeptData ? calculateSavings(userDeptData.kwh, userDeptData.lastMonth) : 0;
  const userKwhSaved = userDeptData ? Math.max(0, userDeptData.lastMonth - userDeptData.kwh) : 0;

  // Prize Milestones
  const prizes = [
    {
      id: 'weekly',
      type: 'Weekly Milestone',
      prize: '🎫 ₹500 Canteen Vouchers',
      desc: 'For entire winning department. Resets every Monday.',
      badge: 'Week Champion',
      target: 50, // kWh saved target
      current: userKwhSaved,
      unit: 'kWh',
      locked: userKwhSaved < 50,
      glow: 'cyan'
    },
    {
      id: 'monthly',
      type: 'Monthly Milestone',
      prize: '💰 ₹5,000 Department Fund',
      desc: 'Highest savings % wins. Resets every 1st.',
      badge: 'Month Warrior',
      target: 20, // 20% savings target
      current: userSavings,
      unit: '%',
      locked: userSavings < 20,
      glow: 'green'
    },
    {
      id: 'semester_1',
      type: 'Semester Grand Prize (1st)',
      prize: '✈️ College Trip + 💵 ₹1,00,000 Fund',
      desc: '🏆 Rolling Trophy + 🎖️ Plaque + 📰 Newsletter Feature.',
      badge: 'Semester Legend',
      target: 1, // Be the #1 department
      current: bestDeptId === userDept ? 1 : 0,
      unit: 'Rank',
      locked: bestDeptId !== userDept,
      glow: 'orange'
    },
    {
      id: 'semester_2',
      type: 'Semester Runner Up (2nd)',
      prize: '💵 ₹50,000 Dept Fund + 🎁 Hampers',
      desc: 'Gift hampers for all students in department.',
      badge: 'Silver Saver',
      target: 1,
      current: sortedDepts[1] === userDept ? 1 : 0,
      unit: 'Rank',
      locked: sortedDepts[1] !== userDept,
      glow: 'cyan'
    },
    {
      id: 'semester_3',
      type: 'Semester Third (3rd)',
      prize: '💵 ₹25,000 Dept Fund + 📜 Certificates',
      desc: 'Certificates for all students in department.',
      badge: 'Bronze Guardian',
      target: 1,
      current: sortedDepts[2] === userDept ? 1 : 0,
      unit: 'Rank',
      locked: sortedDepts[2] !== userDept,
      glow: 'yellow'
    }
  ];

  const heroPrizes = [
    { icon: <Target className="text-pink-400" />, label: 'Top Waste Reporter', val: '₹500 Amazon', goal: 'Report 10 energy leaks', progress: 0 },
    { icon: <Flame className="text-orange-500" />, label: 'Longest Streak', val: 'Free Meals 1wk', goal: '14 Day Streak', progress: userDeptData?.streak || 0 },
    { icon: <ZapIcon className="text-yellow-400" />, label: 'Most Challenges', val: '₹300 Books', goal: 'Complete 5 Challenges', progress: 0 }
  ];

  const specialBadges = [
    { icon: <Star className="text-yellow-400" />, label: 'Eco Legend', val: '₹2,000 Bonus', goal: 'Save more than 20%', achieved: userSavings >= 20, type: 'savings', target: 20, current: userSavings },
    { icon: <ZapIcon className="text-cyan-400" />, label: 'Energy Saver', val: 'Badge', goal: 'Save more than 5%', achieved: userSavings >= 5, type: 'savings', target: 5, current: userSavings },
    { icon: <Flame className="text-red-500" />, label: 'Eternal Flame', val: 'WiFi Upgrade', goal: '30 day streak', achieved: (userDeptData?.streak || 0) >= 30, type: 'streak', target: 30, current: userDeptData?.streak || 0 },
    { icon: <Trees className="text-green-500" />, label: 'Green Guardian', val: 'Campus Tree', goal: '10 Trees Earned', achieved: state.globalStats.totalKwh >= 100, type: 'trees', target: 10, current: state.globalStats.treesPlanted }
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">
            Battle Arena
          </h2>
          <p className="text-cyan-400 text-[10px] tracking-widest uppercase">Direct Department Confrontation</p>
        </div>
        <div className="flex bg-white/5 border border-white/5 p-1 rounded-lg">
           <div className="px-4 py-2 flex items-center gap-2">
              <Timer className="text-orange-500" size={14} />
              <div className="text-[10px] font-mono font-bold text-white uppercase tracking-tighter">
                 Weekly Reset: 02d 14h 05m
              </div>
           </div>
        </div>
      </div>

      {!dataSync ? (
        <div className="glass rounded-xl h-[50vh] border border-dashed border-[#262626] flex flex-col items-center justify-center text-center bg-[#07070a] relative overflow-hidden">
           <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <Sword size={200} className="text-gray-500" />
           </div>
           <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                 <Sword className="text-gray-600 animate-pulse" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">Arena Lockdown Active</h3>
              <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] max-w-xs mx-auto mb-6">
                 Combat nodes are awaiting grid telemetry. Synchronization is required to initialize department confrontation.
              </p>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Racing Bars */}
           <div className="glass rounded-xl border-[#262626] bg-[#0a0a0a] p-6">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Efficiency Sprint</h3>
                 <Zap className="text-cyan-400 w-4 h-4" />
              </div>
              <div className="space-y-6">
                {sortedDepts.map((id, index) => {
                  const dept = state.departments[id];
                  const savings = calculateSavings(dept.kwh, dept.lastMonth);
                  const color = COLORS[id];
                  return (
                    <div key={id} className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-gray-400">
                         <div className="flex items-center gap-2">
                            <span>#{index+1}</span>
                            <span>{DEPT_ICONS[id]} {id}</span>
                         </div>
                         <span style={{ color }}>{savings.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(5, Math.min(100, savings * 4))}%` }}
                          className="h-full rounded-full"
                          style={{ background: color, boxShadow: `0 0 10px ${color}40` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
           </div>

           {/* Current Standings / Podium */}
           <div className="glass rounded-xl border-[#262626] bg-[#0a0a0a] p-6 flex flex-col justify-between">
              <div>
                 <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-10">Semester Standings</h3>
                 <div className="flex items-end justify-center gap-4 h-48 mb-8">
                    {/* 2nd */}
                    <div className="flex flex-col items-center">
                       <div className="text-xl mb-2">{DEPT_ICONS[sortedDepts[1]]}</div>
                       <motion.div 
                        initial={{ height: 0 }} animate={{ height: 60 }}
                        className="w-12 bg-gray-600/30 border-t-2 border-gray-400 rounded-t-lg flex items-center justify-center text-xs font-bold text-gray-400"
                       >2nd</motion.div>
                       <p className="text-[8px] font-black mt-2 text-gray-500">{sortedDepts[1]}</p>
                    </div>
                    {/* 1st */}
                    <div className="flex flex-col items-center">
                       <Crown className="text-yellow-500 mb-2 animate-bounce" size={24} />
                       <div className="text-xl mb-2">{DEPT_ICONS[sortedDepts[0]]}</div>
                       <motion.div 
                        initial={{ height: 0 }} animate={{ height: 100 }}
                        className="w-16 bg-yellow-500/20 border-t-2 border-yellow-500 rounded-t-lg flex items-center justify-center text-xs font-bold text-yellow-500"
                       >1st</motion.div>
                       <p className="text-[10px] font-black mt-2 text-white">{sortedDepts[0]}</p>
                    </div>
                    {/* 3rd */}
                    <div className="flex flex-col items-center">
                       <div className="text-xl mb-2">{DEPT_ICONS[sortedDepts[2]]}</div>
                       <motion.div 
                        initial={{ height: 0 }} animate={{ height: 40 }}
                        className="w-12 bg-orange-900/30 border-t-2 border-orange-700 rounded-t-lg flex items-center justify-center text-xs font-bold text-orange-700"
                       >3rd</motion.div>
                       <p className="text-[8px] font-black mt-2 text-gray-500">{sortedDepts[2]}</p>
                    </div>
                 </div>
              </div>

              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex items-center gap-4">
                 <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center">
                    <Trophy className="text-yellow-500" size={20} />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Season Champion Reward</h4>
                    <p className="text-[10px] text-gray-500 font-mono">₹25,000 + College Trip + Trophy</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Main Prize Showcase */}
      <div className="space-y-4 mt-8">
         <div className="flex items-center gap-4 ml-1">
            <Gift className="text-orange-500" size={18} />
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Loot Table & Milestones</h3>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {prizes.map(p => (
              <DetailedPrizeCard key={p.id} {...p} />
            ))}
         </div>
      </div>

      {/* Individual Hero & Special Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
         <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Individual Hero Prizes</h3>
            <div className="space-y-3">
               {heroPrizes.map(h => (
                 <HeroRow key={h.label} {...h} />
               ))}
            </div>
         </div>

         <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Special Milestone Badges</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
               {specialBadges.map(s => (
                 <BadgeBox key={s.label} {...s} />
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

const DetailedPrizeCard = ({ id, type, prize, desc, badge, target, current, unit, locked, glow }: any) => {
  const progress = Math.min(100, (current / target) * 100);
  const remaining = Math.max(0, target - current);

  return (
    <div className={`glass relative p-6 rounded-xl border flex flex-col gap-4 overflow-hidden group transition-all duration-500 ${locked ? 'opacity-40 grayscale' : 'animate-shimmer-gold gold-glow scale-[1.02]'}`}>
      <div className="flex justify-between items-start">
         <div className="space-y-1">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{type}</p>
            <h4 className="text-sm font-bold text-white uppercase">{prize}</h4>
         </div>
         <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            {locked ? <Lock size={16} className="text-gray-600" /> : <Medal size={20} className="text-yellow-500" />}
         </div>
      </div>

      <p className="text-[10px] text-gray-400 leading-relaxed italic">{desc}</p>

      <div className="space-y-2 flex-1 flex flex-col justify-end">
         <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
            <span className={locked ? 'text-gray-500' : 'text-yellow-500'}>
               {locked ? `Progress: ${current.toFixed(1)}${unit}` : 'Milestone Achieved'}
            </span>
            <span className="text-gray-600">{target}{unit} Target</span>
         </div>
         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               className={`h-full ${locked ? 'bg-gray-700' : 'bg-yellow-500'}`}
            />
         </div>
         {locked && (
            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter mt-1">
               {typeof target === 'number' && unit !== 'Rank' ? (
                  `${remaining.toFixed(1)} ${unit} more to unlock this reward`
               ) : 'Win your sector to unlock'}
            </p>
         )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Award size={12} className={locked ? 'text-gray-700' : 'text-yellow-500'} />
            <span className={`text-[9px] font-black uppercase tracking-widest ${locked ? 'text-gray-700' : 'text-white'}`}>
               Badge: {badge}
            </span>
         </div>
         {!locked && <span className="text-xs">🏅</span>}
      </div>
    </div>
  );
};

const HeroRow = ({ icon, label, val, goal, progress }: any) => {
   const target = parseInt(goal.match(/\d+/) || '1');
   const pCent = Math.min(100, (progress / target) * 100);

   return (
      <div className="glass p-4 rounded-xl border border-white/5 bg-[#0a0a0a] flex items-center gap-4 group hover:bg-white/5 transition-all">
         <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
            {icon}
         </div>
         <div className="flex-1 space-y-1">
            <div className="flex justify-between">
               <p className="text-[10px] font-bold text-white uppercase">{label}</p>
               <p className="text-[10px] font-black text-cyan-400">{val}</p>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${pCent}%` }} className="h-full bg-cyan-500" />
            </div>
            <p className="text-[8px] text-gray-600 uppercase font-black">{goal}</p>
         </div>
      </div>
   );
};

const BadgeBox = ({ icon, label, achieved, goal, target, current, type }: any) => {
   const remaining = Math.max(0, target - current);
   let lockMsg = '';
   if (!achieved) {
      if (type === 'savings') lockMsg = `🔒 Save ${remaining.toFixed(1)}% more to unlock`;
      if (type === 'streak') lockMsg = `🔒 Maintain streak ${remaining} more days`;
      if (type === 'trees') lockMsg = `🔒 Earn ${remaining} more trees`;
   }

   return (
      <div className={`glass p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all min-h-[110px] justify-between ${achieved ? 'gold-glow bg-yellow-500/5' : 'border-white/5 grayscale opacity-50'}`}>
         <div className="flex flex-col items-center gap-2">
            <div className="text-2xl">{icon}</div>
            <p className="text-[9px] font-bold text-white uppercase leading-none">{label}</p>
         </div>
         <div className="space-y-1">
            <p className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">{achieved ? goal : lockMsg}</p>
            {achieved && <Medal className="text-yellow-500 mx-auto" size={10} />}
         </div>
      </div>
   );
};
