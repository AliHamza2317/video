// Mixes, loudness-normalises and packages the rendered video.
//
//   node scripts/finish.mjs [--video out/video.mp4] [--music path/to/track.mp3]
//
// Inputs:  the silent render (npm run render:video), public/audio/voiceover.wav,
//          and optionally a music file (or public/audio/music.mp3|wav|m4a).
// Outputs (renders/):
//   hostastic-explainer-no-music.mp4   H.264 + AAC, voice only, -14 LUFS
//   hostastic-explainer.mp4            H.264 + AAC, voice + music (only with music)
//   hostastic-voiceover.wav / .mp3     the narration on its own, -14 LUFS
//   hostastic-explainer.srt            captions matching the burned-in ones
//   timing-sheet.csv / .md             scene, line and caption timings
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};

const TARGET_LUFS = -14;
const TRUE_PEAK = -1.5;
const MUSIC_UNDER_VOICE_DB = 18;
const MUSIC_LIFT_DB = 8; // music comes up where there is no voice (end card)
const FADE_IN = 1;
const FADE_OUT = 2;

const timeline = JSON.parse(readFileSync('src/timeline.json', 'utf8'));
const DUR = timeline.duration;
const video = opt('video', 'out/video.mp4');
const vo = 'public/audio/voiceover.wav';
const music =
  opt('music') ?? ['public/audio/music.mp3', 'public/audio/music.wav', 'public/audio/music.m4a'].find((f) => existsSync(f));

if (!existsSync(video)) throw new Error(`Missing ${video}. Run: npm run render:video`);
mkdirSync('renders', {recursive: true});
mkdirSync('out/audio', {recursive: true});

/** Runs ffmpeg and returns its log (stderr). */
const ffmpeg = (...a) => {
  try {
    return execFileSync('ffmpeg', ['-hide_banner', '-nostats', ...a], {stdio: ['ignore', 'ignore', 'pipe'], maxBuffer: 1 << 26}).toString();
  } catch (e) {
    throw new Error(`ffmpeg ${a.join(' ')}\n${e.stderr?.toString() ?? e}`);
  }
};

/** Two-pass EBU R128 loudness normalisation (linear gain when possible). */
const normalize = (input, output, lufs) => {
  const base = `loudnorm=I=${lufs}:TP=${TRUE_PEAK}:LRA=11`;
  const log = ffmpeg('-i', input, '-af', `${base}:print_format=json`, '-f', 'null', '-');
  const m = JSON.parse(log.slice(log.lastIndexOf('{'), log.lastIndexOf('}') + 1));
  const pass2 =
    `${base}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}` +
    `:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
  ffmpeg('-y', '-i', input, '-af', pass2, '-ar', '48000', '-c:a', 'pcm_s24le', output);
};

const measure = (file) => {
  const log = ffmpeg('-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-');
  const summary = log.slice(log.lastIndexOf('Summary:'));
  return {
    lufs: Number(summary.match(/I:\s+(-?[\d.]+) LUFS/)[1]),
    truePeak: Number(summary.match(/Peak:\s+(-?[\d.]+) dBFS/)[1]),
  };
};

// 1. Voice, padded to the full length, at -14 LUFS.
const voPadded = 'out/audio/vo-48k.wav';
ffmpeg('-y', '-i', vo, '-af', `aresample=48000:resampler=soxr,apad=whole_dur=${DUR}`, '-t', String(DUR), '-c:a', 'pcm_s24le', voPadded);
const voMaster = 'out/audio/vo-master.wav';
normalize(voPadded, voMaster, TARGET_LUFS);

// 2. Optional music bed: about -18 dB under the voice, lifted where there is
//    no voice, 1 s fade in, 2 s fade out.
let mixMaster = null;
if (music) {
  const bed = 'out/audio/music-bed.wav';
  ffmpeg('-y', '-stream_loop', '-1', '-i', music, '-t', String(DUR), '-af', 'aresample=48000:resampler=soxr', '-ac', '2', '-c:a', 'pcm_s24le', bed);
  const bedNorm = 'out/audio/music-norm.wav';
  normalize(bed, bedNorm, TARGET_LUFS - MUSIC_UNDER_VOICE_DB);

  const a = timeline.lines[0].start - 0.15;
  const b = timeline.lines.at(-1).end + 0.15;
  const g = Math.pow(10, MUSIC_LIFT_DB / 20).toFixed(4);
  const r = 0.3;
  const env =
    `if(lt(t,${a - r}),${g},if(lt(t,${a}),${g}+(1-${g})*(t-${a - r})/${r},` +
    `if(lt(t,${b}),1,if(lt(t,${b + r}),1+(${g}-1)*(t-${b})/${r},${g}))))`;
  const musicFx = `volume='${env}':eval=frame,afade=t=in:d=${FADE_IN},afade=t=out:st=${DUR - FADE_OUT}:d=${FADE_OUT}`;
  const mix = 'out/audio/mix.wav';
  ffmpeg(
    '-y', '-i', voMaster, '-i', bedNorm,
    '-filter_complex', `[0:a]aformat=channel_layouts=stereo[v];[1:a]${musicFx}[m];[v][m]amix=inputs=2:normalize=0:duration=first[out]`,
    '-map', '[out]', '-c:a', 'pcm_s24le', mix,
  );
  mixMaster = 'out/audio/mix-master.wav';
  normalize(mix, mixMaster, TARGET_LUFS);
}

// 3. Mux with the silent render.
const mux = (audio, output) =>
  ffmpeg('-y', '-i', video, '-i', audio, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
    '-ar', '48000', '-ac', '2', '-shortest', '-movflags', '+faststart', output);
mux(voMaster, 'renders/hostastic-explainer-no-music.mp4');
if (mixMaster) mux(mixMaster, 'renders/hostastic-explainer.mp4');

// 4. Voiceover on its own.
ffmpeg('-y', '-i', voMaster, '-c:a', 'pcm_s16le', '-ar', '48000', 'renders/hostastic-voiceover.wav');
ffmpeg('-y', '-i', voMaster, '-c:a', 'libmp3lame', '-b:a', '192k', '-ar', '48000', 'renders/hostastic-voiceover.mp3');

// 5. Captions (same cues as the burned-in ones) and timing sheet.
const stamp = (t, sep) => {
  const ms = Math.round(t * 1000);
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)}${sep}${p(ms % 1000, 3)}`;
};
const cues = timeline.lines.flatMap((line, li) =>
  line.cues.map((c, ci) => ({
    text: c.text,
    start: c.start,
    end: line.cues[ci + 1]?.start ?? timeline.lines[li + 1]?.start ?? line.end + 0.8,
  })),
);
writeFileSync(
  'renders/hostastic-explainer.srt',
  cues.map((c, i) => `${i + 1}\n${stamp(c.start, ',')} --> ${stamp(c.end, ',')}\n${c.text}\n`).join('\n'),
);

const f2 = (n) => n.toFixed(2);
const rows = timeline.scenes.map((s, i) => ({scene: `${i + 1}. ${s.id}`, s, line: timeline.lines[i]}));
writeFileSync(
  'renders/timing-sheet.csv',
  'scene,scene_start,scene_end,vo_start,vo_end,line\n' +
    rows.map(({scene, s, line}) => [scene, f2(s.start), f2(s.end), f2(line.start), f2(line.end), `"${line.text}"`].join(',')).join('\n') +
    '\n',
);
writeFileSync(
  'renders/timing-sheet.md',
  `# Hostastic explainer: timing sheet\n\nTotal ${f2(DUR)} s at ${timeline.fps} fps. All times in seconds.\n\n` +
    '| Scene | Start | End | VO start | VO end | Line |\n|---|---|---|---|---|---|\n' +
    rows.map(({scene, s, line}) => `| ${scene} | ${f2(s.start)} | ${f2(s.end)} | ${f2(line.start)} | ${f2(line.end)} | ${line.text} |`).join('\n') +
    '\n\n## Caption cues\n\n| # | Start | End | Text |\n|---|---|---|---|\n' +
    cues.map((c, i) => `| ${i + 1} | ${f2(c.start)} | ${f2(c.end)} | ${c.text} |`).join('\n') +
    '\n',
);

// 6. Report.
const outputs = ['renders/hostastic-explainer-no-music.mp4', mixMaster && 'renders/hostastic-explainer.mp4', 'renders/hostastic-voiceover.wav'];
for (const f of outputs.filter(Boolean)) {
  const {lufs, truePeak} = measure(f);
  console.log(`${f}: ${lufs} LUFS integrated, true peak ${truePeak} dBFS`);
}
console.log(music ? `Music: ${music}` : 'No music file found, so only the voice-only version was made. Add one with --music <file>.');
