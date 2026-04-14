"use client";

import { useState, useEffect } from "react";
import { txApi } from "@/lib/api";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  points_earned: number;
  status: string;
  created_at: string;
}

export default function RecentActivity() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { t, lang } = useLanguage();

  useEffect(() => {
    txApi.list(0, 5).then(({ status, data }) => {
      if (status === 200) {
        const d = data as { transactions: Transaction[] };
        setTransactions(d.transactions || []);
      }
    }).catch(() => { });
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === "id" ? "id" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <section className="md:col-span-4 lg:col-span-6 bg-surface-container-lowest rounded-xl p-5 md:p-8 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <div className="flex justify-between items-center mb-5 md:mb-8">
        <h4 className="text-base md:text-xl font-bold font-headline">{t("recent_activity")}</h4>
        <Link href="/dashboard/history" className="text-primary text-sm font-bold hover:underline">{t("view_all")}</Link>
      </div>

      {transactions.length === 0 ? (
        <p className="text-tertiary text-sm text-center py-8">{t("no_activity")}</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 md:p-4 bg-surface rounded-2xl border border-transparent hover:border-primary/10 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === "deposit" ? "bg-secondary-container text-primary" : "bg-surface-container-highest text-tertiary"}`}>
                  <span className="material-symbols-outlined text-lg">{tx.type === "deposit" ? "recycling" : "payments"}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-on-surface text-sm truncate">{tx.type === "deposit" ? t("bottle_deposit") : t("fund_withdrawal")}</p>
                  <p className="text-xs text-tertiary">{formatDate(tx.created_at)}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <p className={`font-bold text-sm ${tx.type === "deposit" ? "text-primary" : "text-error"}`}>
                  {tx.type === "deposit" ? "+" : "-"}Rp{Number(tx.amount).toLocaleString("id")}
                </p>
                <p className="text-[10px] text-tertiary capitalize">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
