"use client";

import { MONTHLY_TREND } from "@/constants/stats";
import { useLanguage } from "@/context/LanguageContext";

export default function MonthlyTrend() {
  const { t } = useLanguage();
  const maxBottles = Math.max(...MONTHLY_TREND.map((d) => d.bottles));

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="font-bold text-on-surface font-headline">
            {t("monthly_trend") || "Tren Bulanan"}
          </h4>
          <p className="text-tertiary text-xs mt-0.5">{t("last_6_months") || "6 bulan terakhir"}</p>
        </div>
        <span className="text-primary text-xs font-bold bg-primary/10 px-2.5 py-1 rounded-full">
          +67%
        </span>
      </div>

      {/* Line-style chart using horizontal bars */}
      <div className="space-y-3">
        {MONTHLY_TREND.map((d) => {
          const widthPct = (d.bottles / maxBottles) * 100;
          return (
            <div key={d.month} className="flex items-center gap-3">
              <span className="text-tertiary text-xs font-medium w-8 shrink-0">
                {d.month}
              </span>
              <div className="flex-1 h-7 bg-surface-container rounded-lg overflow-hidden relative">
                <div
                  className="h-full rounded-lg transition-all duration-700 ease-out flex items-center justify-end pr-2"
                  style={{
                    width: `${widthPct}%`,
                    background:
                      widthPct === 100
                        ? "linear-gradient(to right, var(--color-primary), var(--color-primary-container))"
                        : `color-mix(in srgb, var(--color-primary) ${Math.max(25, widthPct)}%, var(--color-surface-container-high))`,
                  }}
                >
                  <span className="text-[10px] font-bold text-on-primary-container">
                    {d.bottles}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
