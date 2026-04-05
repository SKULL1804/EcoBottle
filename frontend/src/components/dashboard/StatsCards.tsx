"use client";

import { useAuth } from "@/context/AuthContext";

const LEVEL_THRESHOLDS = [0, 10, 50, 100, 500];

export default function StatsCards() {
  const { user } = useAuth();
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
            <p className="text-tertiary text-xs font-semibold">Total Botol</p>
            <h4 className="text-2xl font-black text-on-surface font-headline">{totalScans} Botol</h4>
          </div>
        </div>
        <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
          <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 text-[10px] text-tertiary font-medium">
          {remaining > 0 ? `${remaining} botol lagi ke level berikutnya` : "Level maksimum tercapai! 🏆"}
        </p>
      </section>

      <section className="md:col-span-2 lg:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)] flex flex-col justify-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-container/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">stars</span>
          </div>
          <div>
            <p className="text-tertiary text-xs font-semibold">Total Poin</p>
            <h4 className="text-2xl font-black text-on-surface font-headline">{(user?.points || 0).toLocaleString("id")} Poin</h4>
          </div>
        </div>
        <div className="mt-4 p-3 bg-surface rounded-xl">
          <p className="text-tertiary text-[10px] font-medium">{user?.level_title || "🌱 Pemula"} • Level {level}</p>
        </div>
      </section>
    </>
  );
}
