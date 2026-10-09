import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {FileSpreadsheet, MessageSquare, TriangleAlert} from 'lucide-react';
import {pop, tween} from '../anim';
import {HostCharacter} from '../components/HostCharacter';
import {useSceneFrame} from '../sceneTime';
import {colors, fonts} from '../theme';

type Kind = 'calendar' | 'list' | 'sheet' | 'chat';

type Win = {
  title: string;
  bar: string;
  kind: Kind;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  at: number;
  badge?: string;
};

// Five tools: three booking sites, a spreadsheet and a messaging app.
// Array order is stacking order; `at` is when each one pops up.
const WINDOWS: Win[] = [
  {title: 'Airbnb · Calendar', bar: colors.airbnb, kind: 'calendar', x: 96, y: 236, w: 430, h: 272, rotate: -6, at: 6, badge: '3'},
  {title: 'Booking.com · Extranet', bar: colors.booking, kind: 'list', x: 1400, y: 216, w: 430, h: 262, rotate: 5, at: 16, badge: '!'},
  {title: 'bookings_FINAL_v3.xlsx', bar: '#2E7D4F', kind: 'sheet', x: 170, y: 574, w: 440, h: 262, rotate: 4, at: 26},
  {title: 'Messages', bar: '#6B7A86', kind: 'chat', x: 1120, y: 352, w: 330, h: 236, rotate: 7, at: 48, badge: '12'},
  {title: 'Vrbo · Reservations', bar: colors.vrbo, kind: 'calendar', x: 1330, y: 556, w: 430, h: 270, rotate: -4, at: 36, badge: '2'},
  {title: 'Airbnb · Inbox', bar: colors.airbnb, kind: 'chat', x: 470, y: 380, w: 300, h: 214, rotate: -8, at: 64, badge: '4'},
];

const HEADLINE: Array<{num: string; rest: string; at: number}> = [
  {num: '5', rest: ' platforms.', at: 10},
  {num: '1', rest: ' calendar.', at: 38},
  {num: '0', rest: ' peace of mind.', at: 66},
];

export const Scene1Problem: React.FC = () => {
  const frame = useSceneFrame();

  // Nervous camera shake that builds as the clutter piles up.
  const shake = tween(frame, 40, 150, 0, 7);
  const sx = (random(`sx-${Math.floor(frame / 2)}`) - 0.5) * 2 * shake;
  const sy = (random(`sy-${Math.floor(frame / 2)}`) - 0.5) * 2 * shake;
  const zoom = tween(frame, 0, 190, 1.0, 1.06);

  return (
    <AbsoluteFill style={{background: colors.dull, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transform: `translate(${sx}px, ${sy}px) scale(${zoom})`,
          filter: 'saturate(0.55) contrast(0.96)',
        }}
      >
        <AbsoluteFill
          style={{background: 'radial-gradient(ellipse at 50% 45%, #E6E2DA 0%, #D2CDC4 55%, #B9B4AB 100%)'}}
        />

        <HostCharacter
          pose="stressed"
          frame={frame}
          width={600}
          shirt="#7D8C99"
          chair="#4A4F55"
          desk="#C9BBA8"
          deskEdge="#B3A48F"
          lid="#D9DDDF"
          style={{position: 'absolute', left: 660, top: 330}}
        />

        {/* Scribbled stress lines */}
        <svg
          width={200}
          height={80}
          viewBox="0 0 200 80"
          style={{position: 'absolute', left: 860, top: 384, opacity: tween(frame, 30, 45, 0, 0.9)}}
        >
          <path
            d={`M20 50 l20 -${18 + Math.sin(frame) * 6} l20 18 l20 -18 l20 18 l20 -18 l20 18 l20 -18 l20 18`}
            stroke={colors.dullInk}
            strokeWidth="5"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>

        {WINDOWS.map((w, i) => (
          <ClutterWindow key={w.title} win={w} frame={frame} index={i} />
        ))}

        <ConflictToast frame={frame} />
      </AbsoluteFill>

      {/* On-screen text */}
      <div
        style={{
          position: 'absolute',
          top: 74,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 34,
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: 66,
          letterSpacing: '-0.03em',
          color: colors.dullInk,
        }}
      >
        {HEADLINE.map(({num, rest, at}) => {
          const p = pop(frame, at, {damping: 12});
          return (
            <span
              key={rest}
              style={{opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px) scale(${0.9 + p * 0.1})`}}
            >
              <span style={{color: colors.alarm}}>{num}</span>
              {rest}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const ClutterWindow: React.FC<{win: Win; frame: number; index: number}> = ({win, frame, index}) => {
  const p = pop(frame, win.at, {damping: 11, stiffness: 180});
  if (frame < win.at) return null;
  const jitter = tween(frame, win.at + 20, 150, 0, 2.5);
  const jx = Math.sin(frame * 1.7 + index * 2) * jitter;
  const jy = Math.cos(frame * 2.1 + index) * jitter;

  return (
    <div
      style={{
        position: 'absolute',
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        transform: `translate(${jx}px, ${jy}px) rotate(${win.rotate}deg) scale(${0.6 + p * 0.4})`,
        opacity: Math.min(1, p * 2),
        background: '#FAFAF8',
        borderRadius: 14,
        boxShadow: '0 18px 40px rgba(40,36,30,0.28)',
        overflow: 'visible',
      }}
    >
      <div
        style={{
          height: 38,
          borderRadius: '14px 14px 0 0',
          background: win.bar,
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: 8,
          color: '#fff',
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 16,
        }}
      >
        {win.kind === 'sheet' ? <FileSpreadsheet size={18} /> : null}
        {win.kind === 'chat' ? <MessageSquare size={18} /> : null}
        {win.title}
      </div>
      <div style={{padding: 14, height: win.h - 38, boxSizing: 'border-box'}}>
        <WindowBody kind={win.kind} accent={win.bar} seed={win.title} />
      </div>
      {win.badge ? (
        <div
          style={{
            position: 'absolute',
            top: -16,
            right: -16,
            minWidth: 40,
            height: 40,
            padding: '0 10px',
            boxSizing: 'border-box',
            borderRadius: 20,
            background: colors.alarm,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: fonts.body,
            fontWeight: 700,
            fontSize: 20,
            transform: `scale(${1 + Math.max(0, Math.sin(frame / 4 + index)) * 0.12})`,
            boxShadow: '0 6px 14px rgba(120,40,30,0.35)',
          }}
        >
          {win.badge}
        </div>
      ) : null}
    </div>
  );
};

const WindowBody: React.FC<{kind: Kind; accent: string; seed: string}> = ({kind, accent, seed}) => {
  if (kind === 'calendar') {
    return (
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, height: '100%'}}>
        {Array.from({length: 28}).map((_, i) => {
          const r = random(`${seed}-${i}`);
          const booked = r > 0.62;
          const clash = r > 0.93;
          return (
            <div
              key={i}
              style={{
                borderRadius: 5,
                background: clash ? colors.alarm : booked ? accent : '#E9E6E1',
                opacity: booked ? 0.85 : 1,
              }}
            />
          );
        })}
      </div>
    );
  }
  if (kind === 'sheet') {
    return (
      <div style={{display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 3, height: '100%'}}>
        {Array.from({length: 32}).map((_, i) => {
          const header = i < 4;
          const flagged = i === 18 || i === 25;
          return (
            <div
              key={i}
              style={{
                background: header ? '#CFE3D6' : flagged ? '#F1C9C2' : '#F1EFEB',
                border: '1px solid #DEDAD3',
                display: 'flex',
                alignItems: 'center',
                padding: '0 6px',
              }}
            >
              <div style={{height: 6, width: `${40 + random(`${seed}${i}`) * 50}%`, background: header ? '#5E8A6E' : '#BDB7AE', borderRadius: 3}} />
            </div>
          );
        })}
      </div>
    );
  }
  if (kind === 'chat') {
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
        {[0.8, 0.55, 0.7, 0.45].map((w, i) => (
          <div
            key={i}
            style={{
              alignSelf: i % 2 ? 'flex-end' : 'flex-start',
              width: `${w * 100}%`,
              height: 30,
              borderRadius: 12,
              background: i % 2 ? '#C9D3DA' : '#E9E6E1',
            }}
          />
        ))}
      </div>
    );
  }
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
      {Array.from({length: 5}).map((_, i) => (
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <div style={{width: 26, height: 26, borderRadius: 13, background: i === 2 ? colors.alarm : accent, opacity: 0.75}} />
          <div style={{flex: 1, height: 9, borderRadius: 5, background: '#DCD8D2'}} />
          <div style={{width: 56, height: 9, borderRadius: 5, background: '#E8E4DE'}} />
        </div>
      ))}
    </div>
  );
};

const ConflictToast: React.FC<{frame: number}> = ({frame}) => {
  const at = 96;
  if (frame < at) return null;
  const p = pop(frame, at, {damping: 10, stiffness: 200});
  const wobble = Math.sin(frame * 1.4) * tween(frame, at, at + 30, 3, 1.2);
  return (
    <div
      style={{
        position: 'absolute',
        left: 960,
        top: 214,
        transform: `translateX(-50%) scale(${p}) rotate(${wobble}deg)`,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 26px',
        borderRadius: 16,
        background: '#FFF5F2',
        border: `2px solid ${colors.alarm}`,
        boxShadow: '0 18px 40px rgba(60,30,20,0.3)',
        fontFamily: fonts.body,
        fontWeight: 700,
        fontSize: 26,
        color: colors.alarm,
        whiteSpace: 'nowrap',
      }}
    >
      <TriangleAlert size={30} strokeWidth={2.6} />
      Double booking? Oct 14 · Airbnb + Vrbo
    </div>
  );
};
