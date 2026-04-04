import type {
  StatCard,
  WeeklyData,
  BottleType,
  Achievement,
  LeaderEntry,
} from "@/types/stats";

/* ─── Overview Stat Cards ─── */
export const STAT_CARDS: StatCard[] = [
  {
    icon: "recycling",
    label: "Total Botol",
    value: "127",
    subtitle: "botol daur ulang",
    trend: "+12",
    trendUp: true,
  },
  {
    icon: "scale",
    label: "Plastik Diselamatkan",
    value: "12.7 kg",
    subtitle: "pengurangan limbah",
    trend: "+2.1 kg",
    trendUp: true,
  },
  {
    icon: "co2",
    label: "CO₂ Dicegah",
    value: "31.8 kg",
    subtitle: "emisi karbon",
    trend: "+5.3 kg",
    trendUp: true,
  },
  {
    icon: "savings",
    label: "Total Reward",
    value: "Rp 63.500",
    subtitle: "pendapatan",
    trend: "+Rp 8.200",
    trendUp: true,
  },
];

/* ─── Weekly Activity ─── */
export const WEEKLY_DATA: WeeklyData[] = [
  { day: "Sen", bottles: 3 },
  { day: "Sel", bottles: 5 },
  { day: "Rab", bottles: 2 },
  { day: "Kam", bottles: 7 },
  { day: "Jum", bottles: 4 },
  { day: "Sab", bottles: 8 },
  { day: "Min", bottles: 6 },
];

/* ─── Bottle Type Breakdown ─── */
export const BOTTLE_TYPES: BottleType[] = [
  {
    label: "PET Bening",
    count: 68,
    percentage: 54,
    color: "var(--color-primary)",
  },
  {
    label: "PET Berwarna",
    count: 31,
    percentage: 24,
    color: "var(--color-primary-container)",
  },
  {
    label: "HDPE",
    count: 18,
    percentage: 14,
    color: "var(--color-secondary)",
  },
  {
    label: "Kaca",
    count: 10,
    percentage: 8,
    color: "var(--color-tertiary-container)",
  },
];

/* ─── Monthly Trend (6 months) ─── */
export const MONTHLY_TREND = [
  { month: "Nov", bottles: 12 },
  { month: "Des", bottles: 18 },
  { month: "Jan", bottles: 15 },
  { month: "Feb", bottles: 22 },
  { month: "Mar", bottles: 28 },
  { month: "Apr", bottles: 32 },
] as const;

/* ─── Achievements ─── */
export const ACHIEVEMENTS: Achievement[] = [
  {
    icon: "emoji_events",
    title: "First Bottle",
    description: "Scan botol pertama Anda",
    unlocked: true,
  },
  {
    icon: "local_fire_department",
    title: "7-Day Streak",
    description: "Scan setiap hari selama 7 hari",
    unlocked: true,
  },
  {
    icon: "military_tech",
    title: "50 Bottles Club",
    description: "Kumpulkan total 50 botol",
    unlocked: true,
  },
  {
    icon: "diamond",
    title: "Platinum Recycler",
    description: "Kumpulkan total 200 botol",
    unlocked: false,
  },
  {
    icon: "public",
    title: "Eco Warrior",
    description: "Cegah 50kg emisi CO₂",
    unlocked: false,
  },
  {
    icon: "workspace_premium",
    title: "Top 10 Regional",
    description: "Masuk 10 besar leaderboard",
    unlocked: false,
  },
];

/* ─── Leaderboard ─── */
export const LEADERBOARD: LeaderEntry[] = [
  { rank: 1, name: "Sari M.", bottles: 342 },
  { rank: 2, name: "Budi R.", bottles: 289 },
  { rank: 3, name: "Dewi K.", bottles: 256 },
  { rank: 4, name: "Andi P.", bottles: 198 },
  { rank: 5, name: "Alex W.", bottles: 127, isUser: true },
  { rank: 6, name: "Rina S.", bottles: 115 },
  { rank: 7, name: "Fajar H.", bottles: 98 },
];
