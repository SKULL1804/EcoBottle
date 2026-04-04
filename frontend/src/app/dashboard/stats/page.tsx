import type { Metadata } from "next";
import StatsOverview from "@/components/stats/StatsOverview";
import WeeklyChart from "@/components/stats/WeeklyChart";
import BottleBreakdown from "@/components/stats/BottleBreakdown";
import MonthlyTrend from "@/components/stats/MonthlyTrend";
import AchievementGrid from "@/components/stats/AchievementGrid";
import Leaderboard from "@/components/stats/Leaderboard";

export const metadata: Metadata = {
  title: "Statistik — EcoBottle",
  description:
    "Lihat statistik daur ulang Anda: jumlah botol, dampak lingkungan, achievements, dan leaderboard.",
};

export default function StatsPage() {
  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-background font-headline">
            Statistik
          </h2>
          <p className="text-tertiary">
            Pantau progress daur ulang & dampak lingkungan
          </p>
        </div>
        <div className="flex items-center gap-2 bg-secondary-container px-4 py-2 rounded-full">
          <span className="material-symbols-outlined text-primary text-lg">
            calendar_month
          </span>
          <span className="text-on-secondary-container text-sm font-bold">
            April 2026
          </span>
        </div>
      </header>

      {/* Overview Cards */}
      <StatsOverview />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
        <div className="lg:col-span-3">
          <WeeklyChart />
        </div>
        <div className="lg:col-span-2">
          <BottleBreakdown />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1">
          <MonthlyTrend />
        </div>
        <div className="lg:col-span-1">
          <AchievementGrid />
        </div>
        <div className="lg:col-span-1">
          <Leaderboard />
        </div>
      </div>
    </>
  );
}
