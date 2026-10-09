import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {CalendarDays, FileSpreadsheet, MessageSquare, TriangleAlert} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {enterScale, tween} from '../anim';
import {Headline} from '../components/Headline';
import {HostCharacter} from '../components/HostCharacter';
import {HEADLINES} from '../script';
import {useSceneFrame} from '../sceneTime';
import {colors, fonts} from '../theme';

// Five tools, shown as labels (not app UI) piling up around the host.
const TOOLS: Array<{label: string; color: string; icon: LucideIcon; x: number; y: number; rotate: number; badge: string}> = [
  {label: 'Airbnb', color: colors.airbnb, icon: CalendarDays, x: 1010, y: 250, rotate: -6, badge: '3'},
  {label: 'Booking.com', color: colors.booking, icon: CalendarDays, x: 1500, y: 196, rotate: 5, badge: '!'},
  {label: 'Vrbo', color: colors.vrbo, icon: CalendarDays, x: 1700, y: 420, rotate: -4, badge: '2'},
  {label: 'Spreadsheet', color: '#2E7D4F', icon: FileSpreadsheet, x: 1040, y: 610, rotate: 4, badge: ''},
  {label: 'Messages', color: '#5E6E7A', icon: MessageSquare, x: 1690, y: 650, rotate: 6, badge: '12'},
];

export const ProblemScene: React.FC = () => {
  const frame = useSceneFrame();
  const shake = tween(frame, 20, 140, 0, 4);
  const sx = (random(`sx-${Math.floor(frame / 2)}`) - 0.5) * 2 * shake;
  const sy = (random(`sy-${Math.floor(frame / 2)}`) - 0.5) * 2 * shake;
  const push = tween(frame, 0, 160, 1, 1.04, (x) => x);

  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 65% 45%, #E8E4DD 0%, #D6D1C9 60%, #C3BEB5 100%)', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px) scale(${push})`, transformOrigin: '1300px 540px', filter: 'saturate(0.6)'}}>
        <HostCharacter
          pose="stressed"
          frame={frame}
          width={560}
          shirt="#7D8C99"
          chair="#4A4F55"
          desk="#C9BBA8"
          deskEdge="#B3A48F"
          lid="#D9DDDF"
          style={{position: 'absolute', left: 1050, top: 318}}
        />
        {TOOLS.map((tool, i) => (
          <ToolChip key={tool.label} tool={tool} frame={frame} index={i} />
        ))}
        <ConflictAlert frame={frame} />
      </AbsoluteFill>

      <Headline
        spec={HEADLINES.problem}
        size={84}
        color={colors.dullInk}
        accentColor={colors.alarm}
        style={{position: 'absolute', left: 110, top: 250}}
      />
    </AbsoluteFill>
  );
};

const ToolChip: React.FC<{tool: (typeof TOOLS)[number]; frame: number; index: number}> = ({tool, frame, index}) => {
  const at = -4 + index; // all five fully in by 0.3 s
  const jitter = tween(frame, 20, 140, 0.5, 2.5);
  const jx = Math.sin(frame * 1.6 + index * 2) * jitter;
  const jy = Math.cos(frame * 2.0 + index) * jitter;
  const Icon = tool.icon;
  const e = enterScale(frame, at, 0.7, 9);
  return (
    <div
      style={{
        position: 'absolute',
        left: tool.x,
        top: tool.y,
        opacity: e.opacity,
        transform: `translate(-50%, -50%) translate(${jx}px, ${jy}px) rotate(${tool.rotate}deg) ${e.transform}`,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 24px 16px 16px',
        borderRadius: 20,
        background: '#FBFAF8',
        boxShadow: '0 16px 34px rgba(40,36,30,0.26)',
        fontFamily: fonts.body,
        fontWeight: 700,
        fontSize: 30,
        color: colors.dullInk,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{width: 50, height: 50, borderRadius: 14, background: tool.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Icon size={28} strokeWidth={2.4} />
      </span>
      {tool.label}
      {tool.badge ? (
        <span
          style={{
            position: 'absolute',
            right: -14,
            top: -14,
            minWidth: 38,
            height: 38,
            padding: '0 9px',
            boxSizing: 'border-box',
            borderRadius: 19,
            background: colors.alarm,
            color: '#fff',
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${1 + Math.max(0, Math.sin(frame / 4 + index)) * 0.12})`,
          }}
        >
          {tool.badge}
        </span>
      ) : null}
    </div>
  );
};

const ConflictAlert: React.FC<{frame: number}> = ({frame}) => {
  const at = 54;
  if (frame < at) return null;
  const e = enterScale(frame, at, 0.8, 10);
  const wobble = Math.sin(frame * 1.3) * tween(frame, at, at + 24, 3, 1);
  return (
    <div
      style={{
        position: 'absolute',
        left: 1290,
        top: 58,
        opacity: e.opacity,
        transform: `translateX(-50%) ${e.transform} rotate(${wobble}deg)`,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 24px',
        borderRadius: 16,
        background: '#FFF5F2',
        border: `3px solid ${colors.alarm}`,
        boxShadow: '0 16px 34px rgba(60,30,20,0.28)',
        fontFamily: fonts.body,
        fontWeight: 800,
        fontSize: 30,
        color: colors.alarm,
        whiteSpace: 'nowrap',
      }}
    >
      <TriangleAlert size={32} strokeWidth={2.6} />
      Double booking!
    </div>
  );
};
