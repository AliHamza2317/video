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
}> = ({spec, size = 74, accentColor = colors.teal, color = colors.ink, align = 'left', style}) => {
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
            marginBottom: 28,
            padding: '9px 20px',
            borderRadius: 999,
            background: colors.tealTint,
            color: colors.tealDark,
            fontFamily: fonts.body,
            fontWeight: 700,
            fontSize: 24,
          }}
        >
          {spec.chip}
        </div>
      ) : null}
      {spec.lines.map((line, i) => (
        <div
          key={line}
          style={{
            ...enter(frame, start + i * 2, 26),
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: size,
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            color: spec.accent?.includes(i) ? accentColor : color,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};
