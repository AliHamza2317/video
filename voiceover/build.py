"""Build the Hostastic voiceover and the video timeline from voiceover/script.json.

1. Synthesises each line with Kokoro (kokoro-onnx, voice af_heart).
2. Lays the lines end to end: `leadIn` before the first line, `gap` between
   lines (the audible pause stays under 0.3 s).
3. Finds the pauses in each line to sync caption chunks to the speech.
4. Writes:
     public/audio/voiceover.wav   full-length VO track (24 kHz mono)
     src/timeline.json            scene, line and caption times for the video

Usage (see README for model download):
  python voiceover/build.py <kokoro_model_dir>
"""
import json
import re
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro
from kokoro_onnx.tokenizer import Tokenizer

ROOT = Path(__file__).resolve().parent.parent
cfg = json.loads((ROOT / "voiceover/script.json").read_text())
model_dir = Path(sys.argv[1])

kokoro = Kokoro(str(model_dir / "kokoro-v1.0.onnx"), str(model_dir / "voices-v1.0.bin"))
tokenizer = Tokenizer()

# espeak reads "Hostastic" as "hus-TAY-stick"; force "host-AS-tic".
PHONEME_FIXES = {"həstˈeɪstɪk": "hˌoʊstˈæstɪk", "hoʊstˈeɪstɪk": "hˌoʊstˈæstɪk"}


def to_phonemes(text: str) -> str:
    p = tokenizer.phonemize(text, "en-us")
    for wrong, right in PHONEME_FIXES.items():
        p = p.replace(wrong, right)
    return p


def silent_runs(x: np.ndarray, sr: int, thr=0.012, min_len=0.06):
    win = max(1, int(sr * 0.01))
    env = np.convolve(np.abs(x), np.ones(win) / win, mode="same")
    quiet = env < thr
    runs, i = [], 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]:
                j += 1
            if (j - i) / sr >= min_len:
                runs.append((i / sr, j / sr))
            i = j
        else:
            i += 1
    return runs


def caption_starts(audio, sr, spoken, chunks):
    """Start time (s) of each caption chunk within a line."""
    dur = len(audio) / sr
    segments = re.split(r"(?<=[,.])\s+", spoken)
    runs = silent_runs(audio, sr)
    # Punctuation pauses are the longest silences in the line.
    need = len(segments) - 1
    longest = sorted(sorted(runs, key=lambda r: r[1] - r[0], reverse=True)[:need])
    if len(longest) == need:
        bounds = [0.0] + [(a + b) / 2 for a, b in longest] + [dur]
    else:
        total = sum(len(s) for s in segments)
        bounds, acc = [0.0], 0
        for s in segments:
            acc += len(s)
            bounds.append(dur * acc / total)

    def at_char(ci):
        pos = 0
        for k, s in enumerate(segments):
            if ci <= pos + len(s):
                return bounds[k] + (ci - pos) / max(1, len(s)) * (bounds[k + 1] - bounds[k])
            pos += len(s) + 1
        return dur

    starts, ci = [], 0
    for c in chunks:
        starts.append(at_char(ci))
        ci += len(c) + 1
    starts[0] = 0.0
    return starts


lines_audio, sr = [], None
for line in cfg["lines"]:
    audio, sr = kokoro.create(to_phonemes(line["spoken"]), voice=cfg["voice"], speed=cfg["speed"], is_phonemes=True)
    idx = np.where(np.abs(audio) > 0.01)[0]
    pad = int(0.02 * sr)
    lines_audio.append(audio[max(0, idx[0] - pad): idx[-1] + pad])

# Timeline
fps = cfg["fps"]
t = cfg["leadIn"]
timeline_lines = []
for line, audio in zip(cfg["lines"], lines_audio):
    dur = len(audio) / sr
    starts = caption_starts(audio, sr, line["spoken"], line.get("spokenCaptions", line["captions"]))
    timeline_lines.append({
        "id": line["id"],
        "text": line["display"],
        "start": round(t, 3),
        "end": round(t + dur, 3),
        "cues": [{"text": c, "start": round(t + s, 3)} for c, s in zip(line["captions"], starts)],
    })
    t += dur + cfg["gap"]

last_end = timeline_lines[-1]["end"]
scenes = []
for i, ln in enumerate(timeline_lines):
    start = 0.0 if i == 0 else ln["start"] - cfg["cutLead"]
    scenes.append({"id": ln["id"], "start": round(start, 3)})
close_start = scenes[-1]["start"]
total = max(cfg["minTotal"], last_end + 1.5)
total = min(total, close_start + cfg["maxScene"])
total = round(round(total * fps) / fps, 3)
for i, s in enumerate(scenes):
    s["end"] = scenes[i + 1]["start"] if i + 1 < len(scenes) else total

# Full-length VO track
track = np.zeros(int(round(total * sr)), dtype=np.float32)
for ln, audio in zip(timeline_lines, lines_audio):
    o = int(round(ln["start"] * sr))
    track[o:o + len(audio)] = audio[: len(track) - o]
sf.write(ROOT / "public/audio/voiceover.wav", track, sr, subtype="PCM_16")

timeline = {"fps": fps, "duration": total, "voice": cfg["voice"], "speed": cfg["speed"], "scenes": scenes, "lines": timeline_lines}
(ROOT / "src/timeline.json").write_text(json.dumps(timeline, indent=2, ensure_ascii=False) + "\n")

words = sum(len(l["display"].split()) for l in cfg["lines"])
spoken = sum(len(l["spoken"].split()) for l in cfg["lines"])
speech = sum(len(a) / sr for a in lines_audio)
gaps = [timeline_lines[i + 1]["start"] - timeline_lines[i]["end"] for i in range(len(timeline_lines) - 1)]
print(f"total {total:.2f}s  speech {speech:.2f}s  {spoken / speech * 60:.0f} spoken wpm ({words / speech * 60:.0f} script wpm)")
print(f"max gap between lines {max(gaps):.2f}s")
for s in scenes:
    print(f"  {s['id']:<10} {s['start']:6.2f} -> {s['end']:6.2f}  ({s['end'] - s['start']:.2f}s)")
