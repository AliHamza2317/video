import React from 'react';
import type {LucideIcon} from 'lucide-react';
import {fadeUp} from '../anim';
import {useSceneFrame} from '../sceneTime';
import {colors, fonts} from '../theme';
import {Chip} from './ui';

/** Scene label chip + the storyboard's on-screen text. */
export const Headline: React.FC<{
  chip?: {icon: LucideIcon; label: string};
  lines: string[];
  highlight?: number[];
  sub?: string;
  start?: number;
  size?: number;
  align?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
}> = ({chip, lines, highlight = [], sub, start = 6, size = 76, align = 'left', style}) => {
  const frame = useSceneFrame();
  const items = align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start';
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: items, textAlign: align, ...style}}>
      {chip ? (
        <div style={{...fadeUp(frame, start, 18), marginBottom: 30}}>
          <Chip icon={chip.icon} label={chip.label} size={24} />
        </div>
      ) : null}
      {lines.map((line, i) => (
        <div
          key={line}
          style={{
            ...fadeUp(frame, start + 6 + i * 7, 36, 22),
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: size,
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            color: highlight.includes(i) ? colors.teal : colors.ink,
          }}
        >
          {line}
        </div>
      ))}
      {sub ? (
        <div
          style={{
            ...fadeUp(frame, start + 14 + lines.length * 7, 20),
            marginTop: 28,
            fontFamily: fonts.body,
            fontWeight: 500,
            fontSize: 26,
            lineHeight: 1.45,
            color: colors.slate,
            maxWidth: 520,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};
