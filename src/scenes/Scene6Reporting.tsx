import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors} from 'remotion';
import {ChartColumn, Check, LogIn, LogOut, Percent, Receipt} from 'lucide-react';
import {easeInOut, pop, settle, tween} from '../anim';
import {Backdrop} from '../components/Backdrop';
import {Headline} from '../components/Headline';
import {AppWindow, Sidebar, StatusPill} from '../components/ui';
import {useSceneFrame} from '../sceneTime';
import {colors, fonts} from '../theme';

// Note for this scene: per the client, never use the word "Dashboard".

const PERIODS = ['Day', 'Month', 'Year'] as const;
const BREAKDOWNS = ['Property', 'Guest', 'Channel'] as const;

const PERIOD_DATA: Record<(typeof PERIODS)[number], {labels: string[]; values: number[]}> = {
  Day: {labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [0.42, 0.5, 0.46, 0.62, 0.86, 0.98, 0.74]},
  Month: {labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], values: [0.45, 0.58, 0.74, 0.95, 0.9, 0.7, 0.8]},
  Year: {labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'], values: [0.22, 0.34, 0.48, 0.6, 0.72, 0.86, 0.97]},
};

const BREAKDOWN_DATA: Record<(typeof BREAKDOWNS)[number], Array<{label: string; share: number; color: string}>> = {
  Property: [
    {label: 'Seaside Loft', share: 0.45, color: colors.teal},
    {label: 'Mountain Cabin', share: 0.33, color: colors.mint},
    {label: 'City Studio', share: 0.22, color: colors.sky},
    {label: '', share: 0, color: colors.sky},
  ],
  Guest: [
    {label: 'New guests', share: 0.58, color: colors.coral},
    {label: 'Returning', share: 0.3, color: colors.amber},
    {label: 'Long stays', share: 0.12, color: colors.tealDeep},
    {label: '', share: 0, color: colors.tealDeep},
  ],
  Channel: [
    {label: 'Airbnb', share: 0.36, color: colors.airbnb},
    {label: 'Booking.com', share: 0.24, color: colors.booking},
    {label: 'Vrbo', share: 0.14, color: colors.vrbo},
    {label: 'Direct', share: 0.26, color: colors.direct},
  ],
};

// When each control changes (scene frames).
const PERIOD_STEPS: Array<{at: number; value: (typeof PERIODS)[number]}> = [
  {at: -999, value: 'Month'},
  {at: 150, value: 'Year'},
  {at: 205, value: 'Day'},
];
const BREAKDOWN_STEPS: Array<{at: number; value: (typeof BREAKDOWNS)[number]}> = [
  {at: -999, value: 'Property'},
  {at: 258, value: 'Guest'},
  {at: 316, value: 'Channel'},
];
const MORPH = 20;

/** Index-based step blending: returns [previous, current, progress]. */
const stepAt = <T,>(steps: Array<{at: number; value: T}>, frame: number) => {
  let i = 0;
  while (i + 1 < steps.length && frame >= steps[i + 1].at) i++;
  const prev = steps[Math.max(0, i - 1)].value;
  const cur = steps[i].value;
  const p = i === 0 ? 1 : tween(frame, steps[i].at, steps[i].at + MORPH, 0, 1, easeInOut);
  return {prev, cur, p};
};

export const Scene6Reporting: React.FC = () => {
  const frame = useSceneFrame();
  const winIn = settle(frame, 0, 28);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop grid drift={frame * 0.25} />

      <div style={{position: 'absolute', left: 96, top: 118, opacity: winIn, transform: `translateY(${(1 - winIn) * 80}px)`}}>
        <AppWindow width={1110} height={770} title="Hostastic · Reports">
          <Sidebar active="reports" width={196} />
          <ReportsView frame={frame} />
        </AppWindow>
      </div>

      <Headline
        chip={{icon: ChartColumn, label: 'Reporting'}}
        lines={['Every number.', 'Zero extra cost.']}
        highlight={[1]}
        sub="Built in and free for every Hostastic user."
        size={62}
        start={12}
        style={{position: 'absolute', left: 1268, top: 290, width: 600}}
      />
    </AbsoluteFill>
  );
};

const ReportsView: React.FC<{frame: number}> = ({frame}) => {
  const period = stepAt(PERIOD_STEPS, frame);
  const breakdown = stepAt(BREAKDOWN_STEPS, frame);

  const periodIdx = interpolate(period.p, [0, 1], [PERIODS.indexOf(period.prev), PERIODS.indexOf(period.cur)]);
  const tabIdx = interpolate(breakdown.p, [0, 1], [BREAKDOWNS.indexOf(breakdown.prev), BREAKDOWNS.indexOf(breakdown.cur)]);

  return (
    <div style={{flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18, fontFamily: fonts.body, minWidth: 0}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{fontSize: 28, fontWeight: 700, color: colors.ink}}>Reports</div>
        <Segmented options={PERIODS} position={periodIdx} />
      </div>

      <Tabs options={BREAKDOWNS} position={tabIdx} />

      <div style={{display: 'flex', gap: 14}}>
        <Stat frame={frame} at={22} icon={LogIn} label="Check-ins today" value={4} />
        <Stat frame={frame} at={28} icon={LogOut} label="Check-outs today" value={3} />
        <Stat frame={frame} at={34} icon={Percent} label="Occupancy" value={87} suffix="%" />
        <Stat frame={frame} at={40} icon={Receipt} label="Revenue (Oct)" value={12480} prefix="$" />
      </div>

      <div style={{display: 'flex', gap: 16, flex: 1, minHeight: 0}}>
        <ChartCard frame={frame} period={period} breakdown={breakdown} />
        <Invoices frame={frame} />
      </div>
    </div>
  );
};

const Segmented: React.FC<{options: readonly string[]; position: number}> = ({options, position}) => {
  const w = 92;
  return (
    <div style={{position: 'relative', display: 'flex', padding: 4, borderRadius: 14, background: '#EEF3F4'}}>
      <div style={{position: 'absolute', top: 4, left: 4 + position * w, width: w, bottom: 4, borderRadius: 10, background: '#fff', boxShadow: '0 3px 10px rgba(14,47,56,0.12)'}} />
      {options.map((o, i) => (
        <div key={o} style={{position: 'relative', width: w, textAlign: 'center', padding: '9px 0', fontSize: 16, fontWeight: 700, color: Math.abs(position - i) < 0.5 ? colors.ink : colors.muted}}>
          {o}
        </div>
      ))}
    </div>
  );
};

const Tabs: React.FC<{options: readonly string[]; position: number}> = ({options, position}) => {
  const w = 130;
  return (
    <div style={{position: 'relative', display: 'flex', borderBottom: `1px solid ${colors.line}`}}>
      {options.map((o, i) => (
        <div key={o} style={{width: w, padding: '0 0 12px', fontSize: 17, fontWeight: 600, color: Math.abs(position - i) < 0.5 ? colors.tealDark : colors.muted}}>
          By {o.toLowerCase()}
        </div>
      ))}
      <div style={{position: 'absolute', bottom: -1, left: position * w, width: w - 30, height: 3, borderRadius: 2, background: colors.teal}} />
    </div>
  );
};

const Stat: React.FC<{
  frame: number;
  at: number;
  icon: React.ComponentType<{size?: number; strokeWidth?: number}>;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}> = ({frame, at, icon: Icon, label, value, prefix = '', suffix = ''}) => {
  const p = pop(frame, at, {damping: 16});
  const count = Math.round(tween(frame, at, at + 36, 0, value));
  return (
    <div
      style={{
        flex: 1,
        padding: '14px 16px',
        borderRadius: 16,
        border: `1px solid ${colors.line}`,
        background: '#FCFEFE',
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - p) * 16}px)`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 8, color: colors.muted, fontSize: 14, fontWeight: 600}}>
        <span style={{color: colors.teal, display: 'flex'}}>
          <Icon size={17} strokeWidth={2.4} />
        </span>
        {label}
      </div>
      <div style={{marginTop: 6, fontSize: 30, fontWeight: 800, color: colors.ink, fontFamily: fonts.display, letterSpacing: '-0.02em'}}>
        {prefix}
        {count.toLocaleString('en-US')}
        {suffix}
      </div>
    </div>
  );
};

type Step<T> = {prev: T; cur: T; p: number};

const ChartCard: React.FC<{
  frame: number;
  period: Step<(typeof PERIODS)[number]>;
  breakdown: Step<(typeof BREAKDOWNS)[number]>;
}> = ({frame, period, breakdown}) => {
  const from = PERIOD_DATA[period.prev];
  const to = PERIOD_DATA[period.cur];
  const segFrom = BREAKDOWN_DATA[breakdown.prev];
  const segTo = BREAKDOWN_DATA[breakdown.cur];
  const segments = segTo.map((s, i) => ({
    share: interpolate(breakdown.p, [0, 1], [segFrom[i].share, s.share]),
    color: interpolateColors(breakdown.p, [0, 1], [segFrom[i].color, s.color]),
  }));
  const chartH = 250;
  const labelSwap = period.p;

  return (
    <div style={{flex: 1.55, borderRadius: 18, border: `1px solid ${colors.line}`, padding: '18px 22px', display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontSize: 18, fontWeight: 700, color: colors.ink}}>Revenue</div>
        <div style={{display: 'flex', gap: 14}}>
          {segTo
            .filter((s) => s.label)
            .map((s) => (
              <span key={s.label} style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: colors.slate, opacity: breakdown.p}}>
                <span style={{width: 10, height: 10, borderRadius: 3, background: s.color}} />
                {s.label}
              </span>
            ))}
        </div>
      </div>
      <div style={{flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14, paddingTop: 16, position: 'relative'}}>
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <div key={g} style={{position: 'absolute', left: 0, right: 0, bottom: 28 + g * chartH, height: 1, background: colors.line}} />
        ))}
        {to.values.map((v, i) => {
          const grow = settle(frame, 30 + i * 5, 26);
          const h = interpolate(period.p, [0, 1], [from.values[i], v]) * chartH * grow;
          return (
            <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
              <div style={{width: '100%', maxWidth: 52, height: h, borderRadius: '10px 10px 4px 4px', overflow: 'hidden', display: 'flex', flexDirection: 'column-reverse'}}>
                {segments.map((s, j) => (
                  <div key={j} style={{height: `${s.share * 100}%`, background: s.color}} />
                ))}
              </div>
              <div style={{position: 'relative', height: 20, width: '100%', textAlign: 'center', fontSize: 14, fontWeight: 600, color: colors.muted}}>
                <span style={{position: 'absolute', left: 0, right: 0, opacity: 1 - labelSwap}}>{from.labels[i]}</span>
                <span style={{position: 'absolute', left: 0, right: 0, opacity: labelSwap}}>{to.labels[i]}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const INVOICES = [
  {id: 'INV-1041', guest: 'J. Park', amount: '$630', paidAt: -1},
  {id: 'INV-1042', guest: 'Lucía M.', amount: '$840', paidAt: 92},
  {id: 'INV-1043', guest: 'A. Novak', amount: '$515', paidAt: 128},
  {id: 'INV-1044', guest: 'Chen family', amount: '$1,120', paidAt: 9999},
];

const Invoices: React.FC<{frame: number}> = ({frame}) => (
  <div style={{flex: 1, borderRadius: 18, border: `1px solid ${colors.line}`, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 4}}>
    <div style={{fontSize: 18, fontWeight: 700, color: colors.ink, marginBottom: 8}}>Invoices</div>
    {INVOICES.map((inv, i) => {
      const rowIn = pop(frame, 40 + i * 6, {damping: 18});
      const paid = frame >= inv.paidAt;
      const flip = inv.paidAt > 0 ? pop(frame, inv.paidAt, {damping: 9, stiffness: 240}) : 1;
      return (
        <div
          key={inv.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 0',
            borderTop: i ? `1px solid ${colors.line}` : 'none',
            opacity: rowIn,
          }}
        >
          <div>
            <div style={{fontSize: 15, fontWeight: 700, color: colors.ink}}>{inv.guest}</div>
            <div style={{fontSize: 13, color: colors.muted, marginTop: 2}}>
              {inv.id} · {inv.amount}
            </div>
          </div>
          {paid ? (
            <StatusPill label="Paid" tone="paid" icon={Check} style={{transform: `scale(${flip})`}} />
          ) : (
            <StatusPill label="Pending" tone="pending" />
          )}
        </div>
      );
    })}
  </div>
);
