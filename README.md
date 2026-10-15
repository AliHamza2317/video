# Hostastic explainer video

A 45-second, 7-scene explainer for hostasticnow.com, built with [Remotion](https://www.remotion.dev/) (React to MP4).

- **Format:** 1920×1080, 30 fps, H.264 video with AAC audio, loudness-normalised to -14 LUFS
- **Look:** matches the Hostastic web app and hostasticnow.com:
  - warm cream background (#FFF8EF) with soft peach glows
  - Hostastic orange (#F78E52) accents and CTA, ink (#1C1B29) text, navy caption bars
  - serif headlines (DM Serif Display) with Inter for body text
  - big headline on the left, the app screen on the right, captions at the bottom
- **Narration:** AI voiceover (Kokoro, voice `af_heart`), about 145 spoken words per minute
- **Pacing:**
  - Every headline and visual is on screen within 0.3 s.
  - Cuts are 0.27 s crossfades.
  - Element animations are 0.37 s ease-out.
  - No scene runs longer than 9 s.
  - Gaps between voiceover lines are 0.30 s or less.

## Status

| Asset | Status |
|---|---|
| Logo | ✅ `public/brand/hostastic-logo.png`, the client file, byte-identical and untouched |
| Channel Manager screen | ✅ `public/screens/channel-manager.webp`, the Unified Calendar screen |
| Booking website screen | 🎨 Designed in the Hostastic style: `src/designs/BookingSiteDesign.tsx` (Sunset Villa Malibu direct-booking site, using the villa photo from the login screen) |
| Guest messaging screen | ✅ `public/screens/guest-messaging.jpg`, the Conversations screen, shown softly behind three animated AI chat cards (`src/scenes/ChatScene.tsx`) |
| Reporting screen | 🎨 Designed in the Hostastic style: `src/designs/ReportsDesign.tsx` (Reports screen with invoices, today's check-ins and checkouts, and guest, property and channel reports; no "Dashboard" anywhere) |
| Voiceover | ✅ `public/audio/voiceover.wav`, generated |
| Music | ⚠️ **Missing.** The slot is ready; see [Music](#music). |

## Deliverables (`renders/`)

| File | What |
|---|---|
| `hostastic-explainer-no-music.mp4` | Final video with voice only, -14 LUFS |
| `hostastic-explainer.mp4` | Final video with voice and music. Only made once a music file is added. |
| `hostastic-voiceover.wav` / `.mp3` | The narration on its own (48 kHz) |
| `hostastic-explainer.srt` | Captions, identical to the burned-in ones |
| `timing-sheet.md` / `.csv` | Scene, voiceover line and caption timings |

## Instagram Reel

`HostasticReel` is the same video re-laid out for Reels, not cropped: 1080×1920, 30 fps, 45 s, H.264 + AAC at -14 LUFS.

- Each scene stacks vertically: headline on top, app screen below, captions under that.
- App screens are zoomed tighter so the UI reads on a phone. The portrait camera paths live under `portrait` in `SCREENS`, in `src/script.ts`.
- Key content stays out of the areas Instagram covers. Headlines start at y 300 and captions end at y 1560, leaving room for the top bar, the caption and username overlay, and the button column on the right. The layout constants are in `src/layout.ts`.
- `renders/hostastic-reel-no-music.mp4` is the Reel. `renders/hostastic-reel-cover.png` is a caption-free cover frame to upload as the Reel cover.

```bash
npm run render:reel                                   # renders/hostastic-reel-no-music.mp4
node scripts/finish.mjs --video out/reel.mp4 --prefix hostastic-reel --music track.mp3   # adds music
```

## Commands

```bash
npm install
npm run studio          # live preview
npm run render          # render the picture, then mix and package everything into renders/
npm run finish -- --music path/to/track.mp3   # re-mix only, adding music
```

In a sandbox without Chrome, set `REMOTION_BROWSER_EXECUTABLE=/path/to/chrome` before you render.

## Adding the real app screens

Put one file per screen in `public/screens/`. Supported formats are png, jpg, webp, mp4, webm and mov.

| Scene | File name |
|---|---|
| 3. Channel Manager | `channel-manager.png` (or `.mp4`, ...) |
| 4. Booking website | `booking-website.png` |
| 5. Guest messaging | `guest-messaging.png` |
| 6. Reporting | `reporting.png` |

Each file replaces its placeholder, or the designed screen, automatically. Then open `SCREENS` in `src/script.ts` and adjust each entry:

- **`aspect`:** width ÷ height of the file (for example `1440 / 900`).
- **`camera`:** keyframes for the slow push-in and pan. Each sets a centre point and a zoom.
- **`rings`:** highlight rings, each with its own position, size and start time.
- **`clicks`:** cursor clicks, each with a target position and a time.

Positions are fractions of the screen (0 to 1, measured from the top-left). Times are seconds from the start of the scene. The current values are placeholders, so move them onto the parts of the UI worth pointing at. `npm run studio` shows the result live. Screen recordings play from `videoStart` seconds.

The designed screens reuse names and figures from the supplied screens: the June 2026 calendar totals and the David Statham booking. The chat cards' copy lives in `CHAT_CARDS` in `src/script.ts`.

The app screens are used exactly as supplied, so their own text appears on screen. The Conversations screenshot has two em dashes in its AI message text ("a 10am arrival — I'll prepare…" and "happy to help — let me check…"). To remove them, export a new screenshot without them.

## Logo

The video uses `public/brand/hostastic-logo.png` exactly as supplied. It is only 318×68 px, so at the 620 to 700 px it is shown at, it is slightly soft. If you drop a vector or larger export at `public/brand/hostastic-logo.svg`, it is used instead.

## Voiceover

The voiceover is generated by `voiceover/build.py` from `voiceover/script.json`. That file holds the lines, voice, speed, lead-in and gap. The script also:

- writes `public/audio/voiceover.wav` and `src/timeline.json`, which hold the scene, line and caption times the video follows;
- respells words the TTS mispronounces: "Air B N B", "Booking dot com", "Verbo" for Vrbo, and a phoneme override so "Hostastic" is said "host-AS-tic". The captions still show the brand spellings.

To regenerate:

```bash
pip install -r voiceover/requirements.txt
mkdir -p models && cd models
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
cd .. && python voiceover/build.py models
npm run render
```

### Using your own recorded voice

Record against `renders/timing-sheet.md`, then either:

- replace `public/audio/voiceover.wav` with your take (same timings) and run `npm run finish`, or
- swap the audio straight into the finished video:

```bash
ffmpeg -i renders/hostastic-explainer-no-music.mp4 -i my-voice.wav \
  -map 0:v -map 1:a -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" \
  -c:a aac -b:a 192k -ar 48000 -shortest hostastic-explainer-my-voice.mp4
```

## Music

The music sites weren't reachable from the environment that built this, so no track is included. Pick an instrumental track whose license you can verify:

| Source | License | Where to look |
|---|---|---|
| [Pixabay Music](https://pixabay.com/music/) | Pixabay Content License | search "upbeat corporate", "corporate background", "inspiring corporate" |
| YouTube Audio Library (YouTube Studio → Audio Library) | filter **Attribution not required** | search "corporate"; mood Bright or Happy |
| [FreePD](https://freepd.com/) | Public domain / CC0 | Upbeat and Electronic categories |

Look for soft, upbeat corporate, around 100 to 110 BPM, with no vocals. Keep a copy of the license page.

Then run:

```bash
npm run finish -- --music path/to/track.mp3   # or save it as public/audio/music.mp3
```

The mix sets the music about 18 dB under the voice and lifts it where there is no voice, with a 1 s fade in and a 2 s fade out. It then loudness-normalises everything to -14 LUFS and writes `renders/hostastic-explainer.mp4`.

## Content rules followed

- No em dashes or double dashes in on-screen text.
- The word "Dashboard" never appears.
- The platform is never called free. Pricing is a flat $10 per rental with no commission on guest invoices, and only Reporting is described as free for every user.
- The end-card button says "Get started", with hostasticnow.com below it.
- Scene 1 shows the five tools as labels, not as invented app UI.

## Licensing

- **Remotion:** free for individuals and companies of up to 3 people; larger companies need a license (<https://www.remotion.dev/license>).
- **Kokoro model:** Apache-2.0.
- **Inter and DM Serif Display:** SIL Open Font License.
