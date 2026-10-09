import React from 'react';
import type {LucideIcon} from 'lucide-react';
import {
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  ChartColumn,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Layers,
  MessageSquare,
  Mic,
  Package,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  TriangleAlert,
  Wallet,
} from 'lucide-react';
import {LogoMark} from '../components/LogoMark';
import {colors, fonts} from '../theme';

// Hostastic web app chrome (sidebar, top bar, module tabs), drawn in the
// app's own style for screens that were not supplied. The module tabs leave
// out "Dashboard" on purpose.

export const APP_W = 1600;
export const APP_H = 1037;

const SECTIONS: Array<{label: string; icons: Array<{icon: LucideIcon; key?: string}>}> = [
  {label: 'Operations', icons: [{icon: BookOpen}, {icon: ClipboardCheck}]},
  {label: 'Revenue', icons: [{icon: CircleDollarSign}, {icon: Tag}]},
  {label: 'Communication', icons: [{icon: Star}]},
  {label: 'Management', icons: [{icon: TriangleAlert}, {icon: Package}]},
  {label: 'Finance', icons: [{icon: ChartColumn, key: 'reports'}, {icon: Receipt}, {icon: Wallet}, {icon: ShieldCheck}]},
];

const TABS: Array<{label: string; icon: LucideIcon; tint: string; key: string; menu?: boolean}> = [
  {label: 'Conversations', icon: MessageSquare, tint: colors.slate, key: 'conversations'},
  {label: 'Channels', icon: Layers, tint: '#4E9A3A', key: 'channels', menu: true},
  {label: 'Calendars', icon: CalendarDays, tint: '#3B82F6', key: 'calendars', menu: true},
  {label: 'Properties', icon: Building2, tint: colors.slate, key: 'properties', menu: true},
  {label: 'Reports', icon: ChartColumn, tint: colors.orange, key: 'reports'},
];

const ink = colors.ink;
const grey = '#8A8794';
const border = '#EFE9E3';

export const AppShell: React.FC<{title: string; activeTab: string; children: React.ReactNode}> = ({title, activeTab, children}) => (
  <div style={{width: APP_W, height: APP_H, display: 'flex', background: colors.cream, fontFamily: fonts.body, color: ink, overflow: 'hidden'}}>
    <div style={{width: 84, flexShrink: 0, background: '#fff', borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 18}}>
      <LogoMark size={40} />
      {SECTIONS.map((s) => (
        <div key={s.label} style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 18, paddingTop: 14, borderTop: `1px solid ${border}`}}>
          <div style={{fontSize: 10.5, color: grey, marginBottom: 12}}>{s.label}</div>
          {s.icons.map(({icon: Icon, key}, i) =>
            key === 'reports' ? (
              <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12}}>
                <div style={{width: 40, height: 40, borderRadius: 12, background: colors.peach, color: colors.orange, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Icon size={21} strokeWidth={2} />
                </div>
                <div style={{marginTop: 6, padding: '3px 10px', borderRadius: 999, background: colors.peach, color: colors.orangeDeep, fontSize: 11.5, fontWeight: 600}}>Reports</div>
              </div>
            ) : (
              <div key={i} style={{marginBottom: 18, color: grey}}>
                <Icon size={21} strokeWidth={1.7} />
              </div>
            ),
          )}
        </div>
      ))}
    </div>

    <div style={{flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0}}>
      <div style={{height: 66, flexShrink: 0, background: '#fff', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', padding: '0 22px'}}>
        <div style={{fontSize: 23, fontWeight: 500}}>{title}</div>
        <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 38, height: 38, borderRadius: 11, background: '#FDE3D4', color: colors.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(247,142,82,0.25)'}}>
            <Sparkles size={19} strokeWidth={2} />
          </div>
          <Bell size={21} strokeWidth={1.8} color={ink} />
          <div style={{width: 250, height: 38, borderRadius: 10, background: '#F4F4F6', display: 'flex', alignItems: 'center', padding: '0 12px', color: grey, fontSize: 14}}>
            <Search size={16} style={{marginRight: 8}} />
            Search...
            <Mic size={16} style={{marginLeft: 'auto'}} color={ink} />
          </div>
          <div style={{width: 38, height: 38, borderRadius: 11, background: colors.navy, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600}}>OS</div>
          <div style={{lineHeight: 1.2}}>
            <div style={{fontSize: 15, fontWeight: 600}}>Okasha Sipra</div>
            <div style={{fontSize: 12, color: grey}}>Admin</div>
          </div>
          <ChevronDown size={16} color={grey} />
        </div>
      </div>

      <div style={{height: 46, flexShrink: 0, background: '#fff', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'stretch', padding: '0 14px'}}>
        {TABS.map(({label, icon: Icon, tint, key, menu}, i) => {
          const active = key === activeTab;
          return (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0 16px',
                fontSize: 14.5,
                color: active ? colors.orange : ink,
                borderBottom: active ? `2px solid ${colors.orange}` : '2px solid transparent',
                borderLeft: i ? `1px solid ${border}` : 'none',
                margin: '8px 0 0',
              }}
            >
              <Icon size={17} strokeWidth={1.9} color={active ? colors.orange : tint} />
              {label}
              {menu ? <ChevronDown size={14} /> : null}
            </div>
          );
        })}
      </div>

      <div style={{flex: 1, position: 'relative'}}>{children}</div>
    </div>
  </div>
);

/** Channel tag, styled like the app's conversation list. */
export const ChannelTag: React.FC<{channel: 'Airbnb' | 'Booking.com' | 'VRBO' | 'Direct'; size?: number}> = ({channel, size = 13}) => {
  const style = {
    Airbnb: {bg: '#FDEBE6', fg: '#E0484D', dot: '#E0484D'},
    'Booking.com': {bg: '#F1F1F3', fg: ink, dot: ink},
    VRBO: {bg: '#F1F1F3', fg: ink, dot: '#2F64D6'},
    Direct: {bg: '#E4F1FA', fg: '#2B6CB0', dot: '#2B6CB0'},
  }[channel];
  return (
    <span style={{display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px', borderRadius: 7, background: style.bg, color: style.fg, fontSize: size, fontWeight: 500, whiteSpace: 'nowrap'}}>
      <span style={{width: 7, height: 7, borderRadius: 4, background: style.dot}} />
      {channel}
    </span>
  );
};
