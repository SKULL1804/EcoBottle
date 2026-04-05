"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { scanApi } from "@/lib/api";
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType, NotFoundException } from "@zxing/library";

type ScanState = "IDLE" | "SCANNING" | "READY" | "CONFIRMING" | "CONFIRMED";

interface BBox { x1: number; y1: number; x2: number; y2: number; }
interface Detection { bbox: BBox; class: string; label: string; type: string; confidence: number; }
interface PreviewResult { detections: Detection[]; total_items: number; }
interface AnalyzeResult { scan_id: string; detected: { brand: string; type: string; quantity: number; subtotal: number; confidence: number }[]; total_items: number; total_value: number; barcode?: string; }
interface ConfirmResult { message: string; balance_added: number; points_earned: number; new_balance: number; new_points: number; gamification?: { level: number; level_title: string; new_achievements: { title: string; icon: string; description: string }[]; level_up: boolean; }; }

export default function ScanViewport() {
  const { refreshUser } = useAuth();
  const [state, setState] = useState<ScanState>("IDLE");
  const [detections, setDetections] = useState<Detection[]>([]);
  const [bottleDetected, setBottleDetected] = useState(false);
  const [barcodeResult, setBarcodeResult] = useState<string | null>(null);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [confirmResult, setConfirmResult] = useState<ConfirmResult | null>(null);
  const [error, setError] = useState("");
  const [statusText, setStatusText] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastFrameRef = useRef<Blob | null>(null);
  const barcodeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const barcodeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch { setError("Gagal mengakses kamera. Pastikan izin kamera diberikan."); }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (barcodeIntervalRef.current) clearInterval(barcodeIntervalRef.current);
      stopCamera();
    };
  }, [stopCamera]);

  const drawBoxes = useCallback((dets: Detection[]) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const d of dets) {
      const x = d.bbox.x1 * canvas.width, y = d.bbox.y1 * canvas.height;
      const w = (d.bbox.x2 - d.bbox.x1) * canvas.width, h = (d.bbox.y2 - d.bbox.y1) * canvas.height;
      ctx.strokeStyle = "#10b981"; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, h);
      const corner = 14; ctx.lineWidth = 4; ctx.strokeStyle = "#6ffbbe";
      ctx.beginPath(); ctx.moveTo(x, y + corner); ctx.lineTo(x, y); ctx.lineTo(x + corner, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + w - corner, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + corner); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y + h - corner); ctx.lineTo(x, y + h); ctx.lineTo(x + corner, y + h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + w - corner, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - corner); ctx.stroke();
      const label = `${d.label} ${Math.round(d.confidence * 100)}%`;
      ctx.font = "bold 13px Inter, sans-serif";
      const metrics = ctx.measureText(label);
      ctx.fillStyle = "rgba(16, 185, 129, 0.85)"; ctx.fillRect(x, y - 22, metrics.width + 12, 22);
      ctx.fillStyle = "#ffffff"; ctx.fillText(label, x + 6, y - 6);
    }
  }, []);

  const captureFrame = useCallback((): Promise<Blob | null> => {
    return new Promise(resolve => {
      const video = videoRef.current;
      if (!video || !video.videoWidth) { resolve(null); return; }
      const c = document.createElement("canvas");
      c.width = video.videoWidth; c.height = video.videoHeight;
      c.getContext("2d")!.drawImage(video, 0, 0);
      c.toBlob(blob => resolve(blob), "image/jpeg", 0.8);
    });
  }, []);

  // --- Barcode scanning (client-side ZXing) ---
  const startBarcodeScanner = useCallback(() => {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.UPC_A, BarcodeFormat.CODE_128,
    ]);
    const reader = new BrowserMultiFormatReader(hints);
    barcodeReaderRef.current = reader;

    // decodeOnceFromStream continuously scans frames until a barcode is found, then resolves
    (async () => {
      if (!streamRef.current || !videoRef.current) return;
      try {
        const result = await reader.decodeOnceFromStream(streamRef.current, videoRef.current);
        if (result) setBarcodeResult(result.getText());
      } catch {
        // Cancelled via reset() or error — expected during cleanup
      }
    })();
  }, []);

  // --- YOLO preview ---
  const previewOneFrame = useCallback(async () => {
    const blob = await captureFrame();
    if (!blob) return;
    lastFrameRef.current = blob;
    try {
      const { status, data } = await scanApi.preview(blob);
      if (status !== 200) return;
      const result = data as PreviewResult;
      setDetections(result.detections);
      drawBoxes(result.detections);
      if (result.total_items > 0) {
        setBottleDetected(true);
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      }
    } catch { /* retry next interval */ }
  }, [captureFrame, drawBoxes]);

  // --- Auto-transition to READY when both checks pass ---
  useEffect(() => {
    if (state === "SCANNING" && bottleDetected && barcodeResult) {
      setState("READY");
      setStatusText(`✅ Botol terdeteksi • Barcode: ${barcodeResult}`);
    } else if (state === "SCANNING") {
      const parts: string[] = [];
      parts.push(bottleDetected ? "🤖 AI ✅" : "🤖 AI scanning...");
      parts.push(barcodeResult ? `📊 Barcode ✅` : "📊 Barcode scanning...");
      setStatusText(parts.join("  •  "));
    }
  }, [bottleDetected, barcodeResult, state]);

  const startScanning = useCallback(async () => {
    setError(""); setAnalyzeResult(null); setConfirmResult(null);
    setDetections([]); setBottleDetected(false); setBarcodeResult(null);
    setState("SCANNING"); await startCamera();
    setStatusText("🔍 Memulai deteksi...");
    setTimeout(() => {
      previewOneFrame();
      intervalRef.current = setInterval(previewOneFrame, 3000);
      startBarcodeScanner();
    }, 1000);
  }, [startCamera, previewOneFrame, startBarcodeScanner]);

  const handleConfirm = async () => {
    setState("CONFIRMING"); setStatusText("📦 Menyetorkan botol...");
    const blob = lastFrameRef.current || await captureFrame();
    if (!blob) { setError("Gagal menangkap frame"); setState("READY"); return; }
    try {
      const { status: aS, data: aD } = await scanApi.analyze(blob, barcodeResult || undefined);
      if (aS === 409) { setError((aD as { detail?: string }).detail || "Barcode sudah di-scan hari ini"); setState("READY"); return; }
      if (aS !== 200) { setError((aD as { detail?: string }).detail || "Analisis gagal"); setState("READY"); return; }
      const aResult = aD as AnalyzeResult;
      setAnalyzeResult(aResult);
      const { status: cS, data: cD } = await scanApi.confirm(aResult.scan_id);
      if (cS !== 200) { setError((cD as { detail?: string }).detail || "Konfirmasi gagal"); setState("READY"); return; }
      setConfirmResult(cD as ConfirmResult);
      setState("CONFIRMED"); setStatusText("🎉 Berhasil disetor!");
      await refreshUser();
    } catch { setError("Koneksi gagal saat menyetor"); setState("READY"); }
  };

  const scanAgain = () => {
    setDetections([]); setAnalyzeResult(null); setConfirmResult(null);
    setError(""); setBottleDetected(false); setBarcodeResult(null);
    stopCamera(); setState("IDLE");
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (barcodeIntervalRef.current) { clearInterval(barcodeIntervalRef.current); barcodeIntervalRef.current = null; }
    if (canvasRef.current) canvasRef.current.getContext("2d")?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const stopScanning = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (barcodeIntervalRef.current) { clearInterval(barcodeIntervalRef.current); barcodeIntervalRef.current = null; }
    stopCamera(); setDetections([]); setBottleDetected(false); setBarcodeResult(null);
    setState("IDLE"); setStatusText("");
    if (canvasRef.current) canvasRef.current.getContext("2d")?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 flex flex-col gap-6">
        <div className="bg-gradient-to-br from-on-primary-container to-primary rounded-2xl p-1 shadow-xl">
          <div className="bg-on-primary-container/90 rounded-xl overflow-hidden relative aspect-[4/3]">
            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" style={{ display: state !== "IDLE" ? "block" : "none" }} />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ display: state !== "IDLE" ? "block" : "none" }} />
            {state === "IDLE" && (
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="material-symbols-outlined text-primary-fixed text-7xl mb-4 opacity-60">qr_code_scanner</span>
                <p className="text-primary-fixed/70 text-sm font-medium">Tekan tombol di bawah untuk mulai scan</p>
                <p className="text-primary-fixed/50 text-xs mt-2">AI Deteksi Botol + Barcode Scanner</p>
              </div>
            )}
            {state !== "IDLE" && (
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-black/70 backdrop-blur-sm">
                <p className="text-primary-fixed text-sm font-semibold">{statusText}</p>
              </div>
            )}
            {state === "SCANNING" && !bottleDetected && <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-0.5 bg-primary-fixed/60 animate-pulse" />}
          </div>
        </div>

        {/* Dual Status Indicators */}
        {(state === "SCANNING" || state === "READY") && (
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-4 rounded-xl flex items-center gap-3 transition-all ${bottleDetected ? "bg-primary/10 border border-primary/20" : "bg-surface-container border border-outline-variant/15"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bottleDetected ? "bg-primary text-on-primary" : "bg-surface-container-high text-outline"}`}>
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: bottleDetected ? '"FILL" 1' : '"FILL" 0' }}>{bottleDetected ? "check_circle" : "smart_toy"}</span>
              </div>
              <div>
                <p className={`text-sm font-bold ${bottleDetected ? "text-primary" : "text-tertiary"}`}>{bottleDetected ? "Botol Terdeteksi" : "AI Scanning..."}</p>
                <p className="text-tertiary text-[10px]">YOLOv8 Detection</p>
              </div>
            </div>
            <div className={`p-4 rounded-xl flex items-center gap-3 transition-all ${barcodeResult ? "bg-primary/10 border border-primary/20" : "bg-surface-container border border-outline-variant/15"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${barcodeResult ? "bg-primary text-on-primary" : "bg-surface-container-high text-outline"}`}>
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: barcodeResult ? '"FILL" 1' : '"FILL" 0' }}>{barcodeResult ? "check_circle" : "barcode_scanner"}</span>
              </div>
              <div>
                <p className={`text-sm font-bold ${barcodeResult ? "text-primary" : "text-tertiary"}`}>{barcodeResult ? `EAN: ${barcodeResult}` : "Barcode Scanning..."}</p>
                <p className="text-tertiary text-[10px]">EAN-13 Decode</p>
              </div>
            </div>
          </div>
        )}

        {state === "IDLE" && (
          <button onClick={startScanning} className="w-full py-5 rounded-2xl font-bold text-lg gradient-primary text-on-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>center_focus_strong</span>
            Mulai Scan
          </button>
        )}
        {state === "SCANNING" && (
          <button onClick={stopScanning} className="w-full py-5 rounded-2xl font-bold text-lg bg-error text-on-error shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-2xl">stop_circle</span> Stop Scan
          </button>
        )}
        {state === "READY" && (
          <div className="flex gap-3">
            <button onClick={handleConfirm} className="flex-1 py-5 rounded-2xl font-bold text-lg gradient-primary text-on-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>add_circle</span>
              Setorkan Botol
            </button>
            <button onClick={scanAgain} className="px-6 py-5 rounded-2xl font-bold text-lg bg-surface-container-high text-tertiary hover:scale-[1.02] active:scale-[0.98] transition-all">↻</button>
          </div>
        )}
        {state === "CONFIRMING" && (
          <div className="w-full py-5 rounded-2xl font-bold text-lg bg-surface-container-high text-tertiary flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> Memproses setoran...
          </div>
        )}
        {state === "CONFIRMED" && (
          <button onClick={scanAgain} className="w-full py-5 rounded-2xl font-bold text-lg gradient-primary text-on-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-2xl">restart_alt</span> Scan Lagi
          </button>
        )}
        {error && <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium">{error}</div>}
      </div>

      <div className="lg:col-span-2 flex flex-col gap-6">
        {(state === "READY" || state === "SCANNING") && detections.length > 0 && (
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)] border border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-primary-container/20 rounded-xl"><span className="material-symbols-outlined text-primary text-2xl">eco</span></div>
              <div><h4 className="font-bold text-on-surface font-headline">Botol Terdeteksi</h4><p className="text-tertiary text-xs">Preview — belum dikonfirmasi</p></div>
            </div>
            <div className="space-y-3">
              {detections.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-surface rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center"><span className="material-symbols-outlined text-primary text-lg">recycling</span></div>
                    <div><p className="font-bold text-on-surface text-sm">{d.label}</p><p className="text-tertiary text-[10px]">{d.type} • {Math.round(d.confidence * 100)}%</p></div>
                  </div>
                </div>
              ))}
            </div>
            {barcodeResult && (
              <div className="mt-4 p-3 bg-primary/5 rounded-xl border border-primary/15">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-lg">barcode</span>
                  <div><p className="font-bold text-on-surface text-sm">Barcode: {barcodeResult}</p><p className="text-tertiary text-[10px]">Produk teridentifikasi via EAN-13</p></div>
                </div>
              </div>
            )}
          </div>
        )}

        {state === "CONFIRMED" && confirmResult && (
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)] border border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-primary-container/20 rounded-xl"><span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span></div>
              <div><h4 className="font-bold text-on-surface font-headline">Berhasil Disetor!</h4><p className="text-tertiary text-xs">{analyzeResult?.total_items ?? 0} botol dikonfirmasi</p></div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-secondary-container rounded-xl">
                <span className="text-on-secondary-container text-sm font-medium">Saldo Ditambahkan</span>
                <span className="font-black text-primary text-xl font-headline">+Rp{(confirmResult.balance_added ?? 0).toLocaleString("id")}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface rounded-xl">
                <span className="text-tertiary text-sm">Poin</span>
                <span className="font-bold text-primary text-sm">+{confirmResult.points_earned ?? 0} poin</span>
              </div>
              {barcodeResult && (
                <div className="flex justify-between items-center p-3 bg-surface rounded-xl">
                  <span className="text-tertiary text-sm">Barcode</span>
                  <span className="font-bold text-on-surface text-sm">{barcodeResult}</span>
                </div>
              )}
            </div>
            {confirmResult.gamification && (
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center p-3 bg-surface rounded-xl">
                  <span className="text-tertiary text-sm">Level</span>
                  <span className="font-bold text-on-surface text-sm">{confirmResult.gamification.level_title}</span>
                </div>
                {confirmResult.gamification.level_up && (
                  <div className="p-4 bg-primary/10 rounded-xl text-center animate-bounce">
                    <p className="text-primary font-bold text-lg">🎉 Level Up!</p>
                    <p className="text-primary/70 text-xs">{confirmResult.gamification.level_title}</p>
                  </div>
                )}
                {confirmResult.gamification.new_achievements?.map((ach, i) => (
                  <div key={i} className="p-3 bg-primary/10 rounded-xl flex items-center gap-3">
                    <span className="text-2xl">{ach.icon}</span>
                    <div><p className="font-bold text-primary text-sm">{ach.title}</p><p className="text-primary/70 text-xs">{ach.description}</p></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {state === "IDLE" && (
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
            <h4 className="font-bold text-on-surface font-headline mb-4">Cara Scan</h4>
            <div className="space-y-4">
              {[
                { icon: "center_focus_strong", title: "Mulai Scan", desc: "Aktifkan kamera dengan tombol di bawah" },
                { icon: "smart_toy", title: "AI Deteksi Botol", desc: "YOLO mendeteksi apakah objek adalah botol" },
                { icon: "barcode_scanner", title: "Barcode Scan", desc: "ZXing membaca barcode EAN-13 dari botol" },
                { icon: "check_circle", title: "Konfirmasi", desc: "Kedua check lolos → tekan Setorkan untuk saldo" },
              ].map((step, i) => (
                <div key={step.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-xl">{step.icon}</span>
                  </div>
                  <div><p className="font-bold text-on-surface text-sm">{i + 1}. {step.title}</p><p className="text-tertiary text-xs">{step.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
