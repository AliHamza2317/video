import React from 'react';
import {interpolate, interpolateColors} from 'remotion';
import type {LucideIcon} from 'lucide-react';
import {CalendarDays, Check, CircleDollarSign, Download, LogIn, LogOut, Percent} from 'lucide-react';
import {easeOut, tween} from '../anim';
import {sec} from '../script';
import {useSceneFrame} from '../sceneTime';
import {colors} from '../theme';
import {AppShell, ChannelTag} from './AppShell';

// Reports screen in the Hostastic app style. Figures match the supplied
// Calendar screen (June 2026: 10 bookings, 45% occupancy, $22,830).
// Layout is absolute so rings and clicks in src/script.ts can target it.

export const REPORT_TABS = ['By guest', 'By property', 'By channel'] as const;
type Tab = (typeof REPORT_TABS)[number];

/** Scene times (s) when each report tab becomes active. */
export const REPORT_TAB_TIMES: Array<{t: number; tab: Tab}> = [
  {t: -1, tab: 'By guest'},
  {t: 3.9, tab: 'By property'},
  {t: 4.7, tab: 'By channel'},
];

const DATA: Record<Tab, {caption: string; rows: Array<{label: string; value: number; color: string}>}> = {
  'By guest': {
    caption: 'Top guests by revenue',
    rows: [
      {label: 'David Statham', value: 1500, color: colors.orange},
      {label: 'Sarah Johnson', value: 1240, color: '#F6A97D'},
      {label: 'James Wilson', value: 980, color: colors.navyLight},
      {label: 'Michael Chen', value: 860, color: '#B8B4C6'},
    ],
  },
  'By property': {
    caption: 'Revenue by property',
    rows: [
      {label: 'Sunset Villa', value: 8450, color: colors.orange},
      {label: 'Ocean Breeze', value: 6120, color: '#F6A97D'},
      {label: 'Mountain Cabin', value: 4860, color: colors.navyLight},
      {label: 'Downtown Loft', value: 3400, color: '#B8B4C6'},
    ],
  },
  'By channel': {
    caption: 'Revenue by channel',
    rows: [
      {label: 'Airbnb', value: 9120, color: colors.airbnb},
      {label: 'Booking.com', value: 6390, color: colors.booking},
      {label: 'Vrbo', value: 3650, color: colors.vrbo},
      {label: 'Direct', value: 3670, color: colors.orange},
    ],
  },
};

const INVOICES: Array<{initials: string; guest: string; property: string; channel: 'Airbnb' | 'Booking.com' | 'VRBO' | 'Direct'; amount: string; paidAt?: number}> = [
  {initials: 'DS', guest: 'David Statham', property: 'Sunset Villa Malibu', channel: 'Airbnb', amount: '$1,500.00'},
  {initials: 'SH', guest: 'Sarah Johnson', property: 'Ocean Breeze Condo', channel: 'Booking.com', amount: '$1,240.00', paidAt: 1.1},
  {initials: 'JW', guest: 'James Wilson', property: 'Sunset Villa Malibu', channel: 'Airbnb', amount: '$980.00'},
  {initials: 'MC', guest: 'Michael Chen', property: 'Mountain Retreat', channel: 'VRBO', amount: '$860.00', paidAt: 2.2},
  {initials: 'ED', guest: 'Emily Davis', property: 'Downtown Loft NYC', channel: 'Direct', amount: '$640.00'},
  {initials: 'RB', guest: 'Robert Brown', property: 'Beach House Miami', channel: 'Direct', amount: '$1,120.00', paidAt: 99},
];

const card: React.CSSProperties = {position: 'absolute', background: '#fff', borderRadius: 20, border: '1px solid #EFE7DF'};

export const ReportsDesign: React.FC = () => {
  const frame = useSceneFrame();
  return (
    <AppShell title="Reports" activeTab="reports">
      {/* Content coordinates below are relative to the content area (x 84, y 112). */}
      <div style={{...card, left: 18, top: 16, width: 1480, height: 891}}>
        <Header />
        <div style={{position: 'absolute', left: 26, top: 106, display: 'flex', gap: 16}}>
          <Stat frame={frame} icon={LogIn} tint="#FDE3D4" fg={colors.orange} label="Check-ins today" value={4} />
          <Stat frame={frame} icon={LogOut} tint="#E4F1FA" fg="#2B6CB0" label="Checkouts today" value={3} />
          <Stat frame={frame} icon={Percent} tint="#E3F4E1" fg="#3E8E3A" label="Occupancy" value={45} suffix="%" delta="+6% vs May" />
          <Stat frame={frame} icon={CircleDollarSign} tint="#FDE3D4" fg={colors.orange} label="Revenue" value={22830} prefix="$" delta="+12% vs May" />
        </div>
        <Invoices frame={frame} />
        <Breakdown frame={frame} />
      </div>
    </AppShell>
  );
};

const Header: React.FC = () => (
  <div style={{position: 'absolute', left: 26, right: 26, top: 22, display: 'flex', alignItems: 'center'}}>
    <div>
      <div style={{fontSize: 27, fontWeight: 600, letterSpacing: '-0.01em'}}>June 2026 overview</div>
      <div style={{fontSize: 15.5, color: '#8A8794', marginTop: 4}}>Invoices, arrivals and revenue across all your properties</div>
    </div>
    <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12}}>
      <div style={{display: 'flex', padding: 4, borderRadius: 12, background: '#F6F2EE'}}>
        {['Day', 'Month', 'Year'].map((p) => (
          <div key={p} style={{padding: '8px 18px', borderRadius: 9, fontSize: 14.5, fontWeight: 600, background: p === 'Month' ? '#fff' : 'transparent', color: p === 'Month' ? colors.orange : '#8A8794', boxShadow: p === 'Month' ? '0 2px 6px rgba(28,27,41,0.08)' : 'none'}}>
            {p}
          </div>
        ))}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 12, border: '1px solid #EFE7DF', fontSize: 14.5, fontWeight: 500}}>
        <CalendarDays size={17} /> June 2026
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '11px 18px', borderRadius: 12, background: colors.navy, color: '#fff', fontSize: 14.5, fontWeight: 600}}>
        <Download size={17} /> Export
      </div>
    </div>
  </div>
);

const Stat: React.FC<{
  frame: number;
  icon: LucideIcon;
  tint: string;
  fg: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delta?: string;
}> = ({frame, icon: Icon, tint, fg, label, value, prefix = '', suffix = '', delta}) => {
  const n = Math.round(tween(frame, -4, 11, 0, value));
  return (
    <div style={{width: 345, height: 106, boxSizing: 'border-box', borderRadius: 16, border: '1px solid #EFE7DF', background: '#FFFCF9', padding: '16px 18px', display: 'flex', gap: 14}}>
      <div style={{width: 44, height: 44, borderRadius: 12, background: tint, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
        <Icon size={22} strokeWidth={2} />
      </div>
      <div>
        <div style={{fontSize: 14.5, color: '#8A8794'}}>{label}</div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 2}}>
          <span style={{fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em'}}>
            {prefix}
            {n.toLocaleString('en-US')}
            {suffix}
          </span>
          {delta ? <span style={{fontSize: 13, fontWeight: 600, color: '#3E8E3A'}}>{delta}</span> : null}
        </div>
      </div>
    </div>
  );
};

const Invoices: React.FC<{frame: number}> = ({frame}) => (
  <div style={{position: 'absolute', left: 26, top: 232, width: 720, height: 633, boxSizing: 'border-box', borderRadius: 18, border: '1px solid #EFE7DF', padding: '20px 22px'}}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <div style={{fontSize: 20, fontWeight: 600}}>Invoices</div>
      <div style={{marginLeft: 10, padding: '3px 10px', borderRadius: 999, background: colors.peach, color: colors.orangeDeep, fontSize: 13, fontWeight: 600}}>6 this week</div>
      <div style={{marginLeft: 'auto', fontSize: 14.5, fontWeight: 600, color: colors.orange}}>View all</div>
    </div>
    <div style={{display: 'flex', marginTop: 18, paddingBottom: 10, borderBottom: '1px solid #F1ECE6', fontSize: 12.5, fontWeight: 600, color: '#9B97A6', letterSpacing: '0.05em'}}>
      <span style={{width: 300}}>GUEST</span>
      <span style={{width: 150}}>CHANNEL</span>
      <span style={{width: 120}}>AMOUNT</span>
      <span>STATUS</span>
    </div>
    {INVOICES.map((inv) => {
      const paid = inv.paidAt === undefined || frame >= sec(inv.paidAt);
      const flip = inv.paidAt !== undefined ? tween(frame, sec(inv.paidAt), sec(inv.paidAt) + 10, 0.6, 1) : 1;
      return (
        <div key={inv.guest} style={{display: 'flex', alignItems: 'center', height: 82, borderBottom: '1px solid #F5F1EC'}}>
          <div style={{width: 300, display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{width: 40, height: 40, borderRadius: 20, background: '#EDEDF0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600}}>{inv.initials}</div>
            <div>
              <div style={{fontSize: 16, fontWeight: 600}}>{inv.guest}</div>
              <div style={{fontSize: 13, color: '#8A8794', marginTop: 2}}>{inv.property}</div>
            </div>
          </div>
          <div style={{width: 150}}>
            <ChannelTag channel={inv.channel} />
          </div>
          <div style={{width: 120, fontSize: 16, fontWeight: 600}}>{inv.amount}</div>
          <div style={{transform: `scale(${paid ? flip : 1})`, transformOrigin: 'left center'}}>
            {paid ? (
              <span style={{display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 999, background: '#E3F4E1', color: '#3E8E3A', fontSize: 13.5, fontWeight: 600}}>
                <Check size={14} strokeWidth={3} /> Paid
              </span>
            ) : (
              <span style={{display: 'inline-flex', padding: '5px 12px', borderRadius: 999, background: '#FDF1D8', color: '#A86B00', fontSize: 13.5, fontWeight: 600}}>Pending</span>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

const Breakdown: React.FC<{frame: number}> = ({frame}) => {
  // Current and previous tab, blended over 0.4 s.
  let i = 0;
  while (i + 1 < REPORT_TAB_TIMES.length && frame >= sec(REPORT_TAB_TIMES[i + 1].t)) i++;
  const cur = REPORT_TAB_TIMES[i];
  const prev = REPORT_TAB_TIMES[Math.max(0, i - 1)];
  const p = i === 0 ? 1 : tween(frame, sec(cur.t), sec(cur.t) + 12, 0, 1, easeOut);
  const from = DATA[prev.tab];
  const to = DATA[cur.tab];
  const max = Math.max(...to.rows.map((r) => r.value), ...from.rows.map((r) => r.value));
  const grow = tween(frame, -4, 12, 0, 1);
  const tabIdx = interpolate(p, [0, 1], [REPORT_TABS.indexOf(prev.tab), REPORT_TABS.indexOf(cur.tab)]);

  return (
    <div style={{position: 'absolute', left: 762, top: 232, width: 692, height: 633, boxSizing: 'border-box', borderRadius: 18, border: '1px solid #EFE7DF', padding: '20px 24px'}}>
      <div style={{fontSize: 20, fontWeight: 600}}>Reports</div>
      {/* Tabs: each 150 wide, starting 4 px in from x 24 (card) */}
      <div style={{position: 'relative', display: 'flex', marginTop: 16, padding: 4, width: 458, borderRadius: 12, background: '#F6F2EE'}}>
        <div style={{position: 'absolute', top: 4, bottom: 4, left: 4 + tabIdx * 150, width: 150, borderRadius: 9, background: '#fff', boxShadow: '0 2px 8px rgba(28,27,41,0.1)'}} />
        {REPORT_TABS.map((t, k) => (
          <div key={t} style={{position: 'relative', width: 150, textAlign: 'center', padding: '9px 0', fontSize: 15, fontWeight: 600, color: Math.abs(tabIdx - k) < 0.5 ? colors.orange : '#8A8794'}}>
            {t}
          </div>
        ))}
      </div>
      <div style={{display: 'flex', alignItems: 'baseline', marginTop: 26}}>
        <div style={{position: 'relative', fontSize: 15.5, color: '#8A8794', height: 22, width: 300}}>
          <span style={{position: 'absolute', opacity: 1 - p}}>{from.caption}</span>
          <span style={{position: 'absolute', opacity: p}}>{to.caption}</span>
        </div>
        <div style={{marginLeft: 'auto', fontSize: 28, fontWeight: 700}}>$22,830</div>
      </div>
      <div style={{marginTop: 28, display: 'flex', flexDirection: 'column', gap: 42}}>
        {to.rows.map((row, k) => {
          const value = interpolate(p, [0, 1], [from.rows[k].value, row.value]);
          const color = interpolateColors(p, [0, 1], [from.rows[k].color, row.color]);
          return (
            <div key={k}>
              <div style={{display: 'flex', fontSize: 17, fontWeight: 600, marginBottom: 11}}>
                <span style={{position: 'relative', width: 300, height: 20}}>
                  <span style={{position: 'absolute', opacity: 1 - p}}>{from.rows[k].label}</span>
                  <span style={{position: 'absolute', opacity: p}}>{row.label}</span>
                </span>
                <span style={{marginLeft: 'auto'}}>${Math.round(value).toLocaleString('en-US')}</span>
              </div>
              <div style={{height: 22, borderRadius: 11, background: '#F4EFEA', overflow: 'hidden'}}>
                <div style={{width: `${(value / max) * 100 * grow}%`, height: '100%', borderRadius: 11, background: color}} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
