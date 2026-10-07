#!/usr/bin/env python3
"""Pre-delivery check for a finished reel: export spec, loudness, black/frozen
frames. Prints one line per check and exits 1 if a required check fails.

Usage: final_check.py FINAL.mp4
"""
import json
import re
import subprocess
import sys


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def main():
    path = sys.argv[1]
    info = json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-show_format",
                           "-of", "json", path]).stdout)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    a = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)
    dur = float(info["format"]["duration"])
    size_mb = int(info["format"]["size"]) / 1e6
    fails = []

    def check(name, ok, detail, required=True):
        print(f"{'PASS' if ok else ('FAIL' if required else 'WARN')}  {name}: {detail}")
        if required and not ok:
            fails.append(name)

    check("resolution", (v["width"], v["height"]) == (1080, 1920), f'{v["width"]}x{v["height"]}')
    check("codec", v["codec_name"] == "h264" and v.get("profile") == "High", f'{v["codec_name"]} {v.get("profile")}')
    check("pix_fmt", v["pix_fmt"] == "yuv420p", v["pix_fmt"])
    fr, afr = v["r_frame_rate"], v["avg_frame_rate"]
    fps = eval(afr) if afr != "0/0" else 0
    check("fps", fr == afr and abs(fps - 30) < 0.01, f"{fr} (avg {afr}), constant 30 expected")
    tags = (v.get("color_primaries"), v.get("color_transfer"), v.get("color_space"))
    check("bt709 tags", tags == ("bt709", "bt709", "bt709"), str(tags))
    if a:
        check("audio", a["codec_name"] == "aac" and a["sample_rate"] == "48000", f'{a["codec_name"]} {a["sample_rate"]}Hz')
    else:
        check("audio", False, "no audio stream")

    with open(path, "rb") as fh:
        head = fh.read(1 << 20)
    moov, mdat = head.find(b"moov"), head.find(b"mdat")
    check("faststart", moov != -1 and (mdat == -1 or moov < mdat), "moov before mdat")
    check("edit list", b"elst" not in head, "no edit list (Meta spec)", required=False)

    if a:
        ln = run(["ffmpeg", "-hide_banner", "-i", path, "-vn", "-af", "loudnorm=print_format=json", "-f", "null", "-"]).stderr
        j = json.loads(ln[ln.rindex("{"):ln.rindex("}") + 1])
        i, tp = float(j["input_i"]), float(j["input_tp"])
        check("loudness", -15.5 <= i <= -13.0, f"{i:.1f} LUFS (target -14.5)")
        check("true peak", tp <= -1.0, f"{tp:.1f} dBTP (max -1)")

    det = run(["ffmpeg", "-hide_banner", "-i", path, "-vf",
               "blackdetect=d=0.04:pix_th=0.08,freezedetect=n=0.002:d=0.6", "-an", "-f", "null", "-"]).stderr
    blacks = re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", det)
    freezes = re.findall(r"freeze_start: ([\d.]+)", det)
    check("black frames", not blacks, f"{blacks or 'none'}")
    check("frozen frames", not freezes, f"{freezes or 'none'} (fine if it's a planned freeze/CTA)", required=False)

    check("duration", 6 <= dur <= 90, f"{dur:.1f}s", required=False)
    print(f"INFO  size: {size_mb:.1f} MB, {8 * size_mb / dur:.1f} Mbps")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
