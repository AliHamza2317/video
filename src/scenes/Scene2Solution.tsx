import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {CalendarDays, LogIn, LogOut, MessageCircle, Search, Bell} from 'lucide-react';
import {easeInOut, fadeUp, pop, settle, tween} from '../anim';
import {Backdrop} from '../components/Backdrop';
import {Logo} from '../components/Logo';
import {AppWindow, Avatar, Sidebar} from '../components/ui';
import {useSceneFrame} from '../sceneTime';
import {colors, fonts} from '../theme';

export const Scene2Solution: React.FC = () => {
  const frame = useSceneFrame();

  const push = tween(frame, -12, 190, 1, 1.05, (t) => t);

  // Logo animates in, then rises & shrinks as the product screen slides up.
  const logoIn = pop(frame, 6, {damping: 13});
  const rise = tween(frame, 74, 104, 0, 1, easeInOut);
  const groupY = interpolate(rise, [0, 1], [0, -322]);
  const groupScale = interpolate(rise, [0, 1], [1, 0.6]);
  const word = tween(frame, 16, 34, 0, 1);
  const windowIn = settle(frame, 82, 30);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${push})`}}>
        <Backdrop drift={frame * 0.3} />

        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateY(${groupY - 30}px) scale(${groupScale})`,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', transform: `scale(${0.5 + logoIn * 0.5})`, opacity: Math.min(1, logoIn * 1.6)}}>
            <div
              style={{
                clipPath: `inset(0 ${(1 - word) * 75}% 0 0)`,
                transform: `translateX(${(1 - word) * 231}px)`,
              }}
            >
              <Logo size={150} />
            </div>
          </div>
          <div
            style={{
              ...fadeUp(frame, 30, 24, 20),
              marginTop: 44,
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 62,
              letterSpacing: '-0.03em',
              color: colors.ink,
            }}
          >
            Everything, <span style={{color: colors.teal}}>in one place.</span>
          </div>
        </AbsoluteFill>

        <div
          style={{
            position: 'absolute',
            left: 340,
            top: 292,
            transform: `translateY(${(1 - windowIn) * 900}px)`,
          }}
        >
          <AppWindow width={1240} height={600} title="Hostastic">
            <Sidebar active="home" />
            <HomeScreen frame={frame} />
          </AppWindow>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const STATS = [
  {icon: LogIn, label: 'Arrivals today', value: '4'},
  {icon: LogOut, label: 'Departures today', value: '3'},
  {icon: MessageCircle, label: 'Unanswered messages', value: '0'},
];

type Bar = {from: number; to: number; color: string; guest: string};
const PROPERTIES: Array<{name: string; bars: Bar[]}> = [
  {
    name: 'Seaside Loft',
    bars: [
      {from: 0, to: 3, color: colors.airbnb, guest: 'J. Park'},
      {from: 5, to: 9, color: colors.direct, guest: 'Lucía M.'},
      {from: 10, to: 13, color: colors.vrbo, guest: 'Chen family'},
    ],
  },
  {
    name: 'Mountain Cabin',
    bars: [
      {from: 1, to: 4, color: colors.booking, guest: 'A. Novak'},
      {from: 6, to: 8, color: colors.airbnb, guest: 'R. Diaz'},
      {from: 9, to: 12, color: colors.direct, guest: 'M. Ito'},
    ],
  },
  {
    name: 'City Studio',
    bars: [
      {from: 0, to: 1, color: colors.vrbo, guest: 'K. Osei'},
      {from: 3, to: 7, color: colors.booking, guest: 'L. Moreau'},
      {from: 9, to: 13, color: colors.airbnb, guest: 'T. Berg'},
    ],
  },
];

const DAYS = 14;
const FIRST_DAY = 9;

/** Minimal "Home" view: today's numbers + a multi-property calendar. */
export const HomeScreen: React.FC<{frame: number}> = ({frame}) => {
  const colW = 52;
  return (
    <div style={{flex: 1, padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 22, fontFamily: fonts.body}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div>
          <div style={{fontSize: 27, fontWeight: 700, color: colors.ink}}>Good morning, Sam</div>
          <div style={{fontSize: 16, color: colors.muted, marginTop: 4}}>Friday, October 9 · 3 properties</div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, color: colors.slate}}>
          <Search size={22} />
          <Bell size={22} />
          <Avatar initials="SR" color={colors.tealDark} size={40} />
        </div>
      </div>

      <div style={{display: 'flex', gap: 18}}>
        {STATS.map(({icon: Icon, label, value}, i) => (
          <div
            key={label}
            style={{
              ...fadeUp(frame, 100 + i * 5, 16, 16),
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '16px 18px',
              borderRadius: 16,
              border: `1px solid ${colors.line}`,
              background: '#FCFEFE',
            }}
          >
            <div style={{width: 44, height: 44, borderRadius: 12, background: colors.tealTint, color: colors.tealDark, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon size={22} strokeWidth={2.3} />
            </div>
            <div>
              <div style={{fontSize: 14, color: colors.muted, fontWeight: 500}}>{label}</div>
              <div style={{fontSize: 26, color: colors.ink, fontWeight: 700}}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{borderRadius: 16, border: `1px solid ${colors.line}`, padding: '16px 18px', flex: 1}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 17, fontWeight: 700, color: colors.ink, marginBottom: 12}}>
          <CalendarDays size={20} color={colors.teal} /> All properties · October
        </div>
        <div style={{display: 'flex', marginLeft: 150, marginBottom: 8}}>
          {Array.from({length: DAYS}).map((_, d) => (
            <div key={d} style={{width: colW, textAlign: 'center', fontSize: 13, fontWeight: 600, color: d === 0 ? colors.teal : colors.muted}}>
              {FIRST_DAY + d}
            </div>
          ))}
        </div>
        {PROPERTIES.map((p, row) => (
          <div key={p.name} style={{display: 'flex', alignItems: 'center', height: 60, borderTop: `1px solid ${colors.line}`}}>
            <div style={{width: 150, fontSize: 15, fontWeight: 600, color: colors.ink}}>{p.name}</div>
            <div style={{position: 'relative', height: 34, width: colW * DAYS}}>
              {p.bars.map((b, i) => {
                const grow = settle(frame, 108 + row * 6 + i * 4, 22);
                return (
                  <div
                    key={b.guest}
                    style={{
                      position: 'absolute',
                      left: b.from * colW + 3,
                      width: (b.to - b.from + 1) * colW - 6,
                      height: 34,
                      borderRadius: 9,
                      background: b.color,
                      transformOrigin: 'left center',
                      transform: `scaleX(${grow})`,
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: 10,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    {b.guest}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
