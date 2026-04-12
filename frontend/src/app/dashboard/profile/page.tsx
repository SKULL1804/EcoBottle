import type { Metadata } from "next";
import ProfileCard from "@/components/profile/ProfileCard";
import TierProgress from "@/components/profile/TierProgress";
import QuickStats from "@/components/profile/QuickStats";
import SettingsMenu from "@/components/profile/SettingsMenu";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Profil & Pengaturan — EcoBottle",
  description:
    "Kelola profil, lihat tier progression, dan atur preferensi akun Anda.",
};

export default function ProfilePage() {
  return (
    <>
      {/* Header */}
      <PageHeader
        titleKey="profile_page_title"
        descKey="profile_page_desc"
        backHref="/dashboard"
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — Profile + Tier + Stats */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ProfileCard />
          <TierProgress />
          <QuickStats />
        </div>

        {/* Right — Settings */}
        <div className="lg:col-span-3">
          <SettingsMenu />
        </div>
      </div>
    </>
  );
}
