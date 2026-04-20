/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppState, DepartmentId } from './types';
import { CO2_RATE, KWH_RATE, TREE_RATE, DEPT_LIST } from './constants';

export const calculateSavings = (current: number, last: number) => {
  if (last === 0 || current === 0) return 0;
  return ((last - current) / last) * 100;
};

export const hasGridData = (state: AppState) => {
  return DEPT_LIST.some(id => state.departments[id].kwh > 0);
};

export const updateAppState = (state: AppState, updates: Record<DepartmentId, { kwh: number, lastMonth: number }>): AppState => {
  const departments = { ...state.departments };
  
  Object.entries(updates).forEach(([id, data]) => {
    const dId = id as DepartmentId;
    const dept = departments[dId];
    
    const newKwh = data.kwh;
    const lastMonth = data.lastMonth;
    
    dept.lastMonth = lastMonth;
    dept.kwh = newKwh;
    
    // XP Logic: Give XP for savings
    const savingsPercent = calculateSavings(newKwh, lastMonth);
    if (savingsPercent > 0) {
      dept.xp += Math.floor(savingsPercent * 25); // Increased XP gain
      dept.level = Math.floor(dept.xp / 1000) + 1;
      dept.streak += 1;
    } else if (newKwh > 0) {
      dept.streak = 0;
    }
  });
  
  // Recalculate Global Stats
  let totalSavedKwh = 0;
  let currentTotalKwh = 0;
  
  DEPT_LIST.forEach(id => {
    const d = departments[id];
    currentTotalKwh += d.kwh;
    if (d.lastMonth > 0 && d.lastMonth > d.kwh && d.kwh > 0) {
      totalSavedKwh += (d.lastMonth - d.kwh);
    }
  });
  
  const globalStats = {
    ...state.globalStats,
    totalKwh: currentTotalKwh,
    co2Saved: Number((totalSavedKwh * CO2_RATE).toFixed(2)),
    moneySaved: Math.floor(totalSavedKwh * KWH_RATE),
    treesPlanted: Math.floor(totalSavedKwh / TREE_RATE),
    activeStudents: 1200 // Mock static or can be updated
  };
  
  return { ...state, departments, globalStats };
};

export const getWorstDept = (departments: Record<string, { kwh: number, lastMonth: number }>): DepartmentId | null => {
  let worst: DepartmentId | null = null;
  let maxUsage = -1;
  
  Object.entries(departments).forEach(([id, data]) => {
    if (data.kwh > 0 && data.kwh > maxUsage) {
      maxUsage = data.kwh;
      worst = id as DepartmentId;
    }
  });
  
  return worst;
};

export const getBestDept = (departments: Record<string, { kwh: number, lastMonth: number }>): DepartmentId | null => {
  let best: DepartmentId | null = null;
  let maxSavings = -Infinity;
  
  Object.entries(departments).forEach(([id, data]) => {
     if (data.kwh > 0 && data.lastMonth > 0) {
        const savings = calculateSavings(data.kwh, data.lastMonth);
        if (savings > maxSavings) {
          maxSavings = savings;
          best = id as DepartmentId;
        }
     }
  });
  
  return best;
};
