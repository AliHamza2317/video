import React from 'react';
import {AbsoluteFill} from 'remotion';
import {colors} from '../theme';

/** Bright teal-and-white background with soft shapes and an optional dot grid. */
export const Backdrop: React.FC<{grid?: boolean; tint?: string; drift?: number}> = ({
  grid = false,
  tint = colors.tealTint2,
  drift = 0,
}) => (
  <AbsoluteFill style={{background: `linear-gradient(160deg, #FFFFFF 0%, ${colors.bg} 55%, ${colors.tealTint} 100%)`}}>
    <div
      style={{
        position: 'absolute',
        width: 900,
        height: 900,
        borderRadius: '50%',
        right: -260 + drift,
        top: -380,
        background: `radial-gradient(circle, ${tint} 0%, rgba(255,255,255,0) 68%)`,
        opacity: 0.9,
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 760,
        height: 760,
        borderRadius: '50%',
        left: -300 - drift,
        bottom: -360,
        background: `radial-gradient(circle, ${tint} 0%, rgba(255,255,255,0) 70%)`,
        opacity: 0.7,
      }}
    />
    {grid ? (
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(14,47,56,0.10) 1.5px, transparent 1.6px)',
          backgroundSize: '34px 34px',
          backgroundPosition: `${drift}px 0`,
        }}
      />
    ) : null}
  </AbsoluteFill>
);
