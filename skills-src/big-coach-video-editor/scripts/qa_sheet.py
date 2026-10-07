#!/usr/bin/env python3
"""One QA image for a finished 1080x1920 reel: frames at chosen times with
Instagram's Reels UI zones drawn on top, so a single Read shows whether any
caption, title or face sits under the app's buttons and text.

Usage:
  qa_sheet.py VIDEO OUT.png [--times 0 0.5 2.1 ...] [--n 12] [--cols 4]

Without --times: 0.0, 0.5, then evenly spaced frames to the end.
Zones (approximate, organic Reels; Instagram publishes no exact numbers):
  top 0-250 header, bottom 1570-1920 username/caption/audio,
  right 960-1080 x 1000-1570 like/comment/share buttons.
Red line: caption box bottom limit (y=1540).
"""
import argparse
import subprocess
import tempfile
import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
ZONES = [(0, 0, W, 250), (0, 1570, W, H), (960, 1000, W, 1570)]
LIMIT_Y = 1540
TILE_W = 270


def duration(video):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", video], capture_output=True, text=True).stdout
    return float(out.strip())


def grab(video, t, path):
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", f"{t:.3f}",
                    "-i", video, "-frames:v", "1", path], check=True)
    return Image.open(path).convert("RGB")


def annotate(frame, t):
    frame = frame.resize((W, H))
    over = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(over)
    for z in ZONES:
        d.rectangle(z, fill=(0, 140, 255, 70), outline=(0, 140, 255, 200), width=4)
    d.line([(0, LIMIT_Y), (W, LIMIT_Y)], fill=(255, 30, 30, 255), width=6)
    img = Image.alpha_composite(frame.convert("RGBA"), over).convert("RGB")
    d = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 64)
    except OSError:
        font = ImageFont.load_default()
    d.rectangle((0, 0, 300, 90), fill=(0, 0, 0))
    d.text((16, 10), f"{t:.2f}s", fill=(255, 255, 255), font=font)
    return img.resize((TILE_W, int(TILE_W * H / W)), Image.LANCZOS)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("out")
    ap.add_argument("--times", type=float, nargs="*")
    ap.add_argument("--n", type=int, default=12)
    ap.add_argument("--cols", type=int, default=4)
    a = ap.parse_args()

    dur = duration(a.video)
    times = a.times or [0.0, 0.5] + [dur * (i + 1) / (a.n - 1) - 0.05 for i in range(a.n - 2)]
    tiles = []
    with tempfile.TemporaryDirectory() as tmp:
        for i, t in enumerate(times):
            tiles.append(annotate(grab(a.video, max(0.0, min(t, dur - 0.05)), os.path.join(tmp, f"{i}.png")), t))
    th = tiles[0].height
    rows = (len(tiles) + a.cols - 1) // a.cols
    sheet = Image.new("RGB", (a.cols * (TILE_W + 8) + 8, rows * (th + 8) + 8), (40, 40, 40))
    for i, tile in enumerate(tiles):
        r, c = divmod(i, a.cols)
        sheet.paste(tile, (8 + c * (TILE_W + 8), 8 + r * (th + 8)))
    sheet.save(a.out)
    print(a.out, sheet.size)


if __name__ == "__main__":
    main()
