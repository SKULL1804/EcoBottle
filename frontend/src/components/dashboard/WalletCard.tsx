"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function WalletCard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const balance = user?.balance || 0;

  return (
    <section className="md:col-span-4 lg:col-span-3 bg-surface-container-lowest rounded-xl p-5 md:p-8 flex flex-col justify-between shadow-[0px_24px_48px_rgba(17,28,45,0.06)] overflow-hidden relative group">
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl transition-all group-hover:bg-primary/10" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-5 md:mb-8">
          <div className="p-2.5 md:p-3 bg-secondary-container rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">account_balance_wallet</span>
          </div>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold font-headline tracking-wide">{t("active_wallet")}</span>
        </div>
        <p className="text-tertiary text-sm font-medium mb-1">{t("available_balance")}</p>
        <h3 className="text-3xl md:text-5xl font-black text-on-surface mb-5 md:mb-8 tracking-tighter font-headline">
          Rp {Number(balance).toLocaleString("id")}
        </h3>
      </div>

      <div className="flex gap-3 relative z-10">
        <Link href="/dashboard/wallet" className="flex-1 py-3 md:py-4 gradient-primary text-on-primary font-bold rounded-full text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-200 text-center">
          {t("withdraw")}
        </Link>
        <Link href="/dashboard/history" className="px-4 md:px-6 py-3 md:py-4 bg-surface-container-high text-on-surface font-bold rounded-full text-sm hover:bg-surface-container-highest transition-colors text-center">
          {t("history")}
        </Link>
      </div>
    </section>
  );
}
