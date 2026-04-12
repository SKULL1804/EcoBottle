"use client";

import { useState, useEffect } from "react";
import { statsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface LeaderEntry { rank: number; name: string; total_scans: number; }
interface LeaderboardData { leaderboard: LeaderEntry[]; user_rank: number; }

export default function Leaderboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [data, setData] = useState<LeaderboardData | null>(null);

  useEffect(() => {
    statsApi.leaderboard(10).then(({ status, data: d }) => {
      if (status === 200) setData(d as LeaderboardData);
    }).catch(() => { });
  }, []);

  const entries = data?.leaderboard || [];
  const userRank = data?.user_rank || 0;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-on-surface font-headline">{t("leaderboard") || "Leaderboard"}</h4>
        {userRank > 0 && <span className="text-tertiary text-xs font-medium">{t("your_rank") || "Peringkat kamu:"} #{userRank}</span>}
      </div>

      {entries.length === 0 ? (
        <p className="text-tertiary text-sm text-center py-8">{t("no_leaderboard_data") || "Belum ada data leaderboard"}</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => {
            const isUser = user && entry.name === user.name;
            return (
              <div key={entry.rank} className={`flex items-center gap-4 p-3.5 rounded-xl transition-colors ${isUser ? "bg-primary/10 border border-primary/20" : "bg-surface hover:bg-surface-container-low"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-black ${entry.rank === 1 ? "bg-primary text-on-primary"
                    : entry.rank === 2 ? "bg-primary-container/60 text-on-primary-container"
                      : entry.rank === 3 ? "bg-secondary-container text-on-secondary-container"
                        : "bg-surface-container text-tertiary"
                  }`}>
                  {entry.rank <= 3 ? (
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>
                      {entry.rank === 1 ? "emoji_events" : entry.rank === 2 ? "workspace_premium" : "military_tech"}
                    </span>
                  ) : entry.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${isUser ? "text-primary" : "text-on-surface"}`}>
                    {entry.name}{isUser && <span className="text-[10px] text-primary font-medium ml-2">({t("you") || "Kamu"})</span>}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-on-surface font-headline">{entry.total_scans}</span>
                  <span className="text-tertiary text-[10px] ml-1">{t("bottles") || "botol"}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
