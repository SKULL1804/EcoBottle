"use client";

import { useState } from "react";
import { HISTORY_FILTERS, HISTORY_ENTRIES } from "@/constants/history";

export default function HistoryList() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? HISTORY_ENTRIES
      : HISTORY_ENTRIES.filter((e) => e.category === activeFilter);

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {HISTORY_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeFilter === f.value
                ? "gradient-primary text-on-primary shadow-md shadow-primary/20"
                : "bg-surface-container text-tertiary hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {f.icon}
            </span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm text-center">
          <p className="text-tertiary text-[11px] font-medium">Pemasukan</p>
          <p className="text-xl font-black text-primary font-headline">
            +Rp 4.550
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm text-center">
          <p className="text-tertiary text-[11px] font-medium">Pengeluaran</p>
          <p className="text-xl font-black text-error font-headline">
            -Rp 15.000
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm text-center">
          <p className="text-tertiary text-[11px] font-medium">Withdraw</p>
          <p className="text-xl font-black text-on-tertiary-container font-headline">
            -Rp 60.000
          </p>
        </div>
      </div>

      {/* Entries List */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-on-surface font-headline">
            {activeFilter === "all"
              ? "Semua Riwayat"
              : HISTORY_FILTERS.find((f) => f.value === activeFilter)?.label ??
                "Riwayat"}
          </h4>
          <span className="text-tertiary text-xs font-medium">
            {filtered.length} transaksi
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-outline text-5xl mb-4 block">
              inbox
            </span>
            <p className="text-tertiary text-sm">Belum ada riwayat</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-surface rounded-xl border border-transparent hover:border-primary/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                      entry.category === "recycle"
                        ? "bg-secondary-container text-primary"
                        : entry.category === "withdraw"
                          ? "bg-tertiary-fixed text-on-tertiary-container"
                          : "bg-surface-container-highest text-tertiary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {entry.icon}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-on-surface text-sm truncate">
                      {entry.label}
                    </p>
                    <p className="text-tertiary text-[11px] truncate">
                      {entry.description}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p
                    className={`font-bold text-sm ${
                      entry.type === "credit" ? "text-primary" : "text-error"
                    }`}
                  >
                    {entry.amount}
                  </p>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-tertiary text-[10px]">
                      {entry.date}
                    </span>
                    {entry.status === "pending" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse" />
                    )}
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
