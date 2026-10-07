#!/usr/bin/env python3
"""Face-aware caption placement for 1080x1920 reels.

Captions sit at one fixed spot on the chest: box bottom edge at y=1540, just
above Instagram's bottom overlay. This script checks every segment for the
speaker's chin and shrinks the font when the box would cover it, so the
caption never jumps around between cuts. Segments that still collide are
flagged for a reframe.

Needs OpenCV 4.x: `pip install "opencv-python-headless<5"` (OpenCV 5 no
longer ships the Haar cascade files).

Usage:
  face_safe.py VIDEO [--segments segs.json] [--font 112] [--step 0.25]
               [--debug-dir DIR] > placement.json

segs.json: [[start, end], ...] in seconds of VIDEO. Default: the whole video
in 2-second windows.
"""
import argparse
import json
import os
import sys

import cv2
import numpy as np

W, H = 1080, 1920
SAFE_TOP = 250        # Reels header area
SAFE_BOTTOM = 1540    # caption box bottom edge must stay above this
BOX_FACTOR = 1.30     # caption box height = font_px * BOX_FACTOR (measured 1.26 for Heebo Black + burgundy box)
CHIN_FACTOR = 1.08    # Haar box bottom is around the mouth/chin; push a little lower
MARGIN = 24           # px between chin and caption box top
MIN_FONT = 96         # never shrink below this; flag the segment instead


def load_cascade():
    path = os.path.join(cv2.data.haarcascades, "haarcascade_frontalface_default.xml")
    casc = cv2.CascadeClassifier(path)
    if casc.empty():
        sys.exit("Haar cascade missing. Install opencv-python-headless<5.")
    return casc


def detect_chin(casc, frame):
    """Return (chin_y, (x, y, w, h)) of the largest face in full-res coords, or None."""
    scale = 0.5
    small = cv2.resize(frame, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
    gray = cv2.equalizeHist(cv2.cvtColor(small, cv2.COLOR_BGR2GRAY))
    faces = casc.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=6,
                                  minSize=(int(90 * scale), int(90 * scale)))
    if len(faces) == 0:
        return None
    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
    x, y, w, h = (int(v / scale) for v in (x, y, w, h))
    return y + CHIN_FACTOR * h, (x, y, w, h)


def place(chin, font):
    """Fixed chest position; shrink the font only if the box would cover the chin."""
    while True:
        box = font * BOX_FACTOR
        center = SAFE_BOTTOM - box / 2
        if chin is None:
            return center, font, "no_face"
        if chin + MARGIN <= center - box / 2:
            return center, font, "ok"
        if font - 8 < MIN_FONT:
            return center, font, "overlaps_chin"
        font -= 8


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--segments")
    ap.add_argument("--font", type=int, default=112)
    ap.add_argument("--step", type=float, default=0.25)
    ap.add_argument("--debug-dir")
    a = ap.parse_args()

    cap = cv2.VideoCapture(a.video)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    dur = n / fps
    vw, vh = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    if (vw, vh) != (W, H):
        print(f"warning: video is {vw}x{vh}, run this on the 1080x1920 render", file=sys.stderr)

    if a.segments:
        segs = json.load(open(a.segments))
    else:
        segs = [[t, min(t + 2.0, dur)] for t in np.arange(0, dur, 2.0)]

    casc = load_cascade()
    out = []
    for i, (s, e) in enumerate(segs):
        chins, boxes = [], []
        for t in np.arange(s, e, a.step):
            cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t * fps)))
            ok, frame = cap.read()
            if not ok:
                continue
            r = detect_chin(casc, frame)
            if r:
                chins.append(r[0])
                boxes.append(r[1])
        # p90: the head moves, so protect the lowest chin positions, not the average
        chin = float(np.percentile(chins, 90)) if len(chins) >= 2 else (chins[0] if chins else None)
        y, font, status = place(chin, a.font)
        out.append({"start": round(float(s), 3), "end": round(float(e), 3),
                    "chin_y": None if chin is None else round(chin),
                    "face_hits": len(chins), "y_center": round(y), "font_px": font,
                    "status": status})
        if a.debug_dir and boxes:
            os.makedirs(a.debug_dir, exist_ok=True)
            cap.set(cv2.CAP_PROP_POS_FRAMES, int(round((s + e) / 2 * fps)))
            ok, frame = cap.read()
            if ok:
                x, yy, w, h = boxes[len(boxes) // 2]
                cv2.rectangle(frame, (x, yy), (x + w, yy + h), (0, 255, 0), 4)
                cv2.line(frame, (0, int(chin)), (W, int(chin)), (0, 200, 255), 3)
                bh = font * BOX_FACTOR
                cv2.rectangle(frame, (120, int(y - bh / 2)), (W - 120, int(y + bh / 2)), (36, 10, 150), -1)
                cv2.line(frame, (0, SAFE_BOTTOM), (W, SAFE_BOTTOM), (0, 0, 255), 3)
                cv2.imwrite(os.path.join(a.debug_dir, f"seg{i:02d}.jpg"), frame)

    # one font for the whole video looks better than a size change mid-reel
    fonts = [o["font_px"] for o in out if o["status"] != "overlaps_chin"]
    font = min(fonts) if fonts else a.font
    json.dump({"safe_bottom": SAFE_BOTTOM, "font_px": font,
               "y_center": round(SAFE_BOTTOM - font * BOX_FACTOR / 2),
               "segments": out}, sys.stdout, ensure_ascii=False, indent=1)
    print()
    bad = [o for o in out if o["status"] == "overlaps_chin"]
    if bad:
        print(f"{len(bad)} segment(s) can't fit below the chin: {[(o['start'], o['end']) for o in bad]}. "
              "Reframe so the face sits higher (move the crop window down in the source), "
              "or zoom out a little for those lines.", file=sys.stderr)


if __name__ == "__main__":
    main()
