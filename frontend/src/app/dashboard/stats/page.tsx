import type { Metadata } from "next";
import StatsOverview from "@/components/stats/StatsOverview";
import PageHeader from "@/components/layout/PageHeader";
import WeeklyChart from "@/components/stats/WeeklyChart";
import EnvironmentalImpact from "@/components/stats/EnvironmentalImpact";
import MonthlyTrend from "@/components/stats/MonthlyTrend";
import AchievementGrid from "@/components/stats/AchievementGrid";
import Leaderboard from "@/components/stats/Leaderboard";
import MonthPicker from "@/components/stats/MonthPicker";

export const metadata: Metadata = {
  title: "Statistik — EcoBottle",
  description:
    "Lihat statistik daur ulang Anda: jumlah botol, dampak lingkungan, achievements, dan leaderboard.",
};

export default function StatsPage() {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6 md:mb-8">
        <div>
          <PageHeader
            titleKey="stats_page_title"
            descKey="stats_page_desc"
            className="mb-0"
          />
        </div>
        <div className="shrink-0 sm:pt-1">
          <MonthPicker />
        </div>
      </div>

      {/* Overview Cards */}
      <StatsOverview />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
        <div className="lg:col-span-3">
          <WeeklyChart />
        </div>
        <div className="lg:col-span-2">
          <EnvironmentalImpact />
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
