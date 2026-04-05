import type { Metadata } from "next";
import HistoryList from "@/components/history/HistoryList";
import ExportButton from "@/components/history/ExportButton";

export const metadata: Metadata = {
  title: "Riwayat — EcoBottle",
  description:
    "Lihat seluruh riwayat transaksi daur ulang, penukaran voucher, dan penarikan saldo.",
};

export default function HistoryPage() {
  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-background font-headline">
            Riwayat
          </h2>
          <p className="text-tertiary">
            Seluruh transaksi & aktivitas akun Anda
          </p>
        </div>
        <ExportButton />
      </header>

      <HistoryList />
    </>
  );
}

