"use client";

import { useState, useRef, useEffect } from "react";
import { txApi } from "@/lib/api";

type ExportFormat = "pdf" | "excel";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  points_earned: number;
  status: string;
  channel_code?: string;
  created_at: string;
}

export default function ExportButton() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchTransactions = async (): Promise<Transaction[]> => {
    const { status, data } = await txApi.list(0, 100);
    if (status === 200) return (data as { transactions: Transaction[] }).transactions || [];
    return [];
  };

  const handleExport = async (format: ExportFormat) => {
    setExporting(format);
    setShowDropdown(false);

    const entries = await fetchTransactions();

    if (format === "excel") exportExcel(entries);
    else exportPDF(entries);

    setTimeout(() => setExporting(null), 1000);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("id", { day: "numeric", month: "short", year: "numeric" });
  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString("id", { hour: "2-digit", minute: "2-digit" });
  const formatRupiah = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;
  const typeLabel = (t: string) => t === "deposit" ? "Daur Ulang" : "Withdraw";

  const exportExcel = (entries: Transaction[]) => {
    const headers = ["No", "Tanggal", "Waktu", "Deskripsi", "Kategori", "Jumlah", "Status"];
    const rows = entries.map((e, i) => [
      i + 1,
      formatDate(e.created_at),
      formatTime(e.created_at),
      e.type === "deposit" ? "Setoran Botol" : `Withdraw${e.channel_code ? ` ke ${e.channel_code}` : ""}`,
      typeLabel(e.type),
      `${e.type === "deposit" ? "+" : "-"}${formatRupiah(Number(e.amount))}`,
      e.status === "completed" ? "Selesai" : e.status === "pending" || e.status === "processing" ? "Pending" : "Gagal",
    ]);

    const BOM = "\uFEFF";
    const csvContent = BOM + [headers, ...rows].map(row => row.map(cell => {
      const str = String(cell);
      return str.includes(",") || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, "EcoBottle_Riwayat_Transaksi.csv");
  };

  const exportPDF = (entries: Transaction[]) => {
    const totalIncome = entries.filter(e => e.type === "deposit").reduce((s, e) => s + Number(e.amount), 0);
    const totalExpense = entries.filter(e => e.type === "withdrawal").reduce((s, e) => s + Number(e.amount), 0);

    const tableRows = entries.map((e, i) => `
      <tr style="border-bottom: 1px solid #e8e8e8;">
        <td style="padding: 10px 8px; text-align: center; font-size: 12px;">${i + 1}</td>
        <td style="padding: 10px 8px; font-size: 12px;">${formatDate(e.created_at)}</td>
        <td style="padding: 10px 8px; font-size: 12px;">${formatTime(e.created_at)}</td>
        <td style="padding: 10px 8px; font-size: 12px; font-weight: 600;">${e.type === "deposit" ? "Setoran Botol" : `Withdraw${e.channel_code ? ` ke ${e.channel_code}` : ""}`}</td>
        <td style="padding: 10px 8px; font-size: 12px;">${typeLabel(e.type)}</td>
        <td style="padding: 10px 8px; font-size: 12px; font-weight: 700; color: ${e.type === "deposit" ? "#16a34a" : "#dc2626"};">${e.type === "deposit" ? "+" : "-"}${formatRupiah(Number(e.amount))}</td>
        <td style="padding: 10px 8px; font-size: 12px;">
          <span style="padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; background: ${e.status === "completed" ? "#dcfce7" : "#fef3c7"}; color: ${e.status === "completed" ? "#166534" : "#92400e"};">
            ${e.status === "completed" ? "Selesai" : "Pending"}
          </span>
        </td>
      </tr>`).join("");

    const htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>EcoBottle - Riwayat Transaksi</title>
      <style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 40px; color: #1a1a1a; } @media print { body { padding: 20px; } }</style>
      </head><body>
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 8px;">
          <div><h1 style="font-size: 22px; font-weight: 800; color: #1b5e20;">EcoBottle</h1><p style="font-size: 11px; color: #888;">Riwayat Transaksi</p></div>
        </div>
        <div style="display: flex; gap: 8px; margin-bottom: 24px; font-size: 11px; color: #666;">
          <span>Diekspor: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span><span>•</span><span>${entries.length} transaksi</span>
        </div>
        <div style="display: flex; gap: 16px; margin-bottom: 24px;">
          <div style="flex: 1; padding: 16px; background: #f0fdf4; border-radius: 8px; text-align: center;">
            <p style="font-size: 10px; color: #666; margin-bottom: 4px;">Total Pemasukan</p>
            <p style="font-size: 18px; font-weight: 800; color: #16a34a;">+${formatRupiah(totalIncome)}</p>
          </div>
          <div style="flex: 1; padding: 16px; background: #fef2f2; border-radius: 8px; text-align: center;">
            <p style="font-size: 10px; color: #666; margin-bottom: 4px;">Total Pengeluaran</p>
            <p style="font-size: 18px; font-weight: 800; color: #dc2626;">-${formatRupiah(totalExpense)}</p>
          </div>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead><tr style="background: #1b5e20; color: white;">
            <th style="padding: 10px 8px; text-align: center; font-size: 11px;">No</th>
            <th style="padding: 10px 8px; text-align: left; font-size: 11px;">Tanggal</th>
            <th style="padding: 10px 8px; text-align: left; font-size: 11px;">Waktu</th>
            <th style="padding: 10px 8px; text-align: left; font-size: 11px;">Deskripsi</th>
            <th style="padding: 10px 8px; text-align: left; font-size: 11px;">Kategori</th>
            <th style="padding: 10px 8px; text-align: left; font-size: 11px;">Jumlah</th>
            <th style="padding: 10px 8px; text-align: left; font-size: 11px;">Status</th>
          </tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 10px; color: #aaa; text-align: center;">
          Dokumen ini digenerate otomatis oleh EcoBottle Dashboard
        </div>
        <script>window.onload = () => window.print();</script>
      </body></html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) { printWindow.document.write(htmlContent); printWindow.document.close(); }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 bg-surface-container-high px-4 py-2.5 rounded-full text-on-surface text-sm font-bold hover:bg-surface-container-highest transition-colors">
        <span className="material-symbols-outlined text-lg">{exporting ? "hourglass_top" : "download"}</span>
        {exporting ? (exporting === "pdf" ? "Exporting PDF..." : "Exporting Excel...") : "Export"}
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 bg-surface-container-lowest rounded-xl shadow-[0px_24px_48px_rgba(17,28,45,0.12)] border border-outline-variant/10 overflow-hidden z-50 min-w-[200px]">
          <button onClick={() => handleExport("pdf")} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface-container-low transition-colors text-left group">
            <div className="w-9 h-9 rounded-lg bg-error/10 flex items-center justify-center group-hover:bg-error/15 transition-colors"><span className="material-symbols-outlined text-error text-lg">picture_as_pdf</span></div>
            <div><p className="font-bold text-on-surface text-sm">Export PDF</p><p className="text-tertiary text-[10px]">Cetak atau simpan sebagai PDF</p></div>
          </button>
          <div className="border-t border-outline-variant/10" />
          <button onClick={() => handleExport("excel")} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface-container-low transition-colors text-left group">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors"><span className="material-symbols-outlined text-primary text-lg">table_chart</span></div>
            <div><p className="font-bold text-on-surface text-sm">Export Excel</p><p className="text-tertiary text-[10px]">Unduh sebagai file CSV</p></div>
          </button>
        </div>
      )}
    </div>
  );
}
