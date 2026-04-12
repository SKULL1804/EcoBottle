"use client";

import { useState, useEffect } from "react";
import { statsApi } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  earned_at: string;
}

const ALL_ACHIEVEMENTS = [
  { icon: "emoji_events", title: "First Bottle", description: "Scan botol pertama Anda" },
  { icon: "local_fire_department", title: "10 Bottles", description: "Kumpulkan total 10 botol" },
  { icon: "military_tech", title: "50 Bottles Club", description: "Kumpulkan total 50 botol" },
  { icon: "diamond", title: "100 Bottles", description: "Kumpulkan total 100 botol" },
  { icon: "public", title: "Eco Warrior", description: "Kumpulkan total 500 botol" },
  { icon: "workspace_premium", title: "Top Recycler", description: "Masuk 10 besar leaderboard" },
];

export default function AchievementGrid() {
  const { t } = useLanguage();
  const [earned, setEarned] = useState<Achievement[]>([]);

  useEffect(() => {
    statsApi.achievements().then(({ status, data }) => {
      if (status === 200) setEarned(data as Achievement[]);
    }).catch(() => { });
  }, []);

  const earnedTitles = new Set(earned.map(a => a.title));

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-on-surface font-headline">{t("achievements") || "Achievements"}</h4>
        <span className="text-tertiary text-xs font-medium">{earned.length}/{ALL_ACHIEVEMENTS.length} {t("unlocked") || "Unlocked"}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ALL_ACHIEVEMENTS.map((ach) => {
          const unlocked = earnedTitles.has(ach.title);
          return (
            <div key={ach.title} className={`p-4 rounded-xl text-center transition-all ${unlocked ? "bg-secondary-container/50 border border-primary/10" : "bg-surface-container opacity-50"}`}>
              <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${unlocked ? "bg-primary text-on-primary shadow-md shadow-primary/20" : "bg-surface-container-high text-outline"}`}>
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: unlocked ? '"FILL" 1' : '"FILL" 0' }}>{unlocked ? ach.icon : "lock"}</span>
              </div>
              <p className={`text-xs font-bold ${unlocked ? "text-on-surface" : "text-tertiary"}`}>
                {t(`ach_${ach.title.toLowerCase().replace(/ /g, "_")}`) || ach.title}
              </p>
              <p className="text-tertiary text-[10px] mt-1">
                {t(`ach_${ach.title.toLowerCase().replace(/ /g, "_")}_desc`) || ach.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
