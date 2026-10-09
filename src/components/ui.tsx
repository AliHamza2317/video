import React from 'react';
import type {LucideIcon} from 'lucide-react';
import {CalendarDays, ChartColumn, Globe, House, MessageCircle, RefreshCw, Settings} from 'lucide-react';
import {colors, fonts, radius, shadows} from '../theme';
import {LogoMark} from './Logo';

export const Card: React.FC<{
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({children, style}) => (
  <div
    style={{
      background: colors.white,
      borderRadius: radius.card,
      boxShadow: shadows.card,
      border: `1px solid ${colors.line}`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{
  icon?: LucideIcon;
  label: string;
  color?: string;
  background?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({icon: Icon, label, color = colors.tealDark, background = colors.tealTint, size = 24, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.4,
      padding: `${size * 0.36}px ${size * 0.75}px`,
      borderRadius: radius.pill,
      background,
      color,
      fontFamily: fonts.body,
      fontWeight: 600,
      fontSize: size,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {Icon ? <Icon size={size * 1.05} strokeWidth={2.4} /> : null}
    {label}
  </div>
);

export const StatusPill: React.FC<{
  label: string;
  tone: 'paid' | 'pending' | 'neutral';
  icon?: LucideIcon;
  style?: React.CSSProperties;
}> = ({label, tone, icon: Icon, style}) => {
  const palette = {
    paid: {bg: '#DDF5EC', fg: '#11795A'},
    pending: {bg: '#FDF0D6', fg: '#9A6410'},
    neutral: {bg: '#EEF2F3', fg: colors.slate},
  }[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: radius.pill,
        background: palette.bg,
        color: palette.fg,
        fontFamily: fonts.body,
        fontWeight: 600,
        fontSize: 16,
        lineHeight: 1,
        ...style,
      }}
    >
      {Icon ? <Icon size={16} strokeWidth={2.6} /> : null}
      {label}
    </span>
  );
};

export const Avatar: React.FC<{initials: string; color: string; size?: number}> = ({
  initials,
  color,
  size = 40,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: fonts.body,
      fontWeight: 700,
      fontSize: size * 0.4,
      flexShrink: 0,
    }}
  >
    {initials}
  </div>
);

/** Desktop app frame used for Hostastic product screens. */
export const AppWindow: React.FC<{
  width: number;
  height: number;
  title?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({width, height, title, children, style}) => (
  <div
    style={{
      width,
      height,
      borderRadius: radius.window,
      background: colors.white,
      boxShadow: shadows.card,
      border: `1px solid ${colors.line}`,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
  >
    <div
      style={{
        height: 46,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        padding: '0 18px',
        gap: 8,
        background: '#FAFCFC',
        borderBottom: `1px solid ${colors.line}`,
        position: 'relative',
      }}
    >
      {['#F2A49C', '#F4CF7C', '#93D9B3'].map((c) => (
        <span key={c} style={{width: 13, height: 13, borderRadius: '50%', background: c}} />
      ))}
      {title ? (
        <span
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 15,
            color: colors.muted,
          }}
        >
          {title}
        </span>
      ) : null}
    </div>
    <div style={{flex: 1, position: 'relative', display: 'flex', minHeight: 0}}>{children}</div>
  </div>
);

export type NavKey = 'home' | 'calendar' | 'channels' | 'website' | 'inbox' | 'reports';

const NAV: Array<{key: NavKey | 'settings'; label: string; icon: LucideIcon}> = [
  {key: 'home', label: 'Home', icon: House},
  {key: 'calendar', label: 'Calendar', icon: CalendarDays},
  {key: 'channels', label: 'Channels', icon: RefreshCw},
  {key: 'website', label: 'Website', icon: Globe},
  {key: 'inbox', label: 'Inbox', icon: MessageCircle},
  {key: 'reports', label: 'Reports', icon: ChartColumn},
  {key: 'settings', label: 'Settings', icon: Settings},
];

export const Sidebar: React.FC<{active: NavKey; width?: number}> = ({active, width = 220}) => (
  <div
    style={{
      width,
      flexShrink: 0,
      borderRight: `1px solid ${colors.line}`,
      background: '#FBFDFD',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}
  >
    <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 22px'}}>
      <LogoMark size={34} />
      <span style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 21, color: colors.ink}}>
        Hostastic
      </span>
    </div>
    {NAV.map(({key, label, icon: Icon}) => {
      const isActive = key === active;
      return (
        <div
          key={key}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '11px 12px',
            borderRadius: 12,
            background: isActive ? colors.tealTint : 'transparent',
            color: isActive ? colors.tealDark : colors.slate,
            fontFamily: fonts.body,
            fontWeight: isActive ? 700 : 500,
            fontSize: 17,
            marginTop: key === 'settings' ? 'auto' : 0,
          }}
        >
          <Icon size={20} strokeWidth={2.2} />
          {label}
        </div>
      );
    })}
  </div>
);
