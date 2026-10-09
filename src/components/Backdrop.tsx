import React from 'react';
import {AbsoluteFill} from 'remotion';
import {colors} from '../theme';

/** Warm cream background with soft peach glows, as in the web app. */
export const Backdrop: React.FC<{grid?: boolean; drift?: number}> = ({grid = false, drift = 0}) => (
  <AbsoluteFill style={{background: colors.cream}}>
    <div
      style={{
        position: 'absolute',
        width: 1000,
        height: 1000,
        borderRadius: '50%',
        right: -320 + drift,
        top: -460,
        background: `radial-gradient(circle, ${colors.peachGlow} 0%, rgba(255,248,239,0) 68%)`,
        opacity: 0.85,
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 820,
        height: 820,
        borderRadius: '50%',
        left: -340 - drift,
        bottom: -420,
        background: `radial-gradient(circle, ${colors.peachGlow} 0%, rgba(255,248,239,0) 70%)`,
        opacity: 0.6,
      }}
    />
    {grid ? (
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(28,27,41,0.07) 1.5px, transparent 1.6px)',
          backgroundSize: '34px 34px',
          backgroundPosition: `${drift}px 0`,
        }}
      />
    ) : null}
  </AbsoluteFill>
);
