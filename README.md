# Hostastic explainer video

A ~76-second, 7-scene explainer for the Hostastic website, built with [Remotion](https://www.remotion.dev/) (React → MP4). It follows the storyboard in the Hostastic explainer script (`hostastic-explainer-script.md`), and `src/script.ts` holds that script as data.

- **Format:** 1920×1080, 30 fps, H.264 MP4
- **Look:** flat 2D motion graphics, teal-and-white SaaS palette, muted colors in the opening "problem" scene
- **Captions:** the full voiceover is burned in, because landing pages usually autoplay muted. A caption-free version and `.srt`/`.vtt` files are also available.

## Rendered files

`renders/` holds the latest render: `hostastic-explainer.mp4` (with burned-in captions), plus `captions.srt` and `captions.vtt` for players that load caption tracks.

## Quick start

```bash
npm install
npm run studio        # live preview + scrubbing in the browser
npm run render        # → out/hostastic-explainer.mp4 (burned-in captions)
npm run render:clean  # → out/hostastic-explainer-no-captions.mp4
npm run captions      # → out/captions.srt + out/captions.vtt
npm run still         # → out/poster.png (end card)
```

If you can't download Chrome (CI or an offline sandbox), point Remotion at a local Chrome or headless shell:

```bash
REMOTION_BROWSER_EXECUTABLE=/path/to/chrome npm run render
```

## Scenes

| # | Time | Scene | On-screen text | File |
|---|------|-------|----------------|------|
| 1 | 0:00–0:06 | The Problem | 5 platforms. 1 calendar. 0 peace of mind. | `src/scenes/Scene1Problem.tsx` |
| 2 | 0:06–0:12 | The Solution | Hostastic — everything, in one place. | `src/scenes/Scene2Solution.tsx` |
| 3 | 0:12–0:24 | Channel Manager | Sync once. Update everywhere. | `src/scenes/Scene3Channels.tsx` |
| 4 | 0:24–0:36 | Direct Booking / Website | Your brand. Your booking. 0% commission. | `src/scenes/Scene4Direct.tsx` |
| 5 | 0:36–0:50 | AI Guest Communication | Instant answers. Any language. Any hour. | `src/scenes/Scene5AI.tsx` |
| 6 | 0:50–1:04 | Reporting | Every number. Zero extra cost. | `src/scenes/Scene6Reporting.tsx` |
| 7 | 1:04–1:16 | Close / CTA | One platform. Every booking channel. Get started free. / hostasticnow.com | `src/scenes/Scene7Close.tsx` |

In Scene 2, the logo lockup supplies "Hostastic", so the line under it reads "Everything, in one place."

## Making changes

- **Copy, timings and captions:** `src/script.ts` holds the storyboard as data: scene times, on-screen text, VO lines and caption cues. Once the real VO is recorded, nudge the caption `from`/`to` times to match it.
- **Colors and fonts:** `src/theme.ts`. Fonts (Inter and Plus Jakarta Sans) are bundled from npm, so rendering never calls Google Fonts.
- **Logo:** the emblem is a placeholder. Put the real mark at `public/brand/logo-mark.svg` (or `.png`) and it replaces the placeholder everywhere: the intro, the app sidebar, the laptop lid and the end card.
- **Audio:** these optional files are picked up automatically if present:
  - `public/audio/music.mp3`: music bed. It lifts at the Scene 2 transition and fades out at the end.
  - `public/audio/voiceover.mp3`: the full VO as one take starting at 0:00, **or**
  - `public/audio/vo-<scene-id>.mp3`: one file per scene (`problem`, `solution`, `channels`, `direct`, `ai`, `reporting`, `close`).

## Production notes carried over from the script

- Scene 6 never uses the word "Dashboard", per the client note.
- AI automations (pre-arrival messages, cleaning/maintenance workflows) are intentionally left out until they ship.
- Airbnb, Booking.com and Vrbo appear as stylized color badges with initials, not their official logos. If you want the official marks, swap them in following each brand's guidelines.
- "Coastline Stays" in Scene 4 is a fictional host brand. It shows that the booking site carries the host's own branding, with no third-party logos.

## Licensing

Remotion is free for individuals and for companies with up to 3 employees. Larger companies need a company license; see <https://www.remotion.dev/license>.
