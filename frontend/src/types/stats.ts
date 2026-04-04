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
