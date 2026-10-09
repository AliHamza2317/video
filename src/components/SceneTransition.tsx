import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {easeOut, tween} from '../anim';
import {TRANSITION_FRAMES} from '../script';

/** Entrance over the previous scene: a 0.27 s crossfade or soft wipe. */
export const SceneTransition: React.FC<{type: 'none' | 'fade' | 'wipe'; children: React.ReactNode}> = ({
  type,
  children,
}) => {
  const frame = useCurrentFrame();
  if (type === 'none') return <AbsoluteFill>{children}</AbsoluteFill>;
  const p = tween(frame, 0, TRANSITION_FRAMES, 0, 1, easeOut);
  if (type === 'fade') return <AbsoluteFill style={{opacity: p}}>{children}</AbsoluteFill>;
  return <AbsoluteFill style={{clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}}>{children}</AbsoluteFill>;
};
