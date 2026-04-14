"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function DashboardHeader() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="flex justify-between items-center mb-6 md:mb-10">
      <div className="min-w-0 flex-1 mr-3">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-on-background font-headline truncate">
          {t("greeting")}, {user?.name?.split(" ")[0] || "User"}
        </h2>
        <p className="text-tertiary text-sm md:text-base truncate">
          {user?.level_title || "🌱 Pemula"} • {user?.total_scans || 0} {t("recycled_bottles")}
        </p>
      </div>
      <div className="flex gap-3 items-center shrink-0">
        <Link
          href="/dashboard/profile"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shadow-lg border-2 border-surface-container-lowest relative hover:ring-2 hover:ring-primary/30 transition-all flex items-center justify-center bg-primary-container"
        >
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-on-primary font-bold text-base md:text-lg">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
