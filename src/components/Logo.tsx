import React from 'react';
import {getStaticFiles, Img, staticFile} from 'remotion';
import {colors, fonts} from '../theme';

// Drop the real brand mark at public/brand/logo-mark.svg (or .png) to replace
// the placeholder emblem everywhere in the video.
const MARK_OVERRIDES = ['brand/logo-mark.svg', 'brand/logo-mark.png'];

const findOverride = () => {
  const files = getStaticFiles();
  return MARK_OVERRIDES.find((name) => files.some((f) => f.name === name));
};

export const LogoMark: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => {
  const override = findOverride();
  if (override) {
    return <Img src={staticFile(override)} style={{width: size, height: size, objectFit: 'contain', ...style}} />;
  }

  const id = `mark-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1EC2BB" />
          <stop offset="100%" stopColor={colors.tealDark} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" rx="27" fill={`url(#${id})`} />
      <path d="M26 53 L50 31 L74 53 V71 a5 5 0 0 1 -5 5 H31 a5 5 0 0 1 -5 -5 Z" fill="#fff" />
      <rect x="43.5" y="56" width="13" height="20" rx="4" fill={colors.teal} />
      <path
        d="M75 17 L77.6 23.4 L84 26 L77.6 28.6 L75 35 L72.4 28.6 L66 26 L72.4 23.4 Z"
        fill="#fff"
        opacity={0.95}
      />
    </svg>
  );
};

export const Logo: React.FC<{
  size: number;
  color?: string;
  gap?: number;
  style?: React.CSSProperties;
}> = ({size, color = colors.ink, gap, style}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: gap ?? size * 0.28, ...style}}>
    <LogoMark size={size} />
    <span
      style={{
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: size * 0.62,
        letterSpacing: '-0.03em',
        color,
        lineHeight: 1,
      }}
    >
      Hostastic
    </span>
  </div>
);
