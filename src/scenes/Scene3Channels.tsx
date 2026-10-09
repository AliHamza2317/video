import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Check, ChevronLeft, ChevronRight, CircleCheck, Link2, Lock, RefreshCw} from 'lucide-react';
import {easeInOut, fadeUp, pop, settle, tween} from '../anim';
import {Backdrop} from '../components/Backdrop';
import {Channel, CHANNELS, ChannelTile} from '../components/ChannelTile';
import {Headline} from '../components/Headline';
import {Card, Chip} from '../components/ui';
import {useSceneFrame} from '../sceneTime';
import {colors, fonts} from '../theme';

// Layout
const CAL = {x: 830, y: 192, w: 600, h: 522};
const CELL_GAP = 6;
const GRID_TOP = 158; // inside card
const CELL_W = (CAL.w - 48 - CELL_GAP * 6) / 7;
const CELL_H = 62;

const TILE_X = 1690;
const TILE_SIZE = 108;

type Node = {channel: Channel; y: number; anchorY: number; from: [number, number]; at: number};
const NODES: Node[] = [
  {channel: 'airbnb', y: 196, anchorY: CAL.y + 140, from: [2200, -260], at: 22},
  {channel: 'booking', y: 416, anchorY: CAL.y + 270, from: [2300, 416], at: 30},
  {channel: 'vrbo', y: 636, anchorY: CAL.y + 400, from: [2200, 1300], at: 38},
];

type Booking = {channel: Channel; days: number[]; at: number};
const EVENTS: Booking[] = [
  {channel: 'airbnb', days: [14, 15, 16], at: 112},
  {channel: 'booking', days: [21, 22, 23], at: 228},
];

const EXISTING: Array<{channel: Channel | 'direct'; days: number[]}> = [
  {channel: 'vrbo', days: [5, 6, 7]},
  {channel: 'direct', days: [9, 10, 11]},
  {channel: 'airbnb', days: [27, 28, 29]},
];

// October 2026 starts on a Thursday; grid weeks start on Monday.
const FIRST_WEEKDAY = 3;
const cellPos = (day: number) => {
  const idx = FIRST_WEEKDAY + day - 1;
  return {col: idx % 7, row: Math.floor(idx / 7)};
};
const cellXY = (day: number) => {
  const {col, row} = cellPos(day);
  return {x: 24 + col * (CELL_W + CELL_GAP), y: GRID_TOP + row * (CELL_H + CELL_GAP)};
};

const channelColor = (c: Channel | 'direct') => (c === 'direct' ? colors.direct : CHANNELS[c].color);

// Cubic bezier from a tile to the calendar's right edge.
const curve = (n: Node) => {
  const x0 = TILE_X - TILE_SIZE / 2 - 18;
  const y0 = n.y + TILE_SIZE / 2;
  const x1 = CAL.x + CAL.w;
  const y1 = n.anchorY;
  const mx = (x0 + x1) / 2;
  return {pts: [x0, y0, mx, y0, mx, y1, x1, y1] as const, d: `M${x0} ${y0} C${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`};
};
const bezierAt = (p: readonly number[], t: number) => {
  const u = 1 - t;
  const x = u * u * u * p[0] + 3 * u * u * t * p[2] + 3 * u * t * t * p[4] + t * t * t * p[6];
  const y = u * u * u * p[1] + 3 * u * u * t * p[3] + 3 * u * t * t * p[5] + t * t * t * p[7];
  return {x, y};
};

export const Scene3Channels: React.FC = () => {
  const frame = useSceneFrame();
  const cardIn = settle(frame, 4, 26);
  const syncedAt = 196;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop grid drift={-frame * 0.25} />

      <Headline
        chip={{icon: RefreshCw, label: 'Channel Manager'}}
        lines={['Sync once.', 'Update everywhere.']}
        highlight={[1]}
        sub="Airbnb, Booking.com and Vrbo share one calendar — automatically."
        size={68}
        style={{position: 'absolute', left: 116, top: 300, width: 680}}
      />

      {/* Connector lines + travelling sync pulses */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {NODES.map((n) => {
          const {d} = curve(n);
          const draw = tween(frame, n.at + 26, n.at + 56, 0, 1, easeInOut);
          return (
            <path
              key={n.channel}
              d={d}
              pathLength={1}
              stroke={colors.teal}
              strokeOpacity={0.45}
              strokeWidth={4}
              strokeDasharray="1 1"
              strokeDashoffset={1 - draw}
              fill="none"
              strokeLinecap="round"
            />
          );
        })}
        {EVENTS.flatMap((e) =>
          NODES.map((n) => {
            const {pts} = curve(n);
            const isSource = n.channel === e.channel;
            // Source: tile → calendar. Others: calendar → tile.
            const start = isSource ? e.at : e.at + 40;
            const t = tween(frame, start, start + 22, 0, 1, easeInOut);
            if (frame < start || frame > start + 24) return null;
            const pt = bezierAt(pts, isSource ? t : 1 - t);
            return (
              <circle
                key={`${e.at}-${n.channel}`}
                cx={pt.x}
                cy={pt.y}
                r={11}
                fill={isSource ? channelColor(e.channel) : colors.teal}
                stroke="#fff"
                strokeWidth={4}
              />
            );
          }),
        )}
      </svg>

      {/* Central calendar */}
      <div
        style={{
          position: 'absolute',
          left: CAL.x,
          top: CAL.y,
          transform: `scale(${0.85 + cardIn * 0.15})`,
          opacity: cardIn,
        }}
      >
        <Card style={{width: CAL.w, height: CAL.h, position: 'relative', overflow: 'hidden'}}>
          <div style={{padding: '22px 24px 0', fontFamily: fonts.body}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{fontSize: 24, fontWeight: 700, color: colors.ink}}>Seaside Loft</div>
              <Chip icon={Link2} label="3 channels" size={16} />
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 18, color: colors.slate}}>
              <ChevronLeft size={20} />
              <span style={{fontSize: 18, fontWeight: 600, color: colors.ink}}>October 2026</span>
              <ChevronRight size={20} />
            </div>
            <div style={{display: 'flex', marginTop: 16, gap: CELL_GAP}}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} style={{width: CELL_W, textAlign: 'center', fontSize: 14, fontWeight: 600, color: colors.muted}}>
                  {d}
                </div>
              ))}
            </div>
          </div>
          <CalendarGrid frame={frame} />
        </Card>
      </div>

      {/* Channel tiles fly in from the corners */}
      {NODES.map((n) => {
        const p = pop(frame, n.at, {damping: 15, stiffness: 120});
        const x = interpolate(p, [0, 1], [n.from[0], TILE_X]);
        const y = interpolate(p, [0, 1], [n.from[1], n.y]);
        return (
          <div key={n.channel} style={{position: 'absolute', left: x - 90, top: y, width: 180}}>
            <ChannelTile channel={n.channel} size={TILE_SIZE}>
              <TileSyncState frame={frame} channel={n.channel} />
            </ChannelTile>
          </div>
        );
      })}

      {/* Status line */}
      <div
        style={{
          ...fadeUp(frame, syncedAt, 18),
          position: 'absolute',
          left: CAL.x,
          width: CAL.w,
          top: CAL.y + CAL.h + 26,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Chip icon={CircleCheck} label="All channels in sync · 0 double bookings" size={21} background="#fff" style={{boxShadow: '0 8px 20px rgba(14,47,56,0.08)'}} />
      </div>
    </AbsoluteFill>
  );
};

const CalendarGrid: React.FC<{frame: number}> = ({frame}) => {
  const fillFor = (day: number) => {
    const existing = EXISTING.find((e) => e.days.includes(day));
    if (existing) return {color: channelColor(existing.channel), strength: 0.22, p: 1};
    const ev = EVENTS.find((e) => e.days.includes(day));
    if (ev) {
      const p = pop(frame, ev.at + 20 + ev.days.indexOf(day) * 3, {damping: 12});
      return {color: channelColor(ev.channel), strength: 1, p};
    }
    return null;
  };

  return (
    <>
      {Array.from({length: 31}).map((_, i) => {
        const day = i + 1;
        const {x, y} = cellXY(day);
        const fill = fillFor(day);
        const strong = fill && fill.strength === 1 && fill.p > 0.05;
        return (
          <div
            key={day}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: CELL_W,
              height: CELL_H,
              borderRadius: 12,
              background: '#F2F7F7',
              overflow: 'hidden',
            }}
          >
            {fill ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: fill.color,
                  opacity: fill.strength,
                  transform: `scale(${fill.p})`,
                  borderRadius: 12,
                }}
              />
            ) : null}
            <span
              style={{
                position: 'absolute',
                left: 10,
                top: 8,
                fontFamily: fonts.body,
                fontSize: 16,
                fontWeight: 600,
                color: strong ? '#fff' : colors.ink,
              }}
            >
              {day}
            </span>
          </div>
        );
      })}
      {EVENTS.map((e) => (
        <RangeLock key={e.at} event={e} frame={frame} />
      ))}
    </>
  );
};

/** Lock that snaps onto a newly booked range, then ripples outward. */
const RangeLock: React.FC<{event: Booking; frame: number}> = ({event, frame}) => {
  const at = event.at + 32;
  if (frame < at) return null;
  const a = cellXY(event.days[0]);
  const b = cellXY(event.days[event.days.length - 1]);
  const cx = (a.x + b.x + CELL_W) / 2;
  const cy = a.y + CELL_H / 2;
  const snap = pop(frame, at, {damping: 9, stiffness: 260});
  const ripple = tween(frame, at + 4, at + 34, 0, 1);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: cx - 30,
          top: cy - 30,
          width: 60,
          height: 60,
          borderRadius: 30,
          border: `3px solid ${channelColor(event.channel)}`,
          transform: `scale(${1 + ripple * 2.2})`,
          opacity: (1 - ripple) * 0.8,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: cx - 24,
          top: cy - 24,
          width: 48,
          height: 48,
          borderRadius: 24,
          background: '#fff',
          color: channelColor(event.channel),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${snap})`,
          boxShadow: '0 6px 16px rgba(14,47,56,0.25)',
        }}
      >
        <Lock size={24} strokeWidth={2.8} />
      </div>
    </>
  );
};

/** Lock badge + faint echo on a tile once a booking from another channel lands. */
const TileSyncState: React.FC<{frame: number; channel: Channel}> = ({frame, channel}) => {
  const latest = [...EVENTS].reverse().find((e) => frame >= e.at + 60);
  const arriving = EVENTS.find((e) => frame >= e.at + 58 && frame < e.at + 100);
  if (!latest) return null;
  const isSource = latest.channel === channel;
  const at = latest.at + 60;
  const p = pop(frame, at, {damping: 10, stiffness: 220});
  const echo = arriving ? tween(frame, arriving.at + 58, arriving.at + 90, 0, 1) : 1;
  return (
    <>
      {arriving && !isSource ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            opacity: (1 - echo) * 0.9,
            transform: `scale(${1 + echo * 0.9})`,
          }}
        >
          <Lock size={58} strokeWidth={2.4} />
        </div>
      ) : null}
      <div
        style={{
          position: 'absolute',
          right: -12,
          top: -12,
          width: 40,
          height: 40,
          borderRadius: 20,
          background: '#fff',
          color: colors.teal,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${p})`,
          boxShadow: '0 6px 14px rgba(14,47,56,0.25)',
        }}
      >
        {isSource ? <Check size={22} strokeWidth={3.2} /> : <Lock size={20} strokeWidth={2.8} />}
      </div>
    </>
  );
};
