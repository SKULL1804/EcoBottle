import type { Metadata } from "next";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "Dashboard — EcoBottle",
  description:
    "Track your recycling progress, manage your wallet, and see your environmental impact.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 p-6 lg:p-10 pb-24 lg:pb-10 overflow-y-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
