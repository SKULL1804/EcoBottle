"use client";

import { useState, useEffect } from "react";
import { txApi } from "@/lib/api";
import Link from "next/link";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  channel_code?: string;
  created_at: string;
}

export default function WalletTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    txApi.list(0, 6).then(({ status, data }) => {
      if (status === 200) setTransactions((data as { transactions: Transaction[] }).transactions || []);
    }).catch(() => { });
  }, []);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("id", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-on-surface font-headline">Transaksi Terakhir</h4>
        <Link href="/dashboard/history" className="text-primary text-xs font-bold hover:underline">Lihat Semua</Link>
      </div>

      {transactions.length === 0 ? (
        <p className="text-tertiary text-sm text-center py-8">Belum ada transaksi</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-transparent hover:border-primary/10 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "deposit" ? "bg-secondary-container text-primary"
                    : tx.type === "withdrawal" ? "bg-tertiary-fixed text-on-tertiary-container"
                      : "bg-surface-container-highest text-tertiary"
                  }`}>
                  <span className="material-symbols-outlined text-lg">
                    {tx.type === "deposit" ? "recycling" : "send"}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">
                    {tx.type === "deposit" ? "Setoran Botol" : `Withdraw${tx.channel_code ? ` ke ${tx.channel_code}` : ""}`}
                  </p>
                  <p className="text-tertiary text-[11px]">{formatDate(tx.created_at)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${tx.type === "deposit" ? "text-primary" : "text-error"}`}>
                  {tx.type === "deposit" ? "+" : "-"}Rp{Number(tx.amount).toLocaleString("id")}
                </p>
                <span className={`text-[10px] font-medium ${tx.status === "completed" ? "text-primary"
                    : tx.status === "pending" || tx.status === "processing" ? "text-tertiary"
                      : "text-error"
                  }`}>
                  {tx.status === "completed" ? "Berhasil" : tx.status === "pending" || tx.status === "processing" ? "Pending" : "Gagal"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
