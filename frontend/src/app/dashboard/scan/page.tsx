import type { Metadata } from "next";
import ScanViewport from "@/components/scan/ScanViewport";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Scan Botol — EcoBottle",
  description:
    "Scan botol plastik Anda menggunakan AI detection dan dapatkan reward instan.",
};

export default function ScanPage() {
  return (
    <>
      {/* Header */}
      <PageHeader
        titleKey="scan_page_title"
        descKey="scan_page_desc"
        badgeIcon="bolt"
        badgeText="AI Ready"
      />

      <ScanViewport />
    </>
  );
}
