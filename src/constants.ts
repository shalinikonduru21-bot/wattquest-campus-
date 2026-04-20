/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppState, DepartmentId } from './types';

export const DEPT_LIST: DepartmentId[] = ['CSE', 'ECE', 'Mechanical', 'Civil', 'MBA', 'AIML', 'AIDS'];

export const DEPT_ICONS: Record<string, string> = {
  CSE: '💻',
  ECE: '🔌',
  Mechanical: '⚙️',
  Civil: '🏗️',
  MBA: '💼',
  AIML: '🤖',
  AIDS: '📊',
};

export const INITIAL_STATE: AppState = {
  college: "PEC",
  currentUser: { name: "", dept: "", role: "" },
  departments: {
    CSE:  { kwh: 0, lastMonth: 0, xp: 0, level: 1, streak: 0 },
    ECE:  { kwh: 0, lastMonth: 0, xp: 0, level: 1, streak: 0 },
    Mechanical: { kwh: 0, lastMonth: 0, xp: 0, level: 1, streak: 0 },
    Civil: { kwh: 0, lastMonth: 0, xp: 0, level: 1, streak: 0 },
    MBA:  { kwh: 0, lastMonth: 0, xp: 0, level: 1, streak: 0 },
    AIML: { kwh: 0, lastMonth: 0, xp: 0, level: 1, streak: 0 },
    AIDS: { kwh: 0, lastMonth: 0, xp: 0, level: 1, streak: 0 }
  },
  competition: {
    currentSeason: "Semester 2 — 2026",
    prizePool: 50000,
    weeklyChallenge: "Lowest kWh this week wins ₹500 canteen vouchers",
    monthlyPrize: "₹10,000 Department Fund",
    semesterPrize: "Trophy + ₹25,000 + College Trip"
  },
  globalStats: {
    treesPlanted: 0,
    co2Saved: 0,
    activeStudents: 0,
    moneySaved: 0,
    totalKwh: 0
  },
  burnoutThreshold: 1500,
  villainMode: false,
  isDemoMode: false
};

export const SAMPLE_DATA: Record<DepartmentId, { kwh: number; lastMonth: number }> = {
  CSE: { kwh: 1200, lastMonth: 1350 },
  ECE: { kwh: 980, lastMonth: 1150 },
  Mechanical: { kwh: 1550, lastMonth: 1500 },
  Civil: { kwh: 1100, lastMonth: 1250 },
  MBA: { kwh: 850, lastMonth: 900 },
  AIML: { kwh: 1300, lastMonth: 1400 },
  AIDS: { kwh: 950, lastMonth: 1050 }
};

export const COLORS: Record<string, string> = {
  CSE: '#00f2ff',
  ECE: '#39ff14',
  Mechanical: '#f97316',
  Civil: '#8b5cf6',
  MBA: '#ec4899',
  AIML: '#06b6d4',
  AIDS: '#10b981',
};

export const DEPARTMENTS: Record<string, string> = {
  CSE: 'Computer Science',
  ECE: 'Electronics',
  Mechanical: 'Mechanical',
  Civil: 'Civil',
  MBA: 'MBA',
  AIML: 'AIML',
  AIDS: 'AIDS',
};

export const KWH_RATE = 6.50; // ₹ per kWh
export const CO2_RATE = 0.82; // kg per kWh saved
export const TREE_RATE = 10;   // 1 tree per 10 kWh saved
