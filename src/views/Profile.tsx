/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Settings, 
  Gift
} from 'lucide-react';
import { AppState } from '../types';
import { hasGridData } from '../utils';

interface ProfileProps {
  state: AppState;
}

export const ProfileView: React.FC<ProfileProps> = ({ state }) => {
  const [energySaver, setEnergySaver] = useState(false);
  const hasData = hasGridData(state);
  const deptId = state.currentUser.dept || 'N/A';

  return (
    <div className="space-y-4 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">
            User Metadata
          </h2>
          <p className="text-cyan-400 text-[10px] tracking-widest uppercase">Authorized Agent Profile</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="lg:col-span-1 glass rounded-xl border-[#262626] bg-[#0a0a0a] p-6 flex flex-col items-center text-center">
           <div className="w-20 h-20 rounded-full border-2 border-cyan-500/30 flex items-center justify-center p-1 mb-4">
              <div className="w-full h-full rounded-full bg-cyan-500/10 flex items-center justify-center">
                 <UserIcon size={32} className="text-cyan-400" />
              </div>
           </div>
           <h3 className="text-lg font-bold text-white tracking-tighter uppercase">{state.currentUser.name || 'Anonymous'}</h3>
           <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Authorized Sector: {deptId}</p>

           <div className="grid grid-cols-2 w-full gap-2 mt-8 pt-6 border-t border-[#262626]">
              <div className="p-3 bg-white/5 border border-white/5 rounded">
                 <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Grid Rank</p>
                 <p className="text-lg font-mono font-bold text-cyan-400">{hasData ? '#04' : '--'}</p>
              </div>
              <div className="p-3 bg-white/5 border border-white/5 rounded">
                 <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Energy Effect</p>
                 <p className="text-lg font-mono font-bold text-green-400">{hasData ? '42kg' : '0kg'}</p>
              </div>
           </div>
        </div>

        {/* Badges & Achievements */}
        <div className="lg:col-span-2 glass rounded-xl border-[#262626] bg-[#0a0a0a] p-6 flex flex-col">
           <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Achievement Matrix</h3>
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Badge label="Champion" active={hasData} icon="🏆" />
              <Badge label="Peak Saver" active={hasData} icon="⚡" />
              <Badge label="Eco Warrior" active={false} icon="🌿" />
              <Badge label="Grid Master" active={false} icon="🧠" />
           </div>

           {!hasData && (
              <div className="flex-1 mt-6 p-4 border border-dashed border-[#262626] rounded-xl flex items-center justify-center italic text-[10px] text-gray-600 uppercase tracking-widest">
                 Awaiting system data for achievement unlock matrix.
              </div>
           )}

           <div className="mt-8 pt-6 border-t border-[#262626]">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Node Settings</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded">
                    <div className="flex items-center gap-3">
                       <Gift className="text-gray-600" size={16} />
                       <div>
                          <p className="text-xs font-bold text-white uppercase">Personalized Challenges</p>
                          <p className="text-[9px] text-gray-500 tracking-widest">Enable AI-driven efficiency markers.</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setEnergySaver(!energySaver)}
                      className={`w-10 h-5 rounded-full p-1 transition-all ${energySaver ? 'bg-cyan-500' : 'bg-white/10'}`}
                    >
                       <div className={`w-3 h-3 bg-white rounded-full transition-all ${energySaver ? 'translate-x-5' : ''}`} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {hasData && (
        <div className="glass p-6 rounded-xl border-l-4 border-l-orange-500 bg-[#0a0a0a]">
           <h3 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2">Redemption Protocol</h3>
           <p className="text-xs text-gray-400">
              Save 5% more energy this week to secure the "Efficiency Hero" badge and unlock special rewards.
           </p>
        </div>
      )}
    </div>
  );
};

const Badge = ({ label, active, icon }: any) => (
  <div className={`flex flex-col items-center gap-3 p-4 border rounded-xl transition-all ${active ? 'bg-cyan-500/5 border-cyan-500/30' : 'bg-white/2 border-white/5 opacity-40'}`}>
    <span className={`text-2xl ${active ? 'grayscale-0' : 'grayscale'}`}>{icon}</span>
    <span className={`text-[10px] font-bold uppercase tracking-tighter ${active ? 'text-white' : 'text-gray-600'}`}>{label}</span>
  </div>
);
