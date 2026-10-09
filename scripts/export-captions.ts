// Writes out/captions.srt and out/captions.vtt from the storyboard in src/script.ts.
// Usage: npm run captions
import {mkdirSync, writeFileSync} from 'node:fs';
import {SCENES} from '../src/script.ts';

const cues = SCENES.flatMap((s) => s.captions);

const stamp = (t: number, sep: ',' | '.') => {
  const ms = Math.round(t * 1000);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const pad = (n: number, w = 2) => String(n).padStart(w, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}${sep}${pad(ms % 1000, 3)}`;
};

const srt = cues.map((c, i) => `${i + 1}\n${stamp(c.from, ',')} --> ${stamp(c.to, ',')}\n${c.text}\n`).join('\n');
const vtt = 'WEBVTT\n\n' + cues.map((c) => `${stamp(c.from, '.')} --> ${stamp(c.to, '.')}\n${c.text}\n`).join('\n');

mkdirSync('out', {recursive: true});
writeFileSync('out/captions.srt', srt);
writeFileSync('out/captions.vtt', vtt);
console.log(`Wrote ${cues.length} cues to out/captions.srt and out/captions.vtt`);
