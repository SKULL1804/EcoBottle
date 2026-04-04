import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WalletCard from "@/components/dashboard/WalletCard";
import ScanCard from "@/components/dashboard/ScanCard";
import StatsCards from "@/components/dashboard/StatsCards";
import MonthlyChart from "@/components/dashboard/MonthlyChart";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader />

      {/* Bento Grid Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 grid-rows-auto gap-6">
        <WalletCard />
        <ScanCard />
        <StatsCards />
        <MonthlyChart />
        <RecentActivity />
      </div>
    </>
  );
}
