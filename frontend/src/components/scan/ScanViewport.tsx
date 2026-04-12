"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { scanApi } from "@/lib/api";
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType, NotFoundException } from "@zxing/library";
import { useLanguage } from "@/context/LanguageContext";

type ScanState = "IDLE" | "SCANNING" | "READY" | "CONFIRMING" | "CONFIRMED";

interface BBox { x1: number; y1: number; x2: number; y2: number; }
interface Detection { bbox: BBox; class: string; label: string; type: string; confidence: number; }
interface PreviewResult { detections: Detection[]; total_items: number; }
interface AnalyzeResult { scan_id: string; detected: { brand: string; type: string; quantity: number; subtotal: number; confidence: number }[]; total_items: number; total_value: number; barcode?: string; }
interface ConfirmResult { message: string; amount_credited: number; points_earned: number; new_balance: number; new_points: number; gamification?: { level: number; level_title: string; new_achievements: { title: string; icon: string; description: string }[]; level_up: boolean; }; }
interface CameraDeviceOption { id: string; label: string; }

export default function ScanViewport() {
  const { refreshUser } = useAuth();
  const { t } = useLanguage();
  const [state, setState] = useState<ScanState>("IDLE");
  const [detections, setDetections] = useState<Detection[]>([]);
  const [bottleDetected, setBottleDetected] = useState(false);
  const [barcodeResult, setBarcodeResult] = useState<string | null>(null);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [confirmResult, setConfirmResult] = useState<ConfirmResult | null>(null);
  const [error, setError] = useState("");
  const [statusText, setStatusText] = useState<React.ReactNode>("");
  const [bottleScore, setBottleScore] = useState(0);
  const [cameraDevices, setCameraDevices] = useState<CameraDeviceOption[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastFrameRef = useRef<Blob | null>(null);
  const barcodeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const barcodeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const barcodeBusyRef = useRef(false);
  const previewErrorCountRef = useRef(0);
  const previewBusyRef = useRef(false);
  const cocoModelRef = useRef<{ detect: (input: HTMLVideoElement, maxNumBoxes?: number, minScore?: number) => Promise<Array<{ class: string; score: number }>> } | null>(null);
  const cocoAnimationRef = useRef<number | null>(null);
  const cocoLastTickRef = useRef(0);
  const cocoMissCountRef = useRef(0);
  const cocoBusyRef = useRef(false);
  const lastLiveDetectionsRef = useRef<Detection[]>([]);
  const bottleScoreRef = useRef(0);
  const bottleDetectedRef = useRef(false);
  const barcodeResultRef = useRef<string | null>(null);

  const BOTTLE_ON_THRESHOLD = 42;
  const BOTTLE_OFF_THRESHOLD = 16;
  const SCORE_UP = 20;
  const SCORE_DOWN_NORMAL = 8;
  const SCORE_DOWN_BARCODE_PHASE = 3;

  const applyBottleScore = useCallback((nextScore: number) => {
    const clamped = Math.max(0, Math.min(100, nextScore));
    bottleScoreRef.current = clamped;
    setBottleScore((prev) => (Math.abs(prev - clamped) >= 1 ? clamped : prev));

    const previousDetected = bottleDetectedRef.current;
    let nextDetected = previousDetected;

    if (clamped >= BOTTLE_ON_THRESHOLD) nextDetected = true;
    else if (clamped <= BOTTLE_OFF_THRESHOLD) nextDetected = false;

    if (nextDetected !== previousDetected) {
      bottleDetectedRef.current = nextDetected;
      setBottleDetected(nextDetected);
    }
  }, []);

  const stopCocoDetector = useCallback(() => {
    if (cocoAnimationRef.current !== null) {
      cancelAnimationFrame(cocoAnimationRef.current);
      cocoAnimationRef.current = null;
    }
    cocoLastTickRef.current = 0;
    cocoMissCountRef.current = 0;
    cocoBusyRef.current = false;
  }, []);

  const loadCocoModel = useCallback(async () => {
    if (cocoModelRef.current) return cocoModelRef.current;
    await import("@tensorflow/tfjs");
    const cocoSsd = await import("@tensorflow-models/coco-ssd");
    cocoModelRef.current = await cocoSsd.load({ base: "lite_mobilenet_v2" });
    return cocoModelRef.current;
  }, []);

  const stopBarcodeScanner = useCallback(() => {
    if (barcodeIntervalRef.current) {
      clearInterval(barcodeIntervalRef.current);
      barcodeIntervalRef.current = null;
    }
    barcodeReaderRef.current?.reset();
    barcodeReaderRef.current = null;
    barcodeBusyRef.current = false;
  }, []);

  const normalizeBarcode = useCallback((raw: string): string | null => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 13 || digits.length === 8) return digits;
    if (digits.length === 12) return `0${digits}`;
    return null;
  }, []);

  const listVideoDevices = useCallback(async (): Promise<CameraDeviceOption[]> => {
    if (!navigator?.mediaDevices?.enumerateDevices) return [];
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter((device) => device.kind === "videoinput")
      .map((device, index) => ({
        id: device.deviceId,
        label: device.label || `Camera ${index + 1}`,
      }));
  }, []);

  const getPreferredCameraId = useCallback((devices: CameraDeviceOption[]): string => {
    const rankedKeywords = ["droidcam", "iriun", "ivcam", "epoccam", "usb", "external", "rear", "back"];
    const lowercased = devices.map((device) => ({
      ...device,
      lowerLabel: device.label.toLowerCase(),
    }));

    for (const keyword of rankedKeywords) {
      const matched = lowercased.find((device) => device.lowerLabel.includes(keyword));
      if (matched) return matched.id;
    }

    const avoidKeywords = ["facetime", "integrated", "builtin", "front"];
    const nonIntegrated = lowercased.find(
      (device) => !avoidKeywords.some((keyword) => device.lowerLabel.includes(keyword)),
    );
    return nonIntegrated?.id || devices[0]?.id || "";
  }, []);

  const startCamera = useCallback(async () => {
    try {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;

      const baseConstraints: MediaTrackConstraints = selectedCameraId
        ? { deviceId: { exact: selectedCameraId }, width: { ideal: 1280 }, height: { ideal: 720 } }
        : { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } };

      let stream = await navigator.mediaDevices.getUserMedia({ video: baseConstraints });

      const devices = await listVideoDevices();
      setCameraDevices(devices);

      if (!selectedCameraId && devices.length > 1) {
        const preferredId = getPreferredCameraId(devices);
        const currentTrack = stream.getVideoTracks()[0];
        const currentDeviceId = currentTrack?.getSettings()?.deviceId || "";

        if (preferredId && preferredId !== currentDeviceId) {
          stream.getTracks().forEach((track) => track.stop());
          stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: preferredId }, width: { ideal: 1280 }, height: { ideal: 720 } },
          });
          setSelectedCameraId(preferredId);
        }
      }

      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setError(t("camera_error") || "Gagal mengakses kamera. Pastikan izin kamera diberikan dan kamera yang dipilih tersedia.");
    }
  }, [getPreferredCameraId, listVideoDevices, selectedCameraId, t]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => {
    bottleDetectedRef.current = bottleDetected;
  }, [bottleDetected]);

  useEffect(() => {
    barcodeResultRef.current = barcodeResult;
  }, [barcodeResult]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      stopCocoDetector();
      stopBarcodeScanner();
      stopCamera();
    };
  }, [stopCamera, stopBarcodeScanner, stopCocoDetector]);

  useEffect(() => {
    const refreshDevices = async () => {
      const devices = await listVideoDevices();
      setCameraDevices(devices);
      if (!selectedCameraId && devices.length > 0) {
        setSelectedCameraId(getPreferredCameraId(devices));
      }
    };

    refreshDevices();
    navigator.mediaDevices?.addEventListener?.("devicechange", refreshDevices);
    return () => navigator.mediaDevices?.removeEventListener?.("devicechange", refreshDevices);
  }, [getPreferredCameraId, listVideoDevices, selectedCameraId]);

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

  const captureFrame = useCallback((options?: { maxWidth?: number; quality?: number }): Promise<Blob | null> => {
    return new Promise(resolve => {
      const video = videoRef.current;
      if (!video || !video.videoWidth) { resolve(null); return; }

      const maxWidth = options?.maxWidth;
      const quality = options?.quality ?? 0.8;
      const sourceWidth = video.videoWidth;
      const sourceHeight = video.videoHeight;
      const scale = maxWidth && sourceWidth > maxWidth ? maxWidth / sourceWidth : 1;

      const c = document.createElement("canvas");
      c.width = Math.round(sourceWidth * scale);
      c.height = Math.round(sourceHeight * scale);
      c.getContext("2d")!.drawImage(video, 0, 0);
      c.toBlob(blob => resolve(blob), "image/jpeg", quality);
    });
  }, []);

  const mapCocoToDetections = useCallback((
    predictions: Array<{ bbox?: number[]; class: string; score: number }>,
    videoWidth: number,
    videoHeight: number,
  ): Detection[] => {
    const trackedClasses = new Set(["bottle", "cup", "wine glass"]);
    const classToType: Record<string, string> = {
      bottle: "PET_bottle",
      cup: "plastic_cup",
      "wine glass": "glass_bottle",
    };

    return predictions
      .filter((prediction) => trackedClasses.has(prediction.class))
      .map((prediction) => {
        const [x = 0, y = 0, w = 0, h = 0] = prediction.bbox || [];
        const x1 = Math.max(0, x / videoWidth);
        const y1 = Math.max(0, y / videoHeight);
        const x2 = Math.min(1, (x + w) / videoWidth);
        const y2 = Math.min(1, (y + h) / videoHeight);

        return {
          bbox: { x1, y1, x2, y2 },
          class: prediction.class,
          label: prediction.class === "bottle" ? (t("bottle_label") || "Botol") : prediction.class === "cup" ? (t("cup_label") || "Gelas/ Cup") : (t("glass_label") || "Botol Kaca"),
          type: classToType[prediction.class] || "PET_bottle",
          confidence: Number(prediction.score.toFixed(2)),
        };
      })
      .filter((item) => item.confidence >= 0.35);
  }, [t]);

  // --- Barcode scanning (client-side ZXing) ---
  const startBarcodeScanner = useCallback(() => {
    if (barcodeResult || barcodeReaderRef.current) return;

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
    ]);
    hints.set(DecodeHintType.TRY_HARDER, true);
    const reader = new BrowserMultiFormatReader(hints);
    barcodeReaderRef.current = reader;

    const video = videoRef.current;
    if (!video) return;

    const commitBarcode = (value: string | undefined) => {
      if (!value || barcodeResult) return;
      const normalized = normalizeBarcode(value.trim());
      if (!normalized) return;
      setBarcodeResult(normalized);
      stopBarcodeScanner();
    };

    reader.decodeFromVideoElementContinuously(video, (result, decodeError) => {
      if (result) {
        commitBarcode(result.getText());
        return;
      }
      if (decodeError && !(decodeError instanceof NotFoundException)) {
        // keep scanning for transient decode errors
      }
    }).catch(() => {
      const scanOnce = async () => {
        if (
          !videoRef.current ||
          videoRef.current.readyState < 2 ||
          barcodeResult ||
          barcodeBusyRef.current
        ) return;

        barcodeBusyRef.current = true;
        try {
          const result = await reader.decodeFromVideoElement(videoRef.current);
          if (result) commitBarcode(result.getText());
        } catch (err) {
          if (!(err instanceof NotFoundException)) {
            // ignore scanner transient errors, keep retrying
          }
        } finally {
          barcodeBusyRef.current = false;
        }
      };

      scanOnce();
      barcodeIntervalRef.current = setInterval(scanOnce, 900);
    });
  }, [barcodeResult, normalizeBarcode, stopBarcodeScanner]);

  useEffect(() => {
    if (state !== "SCANNING" || barcodeResult || barcodeReaderRef.current) return;
    startBarcodeScanner();
  }, [state, barcodeResult, startBarcodeScanner]);

  // --- YOLO preview ---
  const previewOneFrame = useCallback(async () => {
    if (previewBusyRef.current) return;
    previewBusyRef.current = true;

    const blob = await captureFrame({ maxWidth: 640, quality: 0.62 });
    if (!blob) {
      previewBusyRef.current = false;
      return;
    }
    lastFrameRef.current = blob;
    try {
      const { status, data } = await scanApi.preview(blob);
      if (status !== 200) {
        previewErrorCountRef.current += 1;
        return;
      }
      previewErrorCountRef.current = 0;
      const result = data as PreviewResult;
      if (!bottleDetectedRef.current && result.detections.length > 0 && lastLiveDetectionsRef.current.length === 0) {
        setDetections(result.detections);
        drawBoxes(result.detections);
      }
      if (result.total_items > 0) {
        applyBottleScore(bottleScoreRef.current + 10);
      }
    } catch {
      previewErrorCountRef.current += 1;
      if (previewErrorCountRef.current >= 3) {
        setError(t("ai_not_ready") || "AI scanner belum siap. Cek backend model.");
      }
    } finally {
      previewBusyRef.current = false;
    }
  }, [applyBottleScore, captureFrame, drawBoxes]);

  useEffect(() => {
    if (state !== "SCANNING") {
      stopCocoDetector();
      return;
    }

    let active = true;

    const tick = async (timestamp: number) => {
      if (!active) return;

      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        cocoAnimationRef.current = requestAnimationFrame(tick);
        return;
      }

      if (cocoBusyRef.current || timestamp - cocoLastTickRef.current < 70) {
        cocoAnimationRef.current = requestAnimationFrame(tick);
        return;
      }

      cocoBusyRef.current = true;
      cocoLastTickRef.current = timestamp;
      try {
        const model = await loadCocoModel();
        if (!active) return;
        const predictions = await model.detect(video, 10, 0.32);
        if (!active) return;

        const liveDetections = mapCocoToDetections(
          predictions,
          video.videoWidth || 1,
          video.videoHeight || 1,
        );

        const inBarcodePhase = bottleDetectedRef.current && !barcodeResultRef.current;

        if (liveDetections.length > 0) {
          cocoMissCountRef.current = 0;
          lastLiveDetectionsRef.current = liveDetections;
          setDetections(liveDetections);
          drawBoxes(liveDetections);
          applyBottleScore(bottleScoreRef.current + SCORE_UP);
        } else {
          cocoMissCountRef.current += 1;

          if (cocoMissCountRef.current <= 3 && lastLiveDetectionsRef.current.length > 0) {
            drawBoxes(lastLiveDetectionsRef.current);
          } else {
            lastLiveDetectionsRef.current = [];
          }

          const down = inBarcodePhase ? SCORE_DOWN_BARCODE_PHASE : SCORE_DOWN_NORMAL;
          applyBottleScore(bottleScoreRef.current - down);
        }
      } catch {
        // Keep scanner running even if local model fails
      } finally {
        cocoBusyRef.current = false;
        if (active) {
          cocoAnimationRef.current = requestAnimationFrame(tick);
        }
      }
    };

    cocoAnimationRef.current = requestAnimationFrame(tick);
    return () => {
      active = false;
      stopCocoDetector();
    };
  }, [
    applyBottleScore,
    drawBoxes,
    loadCocoModel,
    mapCocoToDetections,
    stopCocoDetector,
    state,
  ]);

  // --- Auto-transition to READY when both checks pass ---
  useEffect(() => {
    if (state === "SCANNING" && bottleDetected && barcodeResult) {
      setState("READY");
      setStatusText(
        <div className="flex items-center justify-center gap-1.5"><span className="material-symbols-outlined text-sm text-primary">check_circle</span> {t("bottle_detected")} • Barcode: {barcodeResult}</div>
      );
    } else if (state === "SCANNING") {
      const parts: React.ReactNode[] = [];
      parts.push(
        <div key="ai" className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">smart_toy</span>
          {bottleDetected ? `${t("tracking_stable")} ${Math.round(bottleScore)}%` : `${t("ai_scanning")} ${Math.round(bottleScore)}%`}
        </div>
      );
      parts.push(
        <span key="dot1" className="opacity-50">•</span>
      );
      parts.push(
        <div key="bc" className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">barcode_scanner</span>
          {barcodeResult ? <><span className="material-symbols-outlined text-sm text-primary">check_circle</span></> : `${t("barcode_scanning")}`}
        </div>
      );
      if (bottleDetected && !barcodeResult) {
        parts.push(
          <span key="dot2" className="opacity-50">•</span>
        );
        parts.push(
          <div key="prio" className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">center_focus_strong</span>
            {t("barcode_priority")}
          </div>
        );
      }
      setStatusText(<div className="flex items-center justify-center gap-2">{parts}</div>);
    }
  }, [bottleDetected, barcodeResult, bottleScore, state, t]);

  const startScanning = useCallback(async () => {
    setError(""); setAnalyzeResult(null); setConfirmResult(null);
    setDetections([]); setBottleDetected(false); setBarcodeResult(null);
    setBottleScore(0);
    bottleScoreRef.current = 0;
    bottleDetectedRef.current = false;
    barcodeResultRef.current = null;
    lastLiveDetectionsRef.current = [];
    previewErrorCountRef.current = 0;
    previewBusyRef.current = false;
    barcodeBusyRef.current = false;
    stopCocoDetector();
    stopBarcodeScanner();
    setState("SCANNING"); await startCamera();
    setStatusText(<div className="flex items-center justify-center gap-1.5"><span className="material-symbols-outlined text-sm">search</span> {t("start_detection")}</div>);
    setTimeout(() => {
      previewOneFrame();
      intervalRef.current = setInterval(previewOneFrame, 1200);
    }, 1000);
  }, [startCamera, previewOneFrame, stopBarcodeScanner, stopCocoDetector]);

  const handleConfirm = async () => {
    setState("CONFIRMING"); setStatusText(<div className="flex items-center justify-center gap-1.5"><span className="material-symbols-outlined text-sm">inventory_2</span> {t("submitting_bottle")}</div>);
    const liveFrame = await captureFrame({ maxWidth: 1280, quality: 0.85 });
    const blob = liveFrame || lastFrameRef.current;
    if (!blob) { setError(t("frame_capture_error")); setState("READY"); return; }
    try {
      const { status: aS, data: aD } = await scanApi.analyze(blob, barcodeResult || undefined);
      if (aS === 409) { setError((aD as { detail?: string }).detail || t("barcode_scanned_today")); setState("READY"); return; }
      if (aS !== 200) { setError((aD as { detail?: string }).detail || t("analyze_failed")); setState("READY"); return; }
      const aResult = aD as AnalyzeResult;
      setAnalyzeResult(aResult);
      const { status: cS, data: cD } = await scanApi.confirm(aResult.scan_id);
      if (cS !== 200) { setError((cD as { detail?: string }).detail || t("confirm_failed")); setState("READY"); return; }
      setConfirmResult(cD as ConfirmResult);
      setState("CONFIRMED"); setStatusText(<div className="flex items-center justify-center gap-1.5"><span className="material-symbols-outlined text-sm text-primary">celebration</span> {t("success_submitted")}</div>);
      await refreshUser();
    } catch { setError(t("connection_failed")); setState("READY"); }
  };

  const scanAgain = () => {
    setDetections([]); setAnalyzeResult(null); setConfirmResult(null);
    setError(""); setBottleDetected(false); setBarcodeResult(null);
    setBottleScore(0);
    bottleScoreRef.current = 0;
    bottleDetectedRef.current = false;
    barcodeResultRef.current = null;
    lastLiveDetectionsRef.current = [];
    previewBusyRef.current = false;
    stopCocoDetector();
    stopCamera(); setState("IDLE");
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    stopBarcodeScanner();
    if (canvasRef.current) canvasRef.current.getContext("2d")?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const stopScanning = () => {
    previewBusyRef.current = false;
    stopCocoDetector();
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    stopBarcodeScanner();
    stopCamera(); setDetections([]); setBottleDetected(false); setBarcodeResult(null);
    setBottleScore(0);
    bottleScoreRef.current = 0;
    bottleDetectedRef.current = false;
    barcodeResultRef.current = null;
    lastLiveDetectionsRef.current = [];
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
                <p className="text-primary-fixed/70 text-sm font-medium">{t("press_start_scan")}</p>
                <p className="text-primary-fixed/50 text-xs mt-2">{t("ai_barcode_desc")}</p>
              </div>
            )}
            {state !== "IDLE" && (
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                <div className="text-primary-fixed text-sm font-semibold">{statusText}</div>
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
          <div className="flex flex-col gap-3">
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20">
              <label className="block text-xs font-semibold text-tertiary mb-2">{t("active_camera")}</label>
              <select
                value={selectedCameraId}
                onChange={(event) => setSelectedCameraId(event.target.value)}
                className="w-full rounded-lg bg-surface-container-high px-3 py-2 text-sm text-on-surface outline-none"
              >
                {cameraDevices.length === 0 && <option value="">{t("default_camera")}</option>}
                {cameraDevices.map((camera) => (
                  <option key={camera.id} value={camera.id}>{camera.label}</option>
                ))}
              </select>
            </div>
            <button onClick={startScanning} className="w-full py-5 rounded-2xl font-bold text-lg gradient-primary text-on-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>center_focus_strong</span>
              {t("start_scan")}
            </button>
          </div>
        )}
        {state === "SCANNING" && (
          <button onClick={stopScanning} className="w-full py-5 rounded-2xl font-bold text-lg bg-error text-on-error shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-2xl">stop_circle</span> {t("stop_scan")}
          </button>
        )}
        {state === "READY" && (
          <div className="flex gap-3">
            <button onClick={handleConfirm} className="flex-1 py-5 rounded-2xl font-bold text-lg gradient-primary text-on-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>add_circle</span>
              {t("submit_bottle")}
            </button>
            <button onClick={scanAgain} className="px-6 py-5 rounded-2xl font-bold text-lg bg-surface-container-high text-tertiary hover:scale-[1.02] active:scale-[0.98] transition-all">↻</button>
          </div>
        )}
        {state === "CONFIRMING" && (
          <div className="w-full py-5 rounded-2xl font-bold text-lg bg-surface-container-high text-tertiary flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> {t("processing_submission")}
          </div>
        )}
        {state === "CONFIRMED" && (
          <button onClick={scanAgain} className="w-full py-5 rounded-2xl font-bold text-lg gradient-primary text-on-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-2xl">restart_alt</span> {t("scan_again")}
          </button>
        )}
        {error && <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium">{error}</div>}
      </div>

      <div className="lg:col-span-2 flex flex-col gap-6">
        {(state === "READY" || state === "SCANNING") && detections.length > 0 && (
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)] border border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-primary-container/20 rounded-xl"><span className="material-symbols-outlined text-primary text-2xl">eco</span></div>
              <div><h4 className="font-bold text-on-surface font-headline">{t("bottle_detected")}</h4><p className="text-tertiary text-xs">{t("preview_unconfirmed")}</p></div>
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
                  <div><p className="font-bold text-on-surface text-sm">Barcode: {barcodeResult}</p><p className="text-tertiary text-[10px]">{t("product_identified_ean")}</p></div>
                </div>
              </div>
            )}
          </div>
        )}

        {state === "CONFIRMED" && confirmResult && (
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)] border border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-primary-container/20 rounded-xl"><span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span></div>
              <div><h4 className="font-bold text-on-surface font-headline">{t("success_submitted")}</h4><p className="text-tertiary text-xs">{analyzeResult?.total_items ?? 0} {t("bottles_confirmed")}</p></div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-secondary-container rounded-xl">
                <span className="text-on-secondary-container text-sm font-medium">{t("balance_added")}</span>
                <span className="font-black text-primary text-xl font-headline">+Rp{(confirmResult.amount_credited ?? 0).toLocaleString("id")}</span>
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
                  <div className="p-4 bg-primary/10 rounded-xl text-center animate-bounce flex flex-col items-center">
                    <div className="text-primary font-bold text-lg flex items-center gap-1.5 justify-center"><span className="material-symbols-outlined">celebration</span> {t("level_up")}</div>
                    <p className="text-primary/70 text-xs mt-1">{confirmResult.gamification.level_title}</p>
                  </div>
                )}
                {confirmResult.gamification.new_achievements?.map((ach, i) => (
                  <div key={i} className="p-3 bg-primary/10 rounded-xl flex items-center gap-3">
                    <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>{ach.icon || "emoji_events"}</span>
                    <div><p className="font-bold text-primary text-sm">{ach.title}</p><p className="text-primary/70 text-xs">{ach.description}</p></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {state === "IDLE" && (
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_24px_48px_rgba(17,28,45,0.06)]">
            <h4 className="font-bold text-on-surface font-headline mb-4">{t("how_to_scan")}</h4>
            <div className="space-y-4">
              {[
                { icon: "center_focus_strong", title: t("start_scan"), desc: t("step_1_desc") },
                { icon: "smart_toy", title: t("step_2_title") || "AI Deteksi", desc: t("step_2_desc") },
                { icon: "barcode_scanner", title: t("step_3_title") || "Barcode", desc: t("step_3_desc") },
                { icon: "check_circle", title: t("step_4_title") || "Konfirmasi", desc: t("step_4_desc") },
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
