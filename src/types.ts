/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DepartmentId = 'CSE' | 'ECE' | 'Mechanical' | 'Civil' | 'MBA' | 'AIML' | 'AIDS';

export interface DepartmentStats {
  kwh: number;
  lastMonth: number;
  xp: number;
  level: number;
  streak: number;
}

export interface User {
  name: string;
  dept: DepartmentId | 'Admin' | '';
  role: 'student' | 'admin' | '';
}

export interface GlobalStats {
  treesPlanted: number;
  co2Saved: number;
  activeStudents: number;
  moneySaved: number;
  totalKwh: number;
}

export interface Competition {
  currentSeason: string;
  prizePool: number;
  weeklyChallenge: string;
  monthlyPrize: string;
  semesterPrize: string;
}

export interface AppState {
  college: string;
  currentUser: User;
  departments: Record<DepartmentId, DepartmentStats>;
  competition: Competition;
  globalStats: GlobalStats;
  burnoutThreshold: number;
  villainMode: boolean;
  isDemoMode: boolean;
}

export type Page = 'login' | 'dashboard' | 'battle' | 'leaderboard' | 'admin' | 'analytics' | 'profile';
