/** Stats overview card data. */
export interface StatCard {
  icon: string;
  label: string;
  value: string;
  subtitle: string;
  trend?: string;
  trendUp?: boolean;
}

/** Weekly recycling data point. */
export interface WeeklyData {
  day: string;
  bottles: number;
}

export interface WeeklyStatsPoint {
  day: string;
  date: string;
  bottles: number;
}

export interface WeeklyStatsResponse {
  points: WeeklyStatsPoint[];
  total_bottles: number;
  avg_per_day: number;
}

export interface MonthlyTrendPoint {
  month: string;
  year: number;
  bottles: number;
}

export interface MonthlyTrendResponse {
  points: MonthlyTrendPoint[];
  growth_percent: number;
}

/** Bottle type breakdown data. */
export interface BottleType {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

/** Achievement/badge data. */
export interface Achievement {
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
}

/** Leaderboard entry. */
export interface LeaderEntry {
  rank: number;
  name: string;
  bottles: number;
  isUser?: boolean;
}
