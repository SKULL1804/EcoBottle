"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

const LEVEL_THRESHOLDS = [0, 10, 50, 100, 500];

export default function StatsCards() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const totalScans = user?.total_scans || 0;
  const level = user?.level || 1;
  const nextThreshold = LEVEL_THRESHOLDS[level] || 999;
  const prevThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const progress = nextThreshold > prevThreshold
    ? Math.min(((totalScans - prevThreshold) / (nextThreshold - prevThreshold)) * 100, 100)
    : 100;
  const remaining = Math.max(nextThreshold - totalScans, 0);

  return (
    <>
      <section className="md:col-span-2 lg:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)] flex flex-col justify-center border border-transparent hover:border-primary/20 transition-colors">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary-container/50 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">eco</span>
          </div>
          <div>
            <p className="text-tertiary text-xs font-semibold">{t("total_bottles")}</p>
            <h4 className="text-2xl font-black text-on-surface font-headline">{totalScans} {t("bottles")}</h4>
          </div>
        </div>
        <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
          <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 text-[10px] text-tertiary font-medium flex items-center">
          {remaining > 0 ? `${remaining} ${t("bottles_to_next")}` : (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-primary">emoji_events</span>
              {t("max_level")}
            </span>
          )}
        </div>
      </section>

      <section className="md:col-span-2 lg:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)] flex flex-col justify-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-container/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">stars</span>
          </div>
          <div>
            <p className="text-tertiary text-xs font-semibold">{t("total_points")}</p>
            <h4 className="text-2xl font-black text-on-surface font-headline">{(user?.points || 0).toLocaleString("id")} {t("points")}</h4>
          </div>
        </div>
        <div className="mt-4 p-3 bg-surface rounded-xl">
          <div className="flex items-center gap-1.5 text-tertiary text-[10px] font-medium">
            <span className="material-symbols-outlined text-sm text-primary">psychiatry</span>
            {user?.level_title || t("starter") || "Pemula"} • {t("level")} {level}
          </div>
        </div>
      </section>
    </>
  );
}
