"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { statsApi } from "@/lib/api";

export default function QuickStats() {
  const { user } = useAuth();
  const [achCount, setAchCount] = useState(0);

  useEffect(() => {
    statsApi.me().then(({ status, data }) => {
      if (status === 200) setAchCount((data as { achievements_count: number }).achievements_count || 0);
    }).catch(() => { });
  }, []);

  const stats = [
    { icon: "recycling", label: "Total Botol", value: `${user?.total_scans ?? 0}` },
    { icon: "savings", label: "Total Earned", value: `Rp ${(user?.balance ?? 0).toLocaleString("id")}` },
    { icon: "stars", label: "Poin", value: `${(user?.points ?? 0).toLocaleString("id")}` },
    { icon: "emoji_events", label: "Badges", value: `${achCount}/6` },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <h4 className="font-bold text-on-surface font-headline mb-4">Ringkasan</h4>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="p-4 bg-surface rounded-xl text-center">
            <span className="material-symbols-outlined text-primary text-2xl mb-2 block" style={{ fontVariationSettings: '"FILL" 1' }}>{s.icon}</span>
            <p className="text-xl font-black text-on-surface font-headline">{s.value}</p>
            <p className="text-tertiary text-[11px] font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
