/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  QrCode,
  ArrowRight,
  Database,
  FileSpreadsheet,
  Link2
} from 'lucide-react';
import { AppState, DepartmentId } from '../types';
import { DEPT_LIST } from '../constants';
import { updateAppState } from '../utils';

interface AdminProps {
  state: AppState;
  onUpdate: (s: AppState) => void;
}

export const AdminPanelView: React.FC<AdminProps> = ({ state, onUpdate }) => {
  const [readings, setReadings] = useState<Record<string, { kwh: string, last: string }>>(
    DEPT_LIST.reduce((acc, id) => ({ 
      ...acc, 
      [id]: { 
        kwh: state.departments[id].kwh.toString(), 
        last: state.departments[id].lastMonth.toString() 
      } 
    }), {})
  );
  const [threshold, setThreshold] = useState(state.burnoutThreshold);

  const handleUpdate = () => {
    const updates: any = {};
    DEPT_LIST.forEach(id => {
      updates[id] = {
        kwh: parseFloat(readings[id]?.kwh || '0'),
        lastMonth: parseFloat(readings[id]?.last || '0')
      };
    });

    const newState = updateAppState({ ...state, burnoutThreshold: threshold }, updates);
    onUpdate(newState);
    alert("Grid Updated Successfully! Everything is now dynamic.");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').filter(row => row.trim());
      const updates: any = {};
      
      rows.slice(1).forEach(row => {
        const [dept, kwh, lastMonth] = row.split(',').map(s => s.trim());
        const dId = dept as DepartmentId;
        if (dept && DEPT_LIST.includes(dId)) {
          updates[dId] = {
            kwh: parseFloat(kwh || '0'),
            lastMonth: parseFloat(lastMonth || '0')
          };
        }
      });

      if (Object.keys(updates).length > 0) {
        const newState = updateAppState(state, updates);
        onUpdate(newState);
        alert(`Successfully synchronized ${Object.keys(updates).length} sectors via CSV.`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">
            Command Center
          </h2>
          <p className="text-orange-400 text-[10px] tracking-widest uppercase">Global Grid Oversight & Telemetry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Readings Input */}
        <div className="lg:col-span-2 glass rounded-xl border-[#262626] bg-[#0a0a0a] flex flex-col">
           <div className="p-4 border-b border-[#262626] flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Meter Telemetry Input</h3>
              <Cpu className="text-orange-500 w-4 h-4 animate-pulse" />
           </div>
           
           <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 gap-6">
                {DEPT_LIST.map(id => (
                  <div key={id} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{id} SECTOR</label>
                      <span className="text-[9px] text-gray-600 font-mono">NODE_ACTIVE_{id}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[8px] text-gray-500 uppercase">Current Month (kWh)</p>
                        <input 
                          type="number"
                          value={readings[id]?.kwh || ''}
                          onChange={e => setReadings({ ...readings, [id]: { ...readings[id], kwh: e.target.value } })}
                          className="w-full bg-[#050505] border border-[#262626] p-2 text-sm text-white outline-none focus:border-cyan-500/50"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] text-gray-500 uppercase">Last Month (kWh)</p>
                        <input 
                          type="number"
                          value={readings[id]?.last || ''}
                          onChange={e => setReadings({ ...readings, [id]: { ...readings[id], last: e.target.value } })}
                          className="w-full bg-[#050505] border border-[#262626] p-2 text-sm text-white outline-none focus:border-orange-500/50"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#262626] space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                       <span className="text-gray-400">Burnout Threshold</span>
                       <span className="text-orange-400">{threshold} kWh</span>
                    </div>
                    <input 
                      type="range"
                      min="500"
                      max="5000"
                      step="50"
                      value={threshold}
                      onChange={e => setThreshold(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                 </div>

                 <button 
                  onClick={handleUpdate}
                  className="w-full py-4 bg-orange-600/10 border border-orange-500 text-orange-400 text-xs font-bold uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-black transition-all flex items-center justify-center gap-2"
                 >
                    Update Campus Grid <ArrowRight size={14} />
                 </button>
              </div>
           </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
           <div className="glass rounded-xl p-6 border-b-4 border-b-orange-500 bg-[#0a0a0a]">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Live AI Projection</h3>
              <div className="space-y-6">
                 <div>
                    <p className="text-[10px] text-gray-500 uppercase mb-1">Campus Load Intensity</p>
                    <p className="text-3xl font-mono font-bold text-white tracking-widest">
                       {state.globalStats.totalKwh || '0'} <span className="text-xs text-gray-600">kWh</span>
                    </p>
                 </div>
                 
                 <div className="p-4 bg-white/5 border border-[#262626] rounded">
                    <p className="text-[9px] text-gray-500 font-bold uppercase mb-2">System Status</p>
                    <p className="text-xs text-gray-400 italic">
                       {state.globalStats.totalKwh > 0 ? "Grid data synchronized. Competition rankings calculated." : "Awaiting initial grid handshake from Command Center."}
                    </p>
                 </div>
              </div>
           </div>

           <div className="glass rounded-xl p-6 border border-[#262626] bg-[#0a0a0a]">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Control QR</h3>
              <div className="flex flex-col items-center justify-center gap-4 py-4 border border-dashed border-[#262626] rounded-xl">
                 <QrCode size={40} className="text-gray-700" />
                 <p className="text-[9px] text-gray-600 uppercase font-bold text-center">Mobile Terminal Override</p>
              </div>
           </div>

           {/* PHASE 2 - Scale Section */}
           <div className="glass rounded-xl p-6 border border-cyan-500/20 bg-cyan-500/5 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="text-cyan-400" size={16} />
                  <h3 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Phase 2 — Auto Sync</h3>
                </div>
                
                <div className="space-y-3">
                   <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex flex-col gap-2">
                      <p className="text-[8px] text-gray-500 uppercase font-black">Sync Method A</p>
                      <button className="w-full py-2 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold uppercase flex items-center justify-center gap-2 cursor-not-allowed">
                        <Link2 size={12} /> API SYNC (SOON)
                      </button>
                   </div>

                   <div className="p-3 bg-cyan-900/10 border border-cyan-500/20 rounded-lg flex flex-col gap-2 group">
                      <p className="text-[8px] text-cyan-500 uppercase font-black">Sync Method B (Active)</p>
                      <label className="w-full py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-cyan-500 hover:text-black">
                        <FileSpreadsheet size={12} /> BATCH CSV SYNC
                        <input 
                          type="file" 
                          accept=".csv" 
                          className="hidden" 
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="text-[7px] text-cyan-600 uppercase font-black text-center mt-1 italic opacity-50">Format: Dept, Current, Previous</p>
                   </div>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
};
