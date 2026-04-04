import type { Metadata } from "next";
import ScanViewport from "@/components/scan/ScanViewport";

export const metadata: Metadata = {
  title: "Scan Botol — EcoBottle",
  description:
    "Scan botol plastik Anda menggunakan AI detection dan dapatkan reward instan.",
};

export default function ScanPage() {
  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-background font-headline">
            Scan Botol
          </h2>
          <p className="text-tertiary">
            Arahkan botol ke kamera untuk deteksi AI
          </p>
        </div>
        <div className="flex items-center gap-2 bg-secondary-container px-4 py-2 rounded-full">
          <span
            className="material-symbols-outlined text-primary text-lg"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            bolt
          </span>
          <span className="text-on-secondary-container text-sm font-bold">
            AI Ready
          </span>
        </div>
      </header>

      <ScanViewport />
    </>
  );
}
