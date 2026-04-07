"use client";

import { useState, useEffect } from "react";
import { txApi } from "@/lib/api";

interface Channel { code: string; name: string; channel_category: string; }

export default function PaymentMethods() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    txApi.channels().then(({ status, data }) => {
      if (status === 200) setChannels(data as Channel[]);
    }).catch(() => { });
  }, []);

  const iconMap: Record<string, string> = {
    ID_OVO: "payments", ID_GOPAY: "account_balance", ID_DANA: "credit_card",
    ID_SHOPEEPAY: "shopping_bag", ID_LINKAJA: "link", PH_GCASH: "phone_android",
  };

  const displayedChannels = isExpanded ? channels : channels.slice(0, 3);

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-on-surface font-headline">Metode Pencairan</h4>
        <span className="text-tertiary text-xs font-medium">{channels.length} tersedia</span>
      </div>

      {channels.length === 0 ? (
        <p className="text-tertiary text-sm text-center py-6">Memuat...</p>
      ) : (
        <div className="space-y-3">
          {displayedChannels.map((ch) => (
            <div key={ch.code} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-transparent hover:border-outline-variant/15 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-secondary-container text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">{iconMap[ch.code] || "account_balance_wallet"}</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">{ch.name}</p>
                  <p className="text-[11px] text-tertiary capitalize">{ch.channel_category?.replace("_", " ") || "e-wallet"}</p>
                </div>
              </div>
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full">Tersedia</span>
            </div>
          ))}

          {channels.length > 3 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full py-3 mt-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors border border-transparent hover:border-primary/10"
            >
              {isExpanded ? "Tampilkan Lebih Sedikit" : "Lihat Semua Metode"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
