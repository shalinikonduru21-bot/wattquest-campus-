/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  LayoutDashboard, 
  Trophy, 
  Settings, 
  BarChart3, 
  User as UserIcon,
  Sword,
  Building2,
  Power,
  Skull
} from 'lucide-react';

import { AppState, Page, User } from './types';
import { INITIAL_STATE, SAMPLE_DATA } from './constants';
import { LoginView } from './views/Login';
import { DashboardView } from './views/Dashboard';
import { LeaderboardView } from './views/Leaderboard';
import { AdminPanelView } from './views/AdminPanel';
import { AnalyticsView } from './views/Analytics';
import { ProfileView } from './views/Profile';
import { BattleArenaView } from './views/BattleArena';
import { getBestDept, updateAppState } from './utils';

const LOCAL_STORAGE_KEY = 'wattquest_campus_state_v3';

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isLoaded, setIsLoaded] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ 
          ...prev, 
          ...parsed,
          // Ensure nested objects are also merged if they grow
          globalStats: { ...prev.globalStats, ...parsed.globalStats },
          competition: { ...prev.competition, ...parsed.competition },
          departments: { ...prev.departments, ...parsed.departments }
        }));
        if (parsed.currentUser?.name) {
          setCurrentPage('dashboard');
        }
      } catch (e) {
        console.error("State sync failed", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const handleLogin = (user: User) => {
    setState(prev => ({ ...prev, currentUser: user }));
    setCurrentPage(user.role === 'admin' ? 'admin' : 'dashboard');
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: { name: '', dept: '', role: '' }, isDemoMode: false }));
    setCurrentPage('login');
  };

  const handleToggleDemo = (active: boolean) => {
    if (active) {
      const newState = updateAppState({ ...state, isDemoMode: true }, SAMPLE_DATA);
      setState(newState);
    } else {
      setState(prev => ({
        ...prev,
        isDemoMode: false,
        departments: INITIAL_STATE.departments,
        globalStats: INITIAL_STATE.globalStats
      }));
    }
  };

  const bestDeptId = getBestDept(state.departments);
  const burnoutDepts = (Object.entries(state.departments) as [any, any][]).filter(([_, d]) => d.kwh > 1500);
  const hasBurnout = burnoutDepts.length > 0;

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 flex flex-col font-sans">
      <AnimatePresence mode="wait">
        {currentPage === 'login' ? (
          <LoginView onLogin={handleLogin} treesPlanted={state.globalStats.treesPlanted} />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-screen overflow-hidden"
          >
            {/* Command Header */}
            <header className="h-14 border-b border-white/5 bg-[#0a0a0a] flex items-center justify-between px-6 shrink-0 relative z-50">
               <div className="flex items-center gap-3">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full scale-0 group-hover:scale-110 transition-all opacity-0 group-hover:opacity-100" />
                    <Zap className="w-7 h-7 text-cyan-400 fill-cyan-400/10 relative z-10" />
                  </div>
                  <div>
                    <h1 className="text-sm font-black tracking-[0.3em] text-white">WATTQUEST <span className="text-cyan-400 font-mono">2.0</span></h1>
                    <p className="text-[8px] uppercase tracking-[0.2em] font-bold text-gray-500">Node Sync Active</p>
                  </div>
               </div>

               <nav className="flex items-center gap-1">
                  <NavBtn active={currentPage === 'dashboard'} icon={<LayoutDashboard size={16}/>} onClick={() => setCurrentPage('dashboard')} label="Terminal" />
                  <NavBtn active={currentPage === 'battle'} icon={<Sword size={16}/>} onClick={() => setCurrentPage('battle')} label="Arena" />
                  <NavBtn active={currentPage === 'leaderboard'} icon={<Trophy size={16}/>} onClick={() => setCurrentPage('leaderboard')} label="Standings" />
                  <NavBtn active={currentPage === 'analytics'} icon={<BarChart3 size={16}/>} onClick={() => setCurrentPage('analytics')} label="Lab" />
                  {state.currentUser.role === 'admin' && (
                     <NavBtn active={currentPage === 'admin'} icon={<Settings size={16}/>} onClick={() => setCurrentPage('admin')} label="Admin" />
                  )}
                  <NavBtn active={currentPage === 'profile'} icon={<UserIcon size={16}/>} onClick={() => setCurrentPage('profile')} label="Profile" />
               </nav>

               <div className="flex items-center gap-6">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-[8px] uppercase tracking-[0.3em] text-gray-600 font-black">Authorized Unit</span>
                    <span className="text-[10px] font-mono text-cyan-500 font-bold">{state.currentUser.dept || 'SYSTEM'}</span>
                  </div>
                  <button 
                   onClick={handleLogout}
                   className="w-8 h-8 rounded border border-white/5 bg-white/5 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/30 transition-all text-gray-600 hover:text-red-500"
                   title="System Disconnect"
                  >
                     <Power size={14} />
                  </button>
               </div>
            </header>

            {/* Burnout Alert Banner */}
            {hasBurnout && (
              <div className="bg-red-600 burnout-flash py-1 px-4 flex items-center justify-center gap-4 relative z-40 border-b border-red-400">
                <Skull size={14} className="text-white" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  URGENT: Grid Burnout Detected in {burnoutDepts.map(d => d[0]).join(', ')} SECTORS
                </span>
                <Skull size={14} className="text-white" />
              </div>
            )}

            {/* News Ticker */}
            <div className="h-7 bg-cyan-900/10 border-b border-white/5 flex items-center overflow-hidden relative z-30">
               <div className="flex whitespace-nowrap gap-20 px-8 animate-ticker text-[9px] font-bold uppercase tracking-widest text-cyan-500/80 italic">
                  <div className="flex gap-20">
                     <span>{bestDeptId || 'Initializing'} leading the grid with {bestDeptId ? (state.departments[bestDeptId as any]?.streak || 0) : 0} day record streak</span>
                     <span>Sustainability Target: {state.globalStats?.co2Saved?.toFixed(0) || 0}KG Offset achieved</span>
                     <span>Climate Node Status: {state.globalStats?.treesPlanted || 0} Trees generated via efficiency</span>
                     <span>Weekly Prize Pool: ₹{state.competition?.prizePool?.toLocaleString() || '0'} authorized for allocation</span>
                  </div>
                  <div className="flex gap-20">
                     <span>{bestDeptId || 'Initializing'} leading the grid with {bestDeptId ? (state.departments[bestDeptId as any]?.streak || 0) : 0} day record streak</span>
                     <span>Sustainability Target: {state.globalStats?.co2Saved?.toFixed(0) || 0}KG Offset achieved</span>
                     <span>Climate Node Status: {state.globalStats?.treesPlanted || 0} Trees generated via efficiency</span>
                     <span>Weekly Prize Pool: ₹{state.competition?.prizePool?.toLocaleString() || '0'} authorized for allocation</span>
                  </div>
               </div>
            </div>

            {/* Application Matrix Area */}
            <main className="flex-1 flex flex-col p-4 overflow-hidden bg-[#0a0a0f] relative">
               {/* Background Grid Lines */}
               <div className="absolute inset-0 pattern-grid-lg opacity-5 pointer-events-none" />
               
               <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentPage}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.02, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="flex-1 overflow-y-auto custom-scrollbar relative z-10 px-2"
                  >
                     {currentPage === 'dashboard' && <DashboardView state={state} onToggleDemo={handleToggleDemo} />}
                     {currentPage === 'battle' && <BattleArenaView state={state} />}
                     {currentPage === 'leaderboard' && <LeaderboardView state={state} />}
                     {currentPage === 'admin' && <AdminPanelView state={state} onUpdate={setState} />}
                     {currentPage === 'analytics' && <AnalyticsView state={state} />}
                     {currentPage === 'profile' && <ProfileView state={state} />}
                  </motion.div>
               </AnimatePresence>
            </main>

            {/* Dynamic Telemetry Footer */}
            <footer className="h-10 border-t border-white/5 bg-[#0a0a0a] flex items-center shrink-0 relative z-50 overflow-hidden">
               <div className="flex whitespace-nowrap gap-20 px-8 animate-ticker">
                  <div className="flex gap-20">
                     <TickerItem label="Campus Consumption" val={`${state.globalStats.totalKwh || 0} kWh`} color="text-cyan-400" />
                     <TickerItem label="Global Offset" val={`${state.globalStats.co2Saved || 0} KG`} color="text-green-400" />
                     <TickerItem label="Grid Best" val={bestDeptId ? `${bestDeptId} Sector` : 'Pending'} color="text-yellow-500" />
                     <TickerItem label="Active Nodes" val="8 Authorized Branches" color="text-white" />
                     <TickerItem label="System Status" val="Optimal Efficiency" color="text-green-500" />
                  </div>
                  <div className="flex gap-20">
                     <TickerItem label="Campus Consumption" val={`${state.globalStats.totalKwh || 0} kWh`} color="text-cyan-400" />
                     <TickerItem label="Global Offset" val={`${state.globalStats.co2Saved || 0} KG`} color="text-green-400" />
                     <TickerItem label="Grid Best" val={bestDeptId ? `${bestDeptId} Sector` : 'Pending'} color="text-yellow-500" />
                     <TickerItem label="Active Nodes" val="8 Authorized Branches" color="text-white" />
                     <TickerItem label="System Status" val="Optimal Efficiency" color="text-green-500" />
                  </div>
               </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavBtn({ active, icon, onClick, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1.5 transition-all border flex flex-col items-center gap-0.5 group rounded-md ${
        active 
          ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' 
          : 'bg-transparent border-transparent text-gray-500 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span className={`text-[7px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>{label}</span>
    </button>
  );
}

function TickerItem({ label, val, color }: any) {
   return (
      <div className="flex items-center gap-3">
         <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{label}</span>
         <span className={`text-[10px] font-mono font-bold ${color}`}>{val}</span>
      </div>
   );
}
