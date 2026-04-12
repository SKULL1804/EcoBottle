"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function WalletBalance() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const balance = user?.balance || 0;

  return (
    <div className="bg-linear-to-br from-on-primary-container to-primary rounded-2xl p-8 text-on-primary shadow-xl relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary-fixed/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-surface-container-lowest/5 rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-surface-container-lowest/15 rounded-xl backdrop-blur-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>account_balance_wallet</span>
            </div>
            <div>
              <p className="text-primary-fixed/70 text-xs font-medium">EcoBottle Wallet</p>
              <p className="text-primary-fixed text-xs">{user?.level_title || "Pemula"}</p>
            </div>
          </div>
          <span className="bg-surface-container-lowest/15 backdrop-blur-sm text-primary-fixed px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">{t("active")}</span>
        </div>

        <p className="text-primary-fixed/60 text-sm font-medium mb-1">{t("total_balance")}</p>
        <h2 className="text-5xl font-black font-headline tracking-tighter mb-8">
          Rp {Number(balance).toLocaleString("id")}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/dashboard/withdraw" className="py-3 bg-surface-container-lowest text-primary font-bold rounded-xl text-sm hover:scale-[1.03] active:scale-[0.97] transition-transform shadow-lg text-center flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">payments</span>
            {t("withdraw")}
          </Link>
          <Link href="/dashboard/history" className="py-3 bg-surface-container-lowest/15 backdrop-blur-sm text-on-primary font-bold rounded-xl text-sm hover:bg-surface-container-lowest/25 transition-all text-center flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">history</span>
            {t("history")}
          </Link>
        </div>
      </div>
    </div>
  );
}
