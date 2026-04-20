/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Ghost,
  Globe,
  Medal,
  Award,
  Target,
  Skull,
  Gift
} from 'lucide-react';
import { AppState, DepartmentId } from '../types';
import { DEPARTMENTS, DEPT_ICONS, DEPT_LIST } from '../constants';
import { calculateSavings, getWorstDept, hasGridData } from '../utils';

interface LeaderboardProps {
  state: AppState;
}

export const LeaderboardView: React.FC<LeaderboardProps> = ({ state }) => {
  const [villainMode, setVillainMode] = useState(false);
  const worstDeptId = getWorstDept(state.departments);
  const hasData = hasGridData(state);

  const sortedDepts = (Object.entries(state.departments) as [DepartmentId, any][])
    .map(([id, data]) => ({
      id,
      name: (DEPARTMENTS as any)[id] || id,
      kwh: data.kwh,
      savings: calculateSavings(data.kwh, data.lastMonth),
      xp: data.xp,
      streak: data.streak
    }))
    .sort((a, b) => {
      if (a.kwh === 0 && b.kwh === 0) return 0;
      if (a.kwh === 0) return 1;
      if (b.kwh === 0) return -1;
      return b.savings - a.savings;
    });

  return (
    <div className="space-y-4 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">
            Grid Rankings
          </h2>
          <p className="text-cyan-400 text-[10px] tracking-widest uppercase">Competitive Efficiency Standings</p>
        </div>
        
        {hasData && (
          <button 
            onClick={() => setVillainMode(!villainMode)}
            className={`flex items-center gap-3 px-4 py-2 border transition-all uppercase tracking-widest text-[9px] font-bold ${
              villainMode ? 'bg-red-950/20 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-white/5 border-[#262626] text-gray-400'
            }`}
          >
            {villainMode ? <Skull size={14} className="animate-bounce" /> : <Ghost size={14} />}
            {villainMode ? 'VILLAIN IDENTIFIED' : 'SCAN FOR VULNERABILITIES'}
          </button>
        )}
      </div>

      {hasData && (
        <div className="space-y-4 mb-8">
           <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Gift size={14} className="text-orange-500" />
              Competition Rewards
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PrizeMiniCard 
                 title="Weekly Sprint" 
                 prize="🎫 ₹500 Canteen Vouchers" 
                 winner={sortedDepts[0].id}
                 shimmer 
              />
              <PrizeMiniCard 
                 title="Monthly Growth" 
                 prize="💰 ₹5,000 Dept Fund" 
                 winner={sortedDepts[0].id}
                 shimmer 
              />
              <PrizeMiniCard 
                 title="Semester Grand" 
                 prize="🏅 ₹10k+ College Trip" 
                 winner={sortedDepts[0].id}
                 shimmer 
              />
           </div>
        </div>
      )}

      {!hasData ? (
        <NoLeaderboardData />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Main List */}
          <div className="xl:col-span-2 glass rounded-xl border-[#262626] bg-[#0a0a0a] flex flex-col">
             <div className="p-4 border-b border-[#262626] flex justify-between items-center bg-[#0d0d0d]">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Current Semester Standings</h3>
                <span className="text-[9px] text-cyan-500 font-mono">SEASON_READY</span>
             </div>
             
             <div className="p-2 space-y-1 flex-1">
                <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[8px] font-black uppercase text-gray-700 tracking-widest border-b border-white/5 mb-2">
                   <div className="col-span-1">RK</div>
                   <div className="col-span-1"></div>
                   <div className="col-span-4">SECTOR</div>
                   <div className="col-span-2">SAVINGS</div>
                   <div className="col-span-2">PRIZE</div>
                   <div className="col-span-2 text-right">STATUS</div>
                </div>

                {sortedDepts.map((d, idx) => {
                  const isVillain = d.id === worstDeptId && villainMode;
                  const isWinner = idx === 0 && d.kwh > 0;
                  const prize = idx === 0 ? '🎫₹500' : idx === 1 ? '🥇Cert' : idx === 2 ? '🥈Cert' : '-';
                  
                  return (
                    <motion.div 
                      key={d.id}
                      layout
                      className={`grid grid-cols-12 gap-2 items-center p-3 rounded border transition-all ${
                        isVillain ? 'bg-red-500/10 border-red-500/30 villain-shake red-glow ring-1 ring-red-500/50' : 
                        isWinner ? 'bg-yellow-500/10 border-yellow-500/30 animate-shimmer-gold gold-glow' : 
                        'bg-white/5 border-white/5'
                      }`}
                    >
                      <div className="col-span-1">
                         <span className={`text-[10px] font-bold font-mono ${isWinner ? 'text-yellow-500' : isVillain ? 'text-red-500' : 'text-gray-600'}`}>
                            {String(idx + 1).padStart(2, '0')}
                         </span>
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                         {isVillain && <Skull size={14} className="text-red-500" />}
                         {isWinner && <Trophy size={14} className="text-yellow-500" />}
                      </div>
                      <div className="col-span-4 flex items-center gap-3">
                         <span className="text-xl grayscale-0">{DEPT_ICONS[d.id]}</span>
                         <div className="flex flex-col">
                            <span className="text-xs font-bold text-white uppercase tracking-tight">{d.id}</span>
                            <span className="text-[8px] text-gray-600 font-black">NODE_0x{idx}AB</span>
                         </div>
                      </div>
                      <div className="col-span-2">
                         <span className={`text-[10px] font-mono font-bold ${d.savings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {d.savings >= 0 ? '▼' : '▲'} {Math.abs(d.savings).toFixed(1)}%
                         </span>
                      </div>
                      <div className="col-span-2">
                         <span className="text-[10px] font-bold text-gray-400">{d.kwh > 0 ? prize : '-'}</span>
                      </div>
                      <div className="col-span-2 text-right">
                         <span className={`text-[8px] px-1.5 py-0.5 rounded border font-black uppercase ${d.xp > 500 ? 'border-cyan-500 text-cyan-400' : 'border-gray-700 text-gray-600'}`}>
                            {d.xp > 500 ? 'MASTER' : 'NODAL'}
                         </span>
                      </div>
                    </motion.div>
                  );
                })}
             </div>

             <div className="p-4 border-t border-[#262626] bg-cyan-900/10 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center">
                   <Target className="text-cyan-400" size={16} />
                </div>
                <div>
                   <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">Grid Insight</p>
                   <p className="text-[10px] text-gray-400 leading-relaxed max-w-lg">
                      Sector {sortedDepts[0].id} is leading. Overtake them by saving an additional 2.4 kWh per node to secure the weekly prize.
                   </p>
                </div>
             </div>
          </div>

          {/* Activity Feed Sidebar */}
          <div className="xl:col-span-1 flex flex-col gap-4">
             <div className="glass rounded-xl p-5 border-[#262626] bg-[#0a0a0a] flex-1 flex flex-col relative overflow-hidden">
                <div className="absolute -top-4 -right-4 opacity-5 rotate-12">
                   <Globe size={180} className="text-white" />
                </div>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Activity Matrix</h3>
                
                <div className="flex-1 space-y-6 relative z-10">
                   <FeedItem icon="🔥" text={`${sortedDepts[0].id} Sector locked 5-day streak`} time="2m ago" />
                   <FeedItem icon="📡" text="Grid Telemetry Synchronized to Node B" time="15m ago" />
                   <FeedItem icon="⚠️" text={`${sortedDepts[sortedDepts.length-1].id} showing power drain`} time="1h ago" />
                   <FeedItem icon="🏆" text="Semester 2 Competition Live" time="3h ago" />
                </div>

                <div className="mt-8 pt-6 border-t border-white/5">
                   <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                      <div className="flex flex-col">
                         <span className="text-[8px] text-gray-500 font-black uppercase">Global Node Rank</span>
                         <span className="text-sm font-mono text-cyan-400 font-bold">#412</span>
                      </div>
                      <Globe size={16} className="text-gray-700" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FeedItem = ({ icon, text, time }: any) => (
  <div className="flex gap-4 group">
    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-sm group-hover:bg-cyan-500/10 transition-all">
       {icon}
    </div>
    <div className="flex-1">
       <p className="text-[10px] text-gray-400 font-bold leading-relaxed">{text}</p>
       <p className="text-[8px] text-gray-600 uppercase font-black mt-1 tracking-tighter">{time}</p>
    </div>
  </div>
);

const PrizeMiniCard = ({ title, prize, winner, shimmer }: any) => (
  <div className={`glass p-4 rounded-xl border border-white/5 bg-[#0a0a0a] flex flex-col gap-2 relative overflow-hidden group ${shimmer ? 'animate-shimmer-gold' : ''}`}>
     <div className="flex justify-between items-start">
        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{title}</span>
        <Trophy size={12} className="text-yellow-500/50" />
     </div>
     <div className="flex flex-col">
        <span className="text-xs font-bold text-white uppercase">{prize}</span>
        <span className="text-[8px] font-mono text-cyan-500 mt-0.5">CURRENT_WINNER: {winner}</span>
     </div>
     {shimmer && <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent animate-shimmer" />}
  </div>
);

const NoLeaderboardData = () => (
   <div className="glass rounded-xl p-20 border border-dashed border-[#262626] flex flex-col items-center justify-center text-center bg-[#07070a] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex items-center justify-center">
         <Trophy size={400} className="text-white" />
      </div>
      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-8 relative z-10">
         <Medal className="text-gray-600 animate-pulse" size={32} />
      </div>
      <h3 className="text-lg font-bold text-gray-500 uppercase tracking-widest mb-3 relative z-10">Rankings Initializing</h3>
      <p className="text-[10px] text-gray-700 uppercase tracking-widest leading-loose max-w-sm relative z-10">
         The leaderboard is currently empty. Standings will be calculated instantly after the first grid telemetry is broadcast by the Campus Administrator.
      </p>
   </div>
);
