import React from 'react';
import {getStaticFiles, Img, OffthreadVideo, staticFile} from 'remotion';
import {easeInOut, easeOut, enterScale, tween} from '../anim';
import {FPS, ScreenSpec, sec} from '../script';
import {useSceneFrame} from '../sceneTime';
import {colors, fonts} from '../theme';

const EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'mp4', 'webm', 'mov'];
const VIDEO = new Set(['mp4', 'webm', 'mov']);

export const findScreen = (file: string) => {
  const files = getStaticFiles();
  for (const ext of EXTENSIONS) {
    const name = `screens/${file}.${ext}`;
    if (files.some((f) => f.name === name)) return {src: staticFile(name), video: VIDEO.has(ext)};
  }
  return null;
};

type Box = {x: number; y: number; w: number; h: number};

/** Interpolated camera (centre point + zoom) at a scene time in seconds. */
const cameraAt = (spec: ScreenSpec, t: number) => {
  const keys = spec.camera;
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t <= b.t) {
      const p = easeInOut((t - a.t) / (b.t - a.t));
      return {t, x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, zoom: a.zoom + (b.zoom - a.zoom) * p};
    }
  }
  return keys[keys.length - 1];
};

/**
 * A real app screen (image or screen recording) in a rounded frame, with a
 * slow push-in / pan, highlight rings and cursor clicks. Without the asset it
 * shows a clearly labelled placeholder that animates the same way.
 */
export const ScreenStage: React.FC<{spec: ScreenSpec; box: Box}> = ({spec, box}) => {
  const frame = useSceneFrame();
  const t = frame / FPS;
  const media = findScreen(spec.file);

  // Canvas covers the frame at zoom 1.
  const frameAspect = box.w / box.h;
  const cw = spec.aspect >= frameAspect ? box.h * spec.aspect : box.w;
  const ch = spec.aspect >= frameAspect ? box.h : box.w / spec.aspect;

  const cam = cameraAt(spec, t);
  const s = cam.zoom;
  const tx = Math.min(0, Math.max(box.w - cw * s, box.w / 2 - cam.x * cw * s));
  const ty = Math.min(0, Math.max(box.h - ch * s, box.h / 2 - cam.y * ch * s));

  return (
    <div
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        borderRadius: 24,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 30px 70px rgba(60,40,20,0.14), 0 6px 18px rgba(60,40,20,0.07)',
        outline: `1px solid ${colors.line}`,
        ...enterScale(frame, -4, 0.96),
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: cw,
          height: ch,
          transformOrigin: '0 0',
          transform: `translate(${tx}px, ${ty}px) scale(${s})`,
        }}
      >
        {media ? (
          media.video ? (
            <OffthreadVideo
              src={media.src}
              muted
              startFrom={sec(spec.videoStart ?? 0)}
              style={{width: '100%', height: '100%', objectFit: 'cover'}}
            />
          ) : (
            <Img src={media.src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          )
        ) : (
          <PlaceholderCanvas label={spec.label} />
        )}
        {spec.rings.map((r, i) => (
          <HighlightRing key={i} ring={r} cw={cw} ch={ch} zoom={s} frame={frame} until={spec.rings[i + 1]?.t} />
        ))}
        {spec.clicks.map((c, i) => (
          <CursorClick key={i} click={c} cw={cw} ch={ch} zoom={s} frame={frame} />
        ))}
      </div>
      {media ? null : <PlaceholderTag label={spec.label} file={spec.file} />}
    </div>
  );
};

const HighlightRing: React.FC<{
  ring: ScreenSpec['rings'][number];
  cw: number;
  ch: number;
  zoom: number;
  frame: number;
  until?: number;
}> = ({ring, cw, ch, zoom, frame, until}) => {
  const start = sec(ring.t);
  // Each ring holds for `hold` seconds (default 2.4) or until the next one.
  const end = Math.min(until !== undefined ? sec(until) : Infinity, sec(ring.t + (ring.hold ?? 2.4)));
  if (frame < start) return null;
  const p = tween(frame, start, start + 12, 0, 1, easeOut);
  const out = end === Infinity ? 1 : tween(frame, end - 2, end + 8, 1, 0);
  const pulse = 0.5 + 0.5 * Math.sin(((frame - start) / FPS) * Math.PI * 1.6);
  const stroke = 5 / zoom;
  return (
    <div
      style={{
        position: 'absolute',
        left: ring.x * cw,
        top: ring.y * ch,
        width: ring.w * cw,
        height: ring.h * ch,
        borderRadius: 18 / zoom,
        border: `${stroke}px solid ${colors.orange}`,
        boxShadow: `0 0 0 ${(6 + pulse * 6) / zoom}px rgba(247,142,82,${0.2 + pulse * 0.12}), 0 0 ${30 / zoom}px rgba(247,142,82,0.4)`,
        opacity: p * out,
        transform: `scale(${1.08 - 0.08 * p})`,
      }}
    />
  );
};

const CursorClick: React.FC<{
  click: ScreenSpec['clicks'][number];
  cw: number;
  ch: number;
  zoom: number;
  frame: number;
}> = ({click, cw, ch, zoom, frame}) => {
  const at = sec(click.t);
  const arrive = at - 14; // 0.45 s glide, ease-out
  if (frame < arrive - 2) return null;
  const move = tween(frame, arrive, at - 2, 0, 1, easeOut);
  const x = (click.x + (1 - move) * 0.1) * cw;
  const y = (click.y + (1 - move) * 0.12) * ch;
  const pressed = frame >= at && frame < at + 5;
  const ripple = tween(frame, at, at + 14, 0, 1, easeOut);
  const fade = tween(frame, at + 36, at + 46, 1, 0);
  const size = 46 / zoom;
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: Math.min(fade, tween(frame, arrive - 2, arrive + 4, 0, 1))}}>
      {frame >= at ? (
        <div
          style={{
            position: 'absolute',
            left: -40 / zoom,
            top: -40 / zoom,
            width: 80 / zoom,
            height: 80 / zoom,
            borderRadius: '50%',
            border: `${4 / zoom}px solid ${colors.orange}`,
            transform: `scale(${0.3 + ripple})`,
            opacity: 1 - ripple,
          }}
        />
      ) : null}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{position: 'absolute', left: -size * 0.12, top: -size * 0.06, transform: `scale(${pressed ? 0.86 : 1})`, transformOrigin: '10% 6%', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.3))'}}
      >
        <path d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.6 L11 13.4 L18 13.4 Z" fill={colors.ink} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const PlaceholderCanvas: React.FC<{label: string}> = ({label}) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'repeating-linear-gradient(45deg, #FBF3EA 0px, #FBF3EA 26px, #F3E8DC 26px, #F3E8DC 52px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      border: '6px dashed #D2BFAE',
    }}
  >
    <div style={{fontFamily: fonts.display, fontSize: 64, color: '#C8B3A1', textAlign: 'center', lineHeight: 1.1}}>
      PLACEHOLDER
      <br />
      {label}
    </div>
  </div>
);

const PlaceholderTag: React.FC<{label: string; file: string}> = ({label, file}) => (
  <div
    style={{
      position: 'absolute',
      left: 22,
      top: 22,
      padding: '12px 18px',
      borderRadius: 14,
      background: '#FFF4D6',
      border: '2px solid #E2A42B',
      color: '#7A4E00',
      fontFamily: fonts.body,
      fontSize: 22,
      fontWeight: 600,
      lineHeight: 1.35,
      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
    }}
  >
    <div style={{fontWeight: 800, letterSpacing: '0.04em'}}>PLACEHOLDER: {label} missing</div>
    <div style={{fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 19}}>public/screens/{file}.png (or .mp4)</div>
  </div>
);
