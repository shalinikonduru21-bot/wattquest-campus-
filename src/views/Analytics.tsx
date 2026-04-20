/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { 
  BarChart3, 
  Mic, 
  Cpu,
  BarChart as BarChartIcon
} from 'lucide-react';
import { AppState, DepartmentId } from '../types';
import { hasGridData } from '../utils';
import { DEPT_LIST } from '../constants';

interface AnalyticsProps {
  state: AppState;
}

export const AnalyticsView: React.FC<AnalyticsProps> = ({ state }) => {
  const hasData = hasGridData(state);
  const chartData = (Object.entries(state.departments) as [DepartmentId, any][])
    .map(([id, data]) => ({
      name: id,
      kwh: data.kwh,
      lastMonth: data.lastMonth
    }));

  return (
    <div className="space-y-4 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">
            Telemetry Lab
          </h2>
          <p className="text-cyan-400 text-[10px] tracking-widest uppercase">Campus usage telemetry & predictive modeling</p>
        </div>
        
        <div className="flex gap-2">
           <button className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-bold text-cyan-400 uppercase tracking-widest">
              Weekly
           </button>
           <button className="px-3 py-1 bg-white/5 border border-white/5 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
              Monthly
           </button>
        </div>
      </div>

      {!hasData ? (
        <div className="glass rounded-xl p-16 border border-dashed border-[#262626] flex flex-col items-center justify-center text-center bg-[#07070a]">
           <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-8">
              <BarChartIcon className="text-gray-600 animate-pulse" size={32} />
           </div>
           <h3 className="text-lg font-bold text-gray-500 uppercase tracking-widest mb-3">No Analytics Available</h3>
           <p className="text-[10px] text-gray-700 uppercase tracking-widest leading-loose max-w-sm">
              The telemetry engine requires at least one grid synchronization to generate predictive models and heatmaps.
           </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Chart */}
          <div className="lg:col-span-2 glass rounded-xl border-[#262626] bg-[#0a0a0a] p-6">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sector Comparison Matrix</h3>
                <Cpu className="text-cyan-400 w-4 h-4" />
             </div>
             
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData}>
                      <XAxis dataKey="name" stroke="#525252" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={({ active, payload }) => {
                         if (active && payload && payload.length) {
                            return (
                               <div className="glass p-3 border-[#262626] bg-[#050505] rounded-lg">
                                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">{payload[0].payload.name}</p>
                                  <p className="text-sm font-mono text-cyan-400">{payload[0].value} kWh</p>
                               </div>
                            );
                         }
                         return null;
                      }} />
                      <Bar dataKey="kwh" fill="#00f2ff" radius={[2, 2, 0, 0]} barSize={30} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-4">
             <div className="glass rounded-xl p-6 border-[#262626] bg-[#0a0a0a] flex-1">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Thermal Load Density</h3>
                <div className="grid grid-cols-4 gap-2">
                   {DEPT_LIST.map((id, i) => (
                      <div 
                        key={id} 
                        className={`aspect-square rounded-sm border transition-all ${state.departments[id].kwh > state.burnoutThreshold ? 'bg-red-500/40 border-red-400' : 'bg-cyan-500/20 border-cyan-400/30'}`} 
                        title={`${id}: ${state.departments[id].kwh} kWh`}
                      />
                   ))}
                   {Array(9).fill(0).map((_, i) => (
                      <div key={i} className="aspect-square rounded-sm border bg-white/5 border-white/5 opacity-10" />
                   ))}
                </div>
                <div className="mt-8">
                   <div className="flex justify-between text-[9px] font-bold uppercase text-gray-600 mb-2">
                      <span>Node Health</span>
                      <span>{state.globalStats.totalKwh > 5000 ? '72%' : '98%'}</span>
                   </div>
                   <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div className={`h-full ${state.globalStats.totalKwh > 5000 ? 'bg-orange-500 w-[72%]' : 'bg-cyan-400 w-[98%]'}`} />
                   </div>
                </div>
             </div>

             <div className="glass rounded-xl p-6 border-l-4 border-l-orange-500 bg-[#0a0a0a]">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Neural Insight</h3>
                <p className="text-xs text-gray-400 leading-relaxed italic">
                   {state.globalStats.totalKwh > 0 
                     ? "Energy patterns suggest a cooling shift in the ECE block. Optimization protocols remain active."
                     : "Awaiting sufficient telemetry markers for pattern recognition."}
                </p>
             </div>
          </div>
        </div>
      )}

      {/* Voice Override Animation */}
      <div className="glass rounded-xl p-6 bg-cyan-950/10 border-[#262626] flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Mic className="text-cyan-400" size={20} />
            <div>
               <p className="text-xs font-bold text-white uppercase tracking-widest">Voice Comms Node</p>
               <p className="text-[10px] text-gray-500">Node standby. Ready for manual wastage reports.</p>
            </div>
         </div>
         <div className="w-10 h-10 rounded-full border border-cyan-500/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
         </div>
      </div>
    </div>
  );
};
