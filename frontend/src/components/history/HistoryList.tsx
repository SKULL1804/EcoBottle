"use client";

import { useState, useEffect } from "react";
import { txApi } from "@/lib/api";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  points_earned: number;
  status: string;
  channel_code?: string;
  created_at: string;
}

const FILTERS = [
  { label: "Semua", value: "all", icon: "list" },
  { label: "Daur Ulang", value: "deposit", icon: "recycling" },
  { label: "Withdraw", value: "withdrawal", icon: "send" },
];

export default function HistoryList() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    txApi.list(0, 50).then(({ status, data }) => {
      if (status === 200) setTransactions((data as { transactions: Transaction[] }).transactions || []);
    }).catch(() => { }).finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === "all" ? transactions : transactions.filter(t => t.type === activeFilter);

  const totalDeposit = transactions.filter(t => t.type === "deposit").reduce((s, t) => s + Number(t.amount), 0);
  const totalWithdraw = transactions.filter(t => t.type === "withdrawal").reduce((s, t) => s + Number(t.amount), 0);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("id", { day: "numeric", month: "short", year: "numeric" });
  const formatRupiah = (val: number) => `Rp ${val.toLocaleString("id")}`;

  return (
    <>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {FILTERS.map((f) => (
          <button key={f.value} onClick={() => setActiveFilter(f.value)} className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeFilter === f.value ? "gradient-primary text-on-primary shadow-md shadow-primary/20" : "bg-surface-container text-tertiary hover:bg-surface-container-high"}`}>
            <span className="material-symbols-outlined text-base">{f.icon}</span>{f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm text-center">
          <p className="text-tertiary text-[11px] font-medium">Pemasukan</p>
          <p className="text-xl font-black text-primary font-headline">+{formatRupiah(totalDeposit)}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm text-center">
          <p className="text-tertiary text-[11px] font-medium">Withdraw</p>
          <p className="text-xl font-black text-error font-headline">-{formatRupiah(totalWithdraw)}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm text-center">
          <p className="text-tertiary text-[11px] font-medium">Total Transaksi</p>
          <p className="text-xl font-black text-on-surface font-headline">{transactions.length}</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-on-surface font-headline">{activeFilter === "all" ? "Semua Riwayat" : FILTERS.find(f => f.value === activeFilter)?.label ?? "Riwayat"}</h4>
          <span className="text-tertiary text-xs font-medium">{filtered.length} transaksi</span>
        </div>

        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-outline text-5xl mb-4 block">inbox</span>
            <p className="text-tertiary text-sm">Belum ada riwayat</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-transparent hover:border-primary/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${tx.type === "deposit" ? "bg-secondary-container text-primary"
                      : tx.type === "withdrawal" ? "bg-tertiary-fixed text-on-tertiary-container"
                        : "bg-surface-container-highest text-tertiary"
                    }`}>
                    <span className="material-symbols-outlined text-lg">{tx.type === "deposit" ? "recycling" : "send"}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-on-surface text-sm truncate">
                      {tx.type === "deposit" ? "Setoran Botol" : `Withdraw${tx.channel_code ? ` ke ${tx.channel_code}` : ""}`}
                    </p>
                    <p className="text-tertiary text-[11px] truncate">{tx.points_earned > 0 ? `+${tx.points_earned} poin` : tx.status}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className={`font-bold text-sm ${tx.type === "deposit" ? "text-primary" : "text-error"}`}>
                    {tx.type === "deposit" ? "+" : "-"}Rp{Number(tx.amount).toLocaleString("id")}
                  </p>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-tertiary text-[10px]">{formatDate(tx.created_at)}</span>
                    {(tx.status === "pending" || tx.status === "processing") && <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
