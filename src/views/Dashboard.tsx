/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Trophy, 
  AlertCircle, 
  TrendingUpDown,
  Ghost,
  Trees,
  Droplet
} from 'lucide-react';
import { AppState, DepartmentId } from '../types';
import { DEPT_LIST, COLORS, DEPT_ICONS } from '../constants';
import { calculateSavings, getWorstDept, hasGridData } from '../utils';

interface DashboardProps {
  state: AppState;
  onToggleDemo: (active: boolean) => void;
}

export const DashboardView: React.FC<DashboardProps> = ({ state, onToggleDemo }) => {
  const [meterValue, setMeterValue] = useState(0);
  const [co2Counter, setCo2Counter] = useState(state.globalStats.co2Saved);
  const userDept = state.currentUser.dept as DepartmentId;
  const deptData = state.departments[userDept];
  const worstDeptId = getWorstDept(state.departments);
  const hasData = hasGridData(state);

  // Meter Fluctuation logic only if data exists
  useEffect(() => {
    if (!hasData) return;
    const interval = setInterval(() => {
      if (deptData) {
        const fluctuation = (Math.random() - 0.5) * 0.05 * deptData.kwh;
        setMeterValue(Math.floor(deptData.kwh + fluctuation));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [deptData, hasData]);

  // CO2 Ticker
  useEffect(() => {
    if (!hasData) return;
    const interval = setInterval(() => {
      setCo2Counter(prev => +(prev + 0.001).toFixed(3));
    }, 1000);
    return () => clearInterval(interval);
  }, [hasData]);

  return (
    <div className="space-y-4 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">
            Agent Terminal: <span className="text-cyan-400">{state.currentUser.name || 'Anonymous User'}</span>
          </h2>
          <p className="text-slate-500 text-[10px] tracking-widest uppercase mt-1">
            Sector Authorization: <span className="text-cyan-400">{userDept || 'Global'}</span> DIV
          </p>
        </div>
        
        <div className="flex gap-4">
           {state.isDemoMode && (
              <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-3">
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping" />
                    DEMO MODE — Sample Data Active
                 </div>
                 <button 
                  onClick={() => onToggleDemo(false)}
                  className="px-2 py-0.5 bg-yellow-500 text-black hover:bg-white transition-colors"
                 >
                    Exit Demo
                 </button>
              </div>
           )}
           {state.villainMode && hasData && (
              <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest animate-pulse flex items-center gap-2">
                 <AlertCircle size={10} /> Sector Vulnerability Detected
              </div>
           )}
        </div>
      </div>

      {!hasData ? (
        <AwaitingData onEnterDemo={() => onToggleDemo(true)} />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:col-span-1">
              <ImpactCard 
                title="Current Sector Load" 
                value={meterValue} 
                suffix="kWh" 
                icon={<Zap size={16} />} 
                color="#00f2ff" 
              />
              <ImpactCard 
                title="Carbon Sequestration" 
                value={co2Counter} 
                suffix="kg" 
                icon={<Droplet size={16} />} 
                color="#39ff14" 
              />
              <ImpactCard 
                title="Grid Resilience" 
                value={state.globalStats.treesPlanted} 
                suffix="Units" 
                icon={<Trees size={16} />} 
                color="#f97316" 
              />
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="glass flex-1 rounded-xl p-6 border border-white/5 bg-[#0a0a0a] relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Node Real-time Telemetry</h3>
                  <div className="flex items-center gap-2">
                     <span className="text-[8px] font-black text-cyan-400 uppercase">Live Stream</span>
                     <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center py-6">
                   <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                         <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                         <motion.circle 
                           cx="80" cy="80" r="70" fill="transparent" 
                           stroke="#00f2ff" strokeWidth="6" strokeDasharray="440"
                           animate={{ strokeDashoffset: 440 - (440 * (Math.min(meterValue, state.burnoutThreshold) / state.burnoutThreshold)) }}
                         />
                      </svg>
                      <div className="absolute flex flex-col items-center text-center">
                         <span className="text-3xl font-mono font-bold text-white tracking-widest">{meterValue}</span>
                         <span className="text-[8px] font-bold text-cyan-400 tracking-widest uppercase mt-1">Grid Load</span>
                      </div>
                   </div>
                </div>

                <div className={`p-4 border rounded-lg transition-all ${meterValue > state.burnoutThreshold ? 'burnout-flash border-red-500/50 bg-red-950/10' : 'bg-white/5 border-white/5'}`}>
                   <div className="flex items-center gap-4">
                      <AlertCircle className={meterValue > state.burnoutThreshold ? 'text-red-500' : 'text-cyan-500'} size={16} />
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-medium">
                        {meterValue > state.burnoutThreshold 
                          ? 'Sector Isolation Recommended: Load exceeding safety threshold.' 
                          : 'Grid handshake successful. System efficiency at 98.4%.'}
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] mb-4 ml-1">Grid Sector Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
               {DEPT_LIST.map(id => {
                 const data = state.departments[id];
                 const isVillain = id === worstDeptId && state.villainMode;
                 const savings = calculateSavings(data.kwh, data.lastMonth);
                 return (
                   <div key={id} className={`glass p-4 rounded-xl border transition-all ${isVillain ? 'villain-shake border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-[#262626] bg-[#0a0a0a]'}`}>
                      <div className="flex items-center justify-between mb-4">
                         <span className="text-xl">{DEPT_ICONS[id]}</span>
                         <span className="text-[9px] font-black uppercase text-gray-500">{id}</span>
                      </div>
                      <div className="space-y-1">
                         <p className="text-lg font-mono font-bold text-white">{data.kwh}</p>
                         <p className={`text-[8px] font-bold uppercase ${savings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {savings >= 0 ? '▼' : '▲'} {Math.abs(savings).toFixed(1)}%
                         </p>
                      </div>
                      {isVillain && (
                        <div className="mt-4 pt-2 border-t border-red-500/20 text-[8px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1">
                           <Ghost size={10} /> Sector Vulnerable
                        </div>
                      )}
                   </div>
                 );
               })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const AwaitingData = ({ onEnterDemo }: { onEnterDemo: () => void }) => (
   <div className="glass rounded-xl h-[70vh] border border-dashed border-[#262626] flex flex-col items-center justify-center text-center bg-[#07070a] relative overflow-hidden">
      {/* Radar Pulse Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
         <motion.div 
           animate={{ scale: [1, 2], opacity: [0.5, 0] }}
           transition={{ duration: 4, repeat: Infinity }}
           className="absolute w-96 h-96 border border-cyan-500 rounded-full"
         />
         <motion.div 
           animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
           transition={{ duration: 4, repeat: Infinity, delay: 1 }}
           className="absolute w-96 h-96 border border-cyan-500 rounded-full"
         />
      </div>

      <div className="relative mb-8 z-10">
         <div className="w-24 h-24 rounded-full bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-center">
            <Zap className="text-cyan-400 animate-pulse" size={40} />
         </div>
         <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border border-dashed border-cyan-500/40 rounded-full"
         />
      </div>

      <div className="space-y-4 max-w-md px-6 z-10">
         <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em]">⚡ Awaiting Grid Sync...</h3>
         <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-loose">
            Admin hasn't uploaded this month's data yet. Grid telemetry is currently in standby mode. Check back soon for live infrastructure monitoring!
         </p>
         
         <div className="pt-8">
            <button 
              onClick={onEnterDemo}
              className="px-8 py-3 bg-cyan-600/10 border border-cyan-500 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-cyan-500 hover:text-black transition-all flex items-center gap-3 mx-auto group"
            >
               <TrendingUpDown size={14} className="group-hover:rotate-180 transition-transform duration-500" />
               ▶ Preview with Sample Data
            </button>
         </div>
      </div>
   </div>
);

const ImpactCard = ({ title, value, suffix, icon, color, change }: any) => (
  <div className="glass p-4 rounded-xl border-[#262626] bg-[#0a0a0a]">
    <div className="flex justify-between items-start mb-2">
      <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black">{title}</p>
      <div className="p-1 px-2 rounded bg-white/5 text-[10px]" style={{ color }}>{icon}</div>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-mono text-white font-bold">{typeof value === 'number' && value < 1 ? value : Math.floor(value).toLocaleString()}</span>
      <span className="text-[9px] text-gray-600 uppercase font-black">{suffix}</span>
    </div>
  </div>
);
