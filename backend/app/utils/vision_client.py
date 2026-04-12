"""
EcoBottle — YOLOv8 Vision Client
Local bottle/waste detection using YOLOv8 model from HuggingFace.
Model: kendrickfff/waste-classification-yolov8-ken

Detectable classes:
  plastic, metal, brown-glass, green-glass, white-glass,
  cardboard, paper, biological, battery, clothes, shoes, trash
"""

import io
import gc
from PIL import Image
from ultralytics import YOLO

# ─── Model Loading (singleton) ──────────────────────────────
_model = None

# Classes relevant to EcoBottle recycling
RECYCLABLE_CLASSES = {
    "plastic", "metal",
    "brown-glass", "green-glass", "white-glass",
}

# Map YOLO class names to EcoBottle bottle types
CLASS_TO_BOTTLE_TYPE = {
    "plastic": "PET_bottle",
    "metal": "aluminium_can",
    "brown-glass": "glass_bottle",
    "green-glass": "glass_bottle",
    "white-glass": "glass_bottle",
}

# Default volume estimates by material
CLASS_TO_VOLUME = {
    "plastic": "600",
    "metal": "330",
    "brown-glass": "350",
    "green-glass": "500",
    "white-glass": "350",
}

# Brand estimates based on material (common Indonesian brands)
CLASS_TO_BRAND = {
    "plastic": "Botol Plastik",
    "metal": "Kaleng Minuman",
    "brown-glass": "Botol Kaca Coklat",
    "green-glass": "Botol Kaca Hijau",
    "white-glass": "Botol Kaca Bening",
}


def _load_model() -> YOLO:
    """Load YOLOv8 model (lazy singleton). Downloads from HuggingFace on first run."""
    global _model
    if _model is None:
        print("🤖 Loading YOLOv8 waste detection model...")
        try:
            from huggingface_hub import hf_hub_download
            model_path = hf_hub_download(
                repo_id="kendrickfff/waste-classification-yolov8-ken",
                filename="yolov8n-waste-12cls-best.pt",
            )
            _model = YOLO(model_path)
            print("✅ Model loaded successfully!")
        except Exception as exc:
            raise RuntimeError(
                "Model YOLOv8 gagal dimuat. Pastikan dependency terpasang dan server bisa mengakses HuggingFace untuk download model pertama kali."
            ) from exc
    return _model


async def analyze_bottle_image(image_data: bytes, mime_type: str = "image/jpeg") -> dict:
    """
    Analyze an image for recyclable bottles using YOLOv8.

    Args:
        image_data: Raw image bytes
        mime_type: MIME type (unused, kept for API compat)

    Returns:
        Dict with detected bottles in EcoBottle format
    """
    # Load image from bytes
    try:
        image = Image.open(io.BytesIO(image_data))
    except Exception as exc:
        raise RuntimeError("File gambar tidak valid atau rusak") from exc

    # Load model
    model = _load_model()

    # Run inference (batch=1, optimized for low RAM)
    try:
        results = model(image, conf=0.55, imgsz=640, verbose=False)
    except Exception as exc:
        raise RuntimeError("Inferensi model gagal dijalankan") from exc

    # Parse detections
    bottles = []
    class_counts = {}  # Group same-class detections

    for result in results:
        for box in result.boxes:
            cls_id = int(box.cls[0])
            cls_name = result.names[cls_id]
            confidence = float(box.conf[0])

            # Only keep recyclable items relevant to EcoBottle
            if cls_name in RECYCLABLE_CLASSES:
                if cls_name not in class_counts:
                    class_counts[cls_name] = {
                        "quantity": 0,
                        "total_conf": 0.0,
                    }
                class_counts[cls_name]["quantity"] += 1
                class_counts[cls_name]["total_conf"] += confidence

    # Build structured response
    for cls_name, data in class_counts.items():
        qty = data["quantity"]
        avg_conf = data["total_conf"] / qty

        bottles.append({
            "brand": CLASS_TO_BRAND.get(cls_name, cls_name),
            "type": CLASS_TO_BOTTLE_TYPE.get(cls_name, "PET_bottle"),
            "volume_estimate": CLASS_TO_VOLUME.get(cls_name, "500"),
            "quantity": qty,
            "confidence": round(avg_conf, 2),
        })

    # Determine image quality
    total_items = sum(b["quantity"] for b in bottles)
    if total_items == 0:
        image_quality = "poor"
    elif any(b["confidence"] < 0.4 for b in bottles):
        image_quality = "unclear"
    else:
        image_quality = "good"

    # Cleanup to save RAM
    del results
    gc.collect()

    return {
        "bottles": bottles,
        "total_items": total_items,
        "image_quality": image_quality,
    }


async def analyze_bottle_preview(image_data: bytes) -> dict:
    """
    Lightweight preview analysis for real-time camera detection.
    Returns individual bounding boxes with coordinates for frontend overlay.
    Does NOT group by class — each detected object gets its own bbox.

    Returns:
        Dict with list of bounding boxes and summary
    """
    try:
        image = Image.open(io.BytesIO(image_data))
    except Exception as exc:
        raise RuntimeError("Frame preview tidak valid") from exc
    img_w, img_h = image.size

    model = _load_model()
    try:
        results = model(image, conf=0.65, imgsz=640, verbose=False)
    except Exception as exc:
        raise RuntimeError("Inferensi model preview gagal dijalankan") from exc

    # Minimum bbox area threshold (relative) to reject tiny/noise detections
    MIN_BBOX_AREA = 0.005  # at least 0.5% of image area

    detections = []
    for result in results:
        for box in result.boxes:
            cls_id = int(box.cls[0])
            cls_name = result.names[cls_id]
            confidence = float(box.conf[0])

            if cls_name not in RECYCLABLE_CLASSES:
                continue

            # Get normalized bbox coordinates (0-1 range for frontend canvas)
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            nx1, ny1 = x1 / img_w, y1 / img_h
            nx2, ny2 = x2 / img_w, y2 / img_h

            # Reject tiny detections (noise / false positives)
            bbox_area = (nx2 - nx1) * (ny2 - ny1)
            if bbox_area < MIN_BBOX_AREA:
                continue

            detections.append({
                "bbox": {
                    "x1": round(nx1, 4),
                    "y1": round(ny1, 4),
                    "x2": round(nx2, 4),
                    "y2": round(ny2, 4),
                },
                "class": cls_name,
                "label": CLASS_TO_BRAND.get(cls_name, cls_name),
                "type": CLASS_TO_BOTTLE_TYPE.get(cls_name, "PET_bottle"),
                "confidence": round(confidence, 2),
            })

    del results
    gc.collect()

    return {
        "detections": detections,
        "total_items": len(detections),
    }
