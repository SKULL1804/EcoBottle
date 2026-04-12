import type { Metadata } from "next";
import HistoryList from "@/components/history/HistoryList";
import ExportButton from "@/components/history/ExportButton";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Riwayat — EcoBottle",
  description:
    "Lihat seluruh riwayat transaksi daur ulang, penukaran voucher, dan penarikan saldo.",
};

export default function HistoryPage() {
  return (
    <>
      {/* Header */}
      <PageHeader
        titleKey="history_page_title"
        descKey="history_page_desc"
        rightElement={<ExportButton />}
      />

      <HistoryList />
    </>
  );
}

