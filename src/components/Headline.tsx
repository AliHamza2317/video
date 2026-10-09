import React from 'react';
import {enter} from '../anim';
import type {Headline as HeadlineSpec} from '../script';
import {useSceneFrame} from '../sceneTime';
import {colors, fonts} from '../theme';

/** Scene headline. Fully on screen within 0.3 s of the scene starting. */
export const Headline: React.FC<{
  spec: HeadlineSpec;
  size?: number;
  accentColor?: string;
  color?: string;
  align?: 'left' | 'center';
  style?: React.CSSProperties;
}> = ({spec, size = 80, accentColor = colors.orange, color = colors.ink, align = 'left', style}) => {
  const frame = useSceneFrame();
  const start = -4; // the scene's sequence begins half a crossfade early
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        textAlign: align,
        ...style,
      }}
    >
      {spec.chip ? (
        <div
          style={{
            ...enter(frame, start, 14),
            marginBottom: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 22px 10px 18px',
            borderRadius: 999,
            background: colors.white,
            boxShadow: '0 6px 18px rgba(28,27,41,0.08)',
            color: colors.ink,
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 24,
          }}
        >
          <span style={{width: 10, height: 10, borderRadius: 5, background: colors.orange}} />
          {spec.chip}
        </div>
      ) : null}
      {spec.lines.map((line, i) => (
        <div
          key={line}
          style={{
            ...enter(frame, start + i * 2, 26),
            fontFamily: fonts.display,
            fontWeight: 400,
            fontSize: size,
            lineHeight: 1.06,
            letterSpacing: '-0.01em',
            color: spec.accent?.includes(i) ? accentColor : color,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};
