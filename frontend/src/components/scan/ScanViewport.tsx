"use client";

import { useState } from "react";

/** Detected bottle result type. */
interface DetectedBottle {
  type: string;
  material: string;
  condition: string;
  reward: string;
  confidence: number;
}

const MOCK_HISTORY: DetectedBottle[] = [
  {
    type: "PET 600ml",
    material: "Plastik PET",
    condition: "Bersih",
    reward: "Rp 500",
    confidence: 99,
  },
  {
    type: "PET 1.5L",
    material: "Plastik PET",
    condition: "Bersih",
    reward: "Rp 750",
    confidence: 97,
  },
];

export default function ScanViewport() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<DetectedBottle | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    setResult(null);

    // Simulate AI scanning
    setTimeout(() => {
      setIsScanning(false);
      setResult({
        type: "PET 600ml",
        material: "Plastik PET",
        condition: "Bersih",
        reward: "Rp 500",
        confidence: 99.2,
      });
    }, 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* ─── Scanner Area (3 cols) ─── */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        {/* Scanner Viewport */}
        <div className="bg-gradient-to-br from-on-primary-container to-primary rounded-2xl p-1 shadow-xl">
          <div className="bg-on-primary-container/90 rounded-xl overflow-hidden relative aspect-[4/3] flex items-center justify-center">
            {/* Corner brackets */}
            <div className="absolute top-6 left-6 w-12 h-12 border-t-3 border-l-3 border-primary-fixed rounded-tl-xl" />
            <div className="absolute top-6 right-6 w-12 h-12 border-t-3 border-r-3 border-primary-fixed rounded-tr-xl" />
            <div className="absolute bottom-6 left-6 w-12 h-12 border-b-3 border-l-3 border-primary-fixed rounded-bl-xl" />
            <div className="absolute bottom-6 right-6 w-12 h-12 border-b-3 border-r-3 border-primary-fixed rounded-br-xl" />

            {/* Scan line animation */}
            {isScanning && (
              <div className="absolute inset-x-8 h-0.5 bg-primary-fixed animate-scan-line" />
            )}

            {/* Center content */}
            <div className="text-center z-10">
              {!isScanning && !result && (
                <>
                  <span className="material-symbols-outlined text-primary-fixed text-7xl mb-4 block opacity-60">
                    qr_code_scanner
                  </span>
                  <p className="text-primary-fixed/70 text-sm font-medium">
                    Arahkan kamera ke botol
                  </p>
                </>
              )}

              {isScanning && (
                <>
                  <div className="w-16 h-16 border-4 border-primary-fixed/30 border-t-primary-fixed rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-primary-fixed text-sm font-bold tracking-wide animate-pulse">
                    Mendeteksi botol...
                  </p>
                </>
              )}

              {result && (
                <div className="animate-in">
                  <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-container/30">
                    <span
                      className="material-symbols-outlined text-on-primary text-3xl"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      check_circle
                    </span>
                  </div>
                  <p className="text-primary-fixed font-bold text-lg">
                    Botol Terdeteksi!
                  </p>
                  <p className="text-primary-fixed/60 text-xs mt-1">
                    Confidence: {result.confidence}%
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scan button */}
        <button
          onClick={handleScan}
          disabled={isScanning}
          className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
            isScanning
              ? "bg-surface-container-high text-tertiary cursor-wait"
              : "gradient-primary text-on-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            {isScanning ? "hourglass_top" : "center_focus_strong"}
          </span>
          {isScanning ? "Sedang Memindai..." : "Mulai Scan"}
        </button>
      </div>

      {/* ─── Right Panel (2 cols) ─── */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Detection Result Card */}
        {result && (
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)] border border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-primary-container/20 rounded-xl">
                <span className="material-symbols-outlined text-primary text-2xl">
                  eco
                </span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface font-headline">
                  Hasil Deteksi
                </h4>
                <p className="text-tertiary text-xs">AI Detection Report</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-surface rounded-xl">
                <span className="text-tertiary text-sm">Tipe</span>
                <span className="font-bold text-on-surface text-sm">
                  {result.type}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface rounded-xl">
                <span className="text-tertiary text-sm">Material</span>
                <span className="font-bold text-on-surface text-sm">
                  {result.material}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface rounded-xl">
                <span className="text-tertiary text-sm">Kondisi</span>
                <span className="font-bold text-primary text-sm">
                  {result.condition}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-secondary-container rounded-xl">
                <span className="text-on-secondary-container text-sm font-medium">
                  Reward
                </span>
                <span className="font-black text-primary text-xl font-headline">
                  {result.reward}
                </span>
              </div>
            </div>

            <button className="w-full mt-6 py-4 gradient-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform">
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">add_circle</span>
                Klaim Reward
              </span>
            </button>
          </div>
        )}

        {/* Instructions Card (show when no result) */}
        {!result && (
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
            <h4 className="font-bold text-on-surface font-headline mb-4">
              Cara Scan
            </h4>
            <div className="space-y-4">
              {[
                {
                  icon: "photo_camera",
                  title: "Arahkan Kamera",
                  desc: "Posisikan botol di dalam area viewfinder",
                },
                {
                  icon: "center_focus_strong",
                  title: "AI Deteksi",
                  desc: "Sistem akan mendeteksi tipe & kondisi botol",
                },
                {
                  icon: "account_balance_wallet",
                  title: "Terima Reward",
                  desc: "Saldo otomatis masuk ke wallet Anda",
                },
              ].map((step, i) => (
                <div key={step.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-xl">
                      {step.icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-sm">
                      {i + 1}. {step.title}
                    </p>
                    <p className="text-tertiary text-xs">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scan Stats */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-on-surface font-headline">
              Statistik Hari Ini
            </h4>
            <span className="text-primary text-xs font-bold bg-primary/10 px-2.5 py-1 rounded-full">
              Live
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-primary font-headline">
                3
              </p>
              <p className="text-tertiary text-xs font-medium mt-1">
                Botol Scan
              </p>
            </div>
            <div className="bg-surface rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-primary font-headline">
                Rp 1.750
              </p>
              <p className="text-tertiary text-xs font-medium mt-1">
                Total Reward
              </p>
            </div>
          </div>
        </div>

        {/* Recent Scans */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
          <h4 className="font-bold text-on-surface font-headline mb-4">
            Riwayat Scan
          </h4>
          <div className="space-y-3">
            {MOCK_HISTORY.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-surface rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-lg">
                      recycling
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-sm">
                      {item.type}
                    </p>
                    <p className="text-tertiary text-[10px]">
                      {item.condition} • {item.confidence}%
                    </p>
                  </div>
                </div>
                <span className="font-bold text-primary text-sm">
                  +{item.reward}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
