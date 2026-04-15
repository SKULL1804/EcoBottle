"use client";

import Link from "next/link";
import { WITHDRAW_OPTIONS } from "@/constants/wallet";
import { useLanguage } from "@/context/LanguageContext";

export default function WithdrawCard() {
  const { t } = useLanguage();

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <h4 className="font-bold text-on-surface font-headline mb-4">
        {t("withdraw_title")}
      </h4>
      <p className="text-tertiary text-xs mb-6">
        {t("withdraw_subtitle")}
      </p>

      <div className="space-y-3">
        {WITHDRAW_OPTIONS.map((opt) => (
          <div
            key={opt.label}
            className="flex items-center justify-between p-4 bg-surface rounded-xl border border-transparent hover:border-primary/15 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <span className="material-symbols-outlined text-primary text-xl">
                  {opt.icon}
                </span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-sm">{opt.label}</p>
                <p className="text-tertiary text-[11px]">{opt.duration}</p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-xs font-bold ${
                  opt.fee === "Gratis" ? "text-primary" : "text-tertiary"
                }`}
              >
                {opt.fee}
              </p>
              <span className="material-symbols-outlined text-outline text-sm group-hover:text-primary transition-colors">
                arrow_forward
              </span>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/dashboard/withdraw"
        className="mt-4 w-full py-3 gradient-primary text-on-primary font-bold rounded-xl text-sm shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-lg">send</span>
        {t("withdraw_now")}
      </Link>
    </div>
  );
}
