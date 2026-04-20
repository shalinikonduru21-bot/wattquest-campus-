/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Building2, ChevronRight } from 'lucide-react';
import { DepartmentId, User } from '../types';
import { DEPT_LIST, DEPT_ICONS } from '../constants';

interface LoginProps {
  onLogin: (u: User) => void;
  treesPlanted: number;
}

export const LoginView: React.FC<LoginProps> = ({ onLogin, treesPlanted }) => {
  const [formData, setFormData] = useState<User>({ name: '', dept: '', role: 'student' });
  const [pass, setPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dept) {
      alert("Please enter name and department");
      return;
    }
    // Simple validation: if admin role is picked, check pass
    if (formData.role === 'admin' && pass !== '2026') {
      alert("Invalid Admin Passcode");
      return;
    }
    onLogin(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0f] relative overflow-hidden">
      <div className="w-full max-w-lg z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="glass p-8 rounded-xl border-t border-white/5 bg-[#0a0a0a] shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center relative">
                 <Zap size={24} className="text-cyan-400" />
                 <Building2 className="absolute -top-1 -right-1 w-4 h-4 text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-widest text-white uppercase">
                  WattQuest <span className="text-cyan-400">Campus</span>
                </h1>
                <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-500">Powering Smarter Campuses</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 tracking-widest block font-black">Authentication Node</label>
                <div className="grid grid-cols-2 gap-3">
                   <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'student' })}
                    className={`py-3 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${formData.role === 'student' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/5 text-gray-600'}`}
                   >
                     Student Portal
                   </button>
                   <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                    className={`py-3 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${formData.role === 'admin' ? 'bg-orange-500/10 border-orange-500 text-orange-400' : 'bg-white/5 border-white/5 text-gray-600'}`}
                   >
                     Admin Console
                   </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 tracking-widest block font-black">Agent Identity</label>
                <input 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name..."
                  className="w-full bg-[#050505] border border-[#262626] p-3 text-sm text-white placeholder:text-gray-700 outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 tracking-widest block font-black">Sector Selection</label>
                <div className="grid grid-cols-4 gap-2">
                   {DEPT_LIST.map(id => (
                     <button
                       key={id}
                       type="button"
                       onClick={() => setFormData({ ...formData, dept: id })}
                       className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${formData.dept === id ? 'bg-cyan-500/20 border-cyan-500' : 'bg-white/5 border-white/5 grayscale opacity-50'}`}
                     >
                       <span className="text-xl">{DEPT_ICONS[id]}</span>
                       <span className="text-[8px] font-bold uppercase text-white">{id}</span>
                     </button>
                   ))}
                </div>
              </div>

              {formData.role === 'admin' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] uppercase text-gray-500 tracking-widest block font-black">Admin Access Key</label>
                  <input 
                    type="password"
                    value={pass}
                    onChange={e => setPass(e.target.value)}
                    placeholder="Enter Private Key..."
                    className="w-full bg-[#050505] border border-orange-500/30 p-3 text-sm text-white placeholder:text-gray-700 outline-none"
                  />
                </motion.div>
              )}

              <button 
                type="submit"
                className="w-full py-4 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)] mt-4"
              >
                Access Grid Node
              </button>
            </form>
          </div>

          <div className="flex gap-3 mt-2">
             <div className="flex-1 glass p-4 bg-green-500/5 border border-green-500/10 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-xl">🌱</div>
                <div>
                   <p className="text-green-400 font-bold text-lg leading-none">{treesPlanted}</p>
                   <p className="text-[8px] uppercase text-gray-500 font-black tracking-widest mt-1">Trees Planted</p>
                </div>
             </div>
             <div className="flex-1 glass p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center text-xl">🏙️</div>
                <div>
                   <p className="text-cyan-400 font-bold text-lg leading-none">PEC</p>
                   <p className="text-[8px] uppercase text-gray-500 font-black tracking-widest mt-1">Host Campus</p>
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 w-full overflow-hidden whitespace-nowrap opacity-20 hover:opacity-100 transition-all pointer-events-none">
        <motion.div 
          animate={{ x: [0, -2000] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 text-[10px] font-black uppercase tracking-[0.5em] text-gray-500"
        >
          {Array(10).fill("Grid Sync Pending | Awaiting HOD Meter Input | Weekly Prize: ₹500 Canteen Vouchers | Semester Grand Prize: ₹25,000 + Trip").map((t, i) => (
             <span key={i}>{t}</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
