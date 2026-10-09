import React from 'react';
import {colors, fonts, shadows} from '../theme';

export type Channel = 'airbnb' | 'booking' | 'vrbo';

export const CHANNELS: Record<Channel, {name: string; color: string; glyph: string}> = {
  airbnb: {name: 'Airbnb', color: colors.airbnb, glyph: 'A'},
  booking: {name: 'Booking.com', color: colors.booking, glyph: 'B.'},
  vrbo: {name: 'Vrbo', color: colors.vrbo, glyph: 'V'},
};

/** Stylised booking-channel badge (brand colour + initial), not the official logo. */
export const ChannelTile: React.FC<{
  channel: Channel;
  size?: number;
  showLabel?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({channel, size = 110, showLabel = true, children, style}) => {
  const c = CHANNELS[channel];
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, ...style}}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.28,
          background: c.color,
          boxShadow: shadows.tile,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: size * 0.46,
          letterSpacing: '-0.04em',
          position: 'relative',
        }}
      >
        {c.glyph}
        {children}
      </div>
      {showLabel ? (
        <div style={{fontFamily: fonts.body, fontWeight: 700, fontSize: size * 0.19, color: colors.ink}}>
          {c.name}
        </div>
      ) : null}
    </div>
  );
};
