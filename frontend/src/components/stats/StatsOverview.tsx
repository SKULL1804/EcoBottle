"use client";

import { useState, useEffect } from "react";
import { statsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface StatsData {
  total_scans: number;
  level: number;
  level_title: string;
  points: number;
  balance: number;
  achievements_count: number;
}

export default function StatsOverview() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    statsApi.me().then(({ status, data }) => {
      if (status === 200) setStats(data as StatsData);
    }).catch(() => { });
  }, []);

  const cards = [
    { icon: "recycling", label: t("total_bottles") || "Total Botol", value: `${stats?.total_scans ?? user?.total_scans ?? 0}`, subtitle: t("recycled_bottles") || "botol daur ulang" },
    { icon: "stars", label: t("total_points") || "Total Poin", value: `${(stats?.points ?? user?.points ?? 0).toLocaleString("id")}`, subtitle: `${stats?.level_title ?? user?.level_title ?? (t("starter") || "Pemula")}` },
    { icon: "emoji_events", label: t("achievements") || "Achievements", value: `${stats?.achievements_count ?? 0}`, subtitle: t("badges_earned") || "badges diraih" },
    { icon: "savings", label: t("total_balance") || "Total Saldo", value: `Rp ${(stats?.balance ?? user?.balance ?? 0).toLocaleString("id")}`, subtitle: t("income") || "pendapatan" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-surface-container-lowest rounded-2xl p-4 md:p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)] border border-transparent hover:border-primary/10 transition-colors group">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <span className="material-symbols-outlined text-primary text-base md:text-xl">{card.icon}</span>
            </div>
          </div>
          <p className="text-tertiary text-[10px] md:text-xs font-semibold uppercase tracking-wider">{card.label}</p>
          <p className="text-xl md:text-3xl font-black text-on-surface font-headline tracking-tight mt-1">{card.value}</p>
          <p className="text-tertiary text-[10px] md:text-[11px] mt-1">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
