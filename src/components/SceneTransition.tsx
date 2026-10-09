import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {easeInOut, tween} from '../anim';
import type {TransitionIn} from '../script';

/** Applies a scene's entrance transition on top of the previous scene. */
export const SceneTransition: React.FC<{transition: TransitionIn; children: React.ReactNode}> = ({
  transition,
  children,
}) => {
  const frame = useCurrentFrame();
  const {type, frames} = transition;

  if (type === 'none' || frames === 0) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  const p = tween(frame, 0, frames, 0, 1, easeInOut);

  if (type === 'fade') {
    return <AbsoluteFill style={{opacity: p}}>{children}</AbsoluteFill>;
  }

  // Soft light wipe, left to right.
  const edge = p * 100;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: `inset(0 ${100 - edge}% 0 0)`}}>{children}</AbsoluteFill>
      {p > 0 && p < 1 ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `calc(${edge}% - 160px)`,
            width: 220,
            background:
              'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(205,240,237,0.85) 55%, rgba(255,255,255,1) 72%, rgba(255,255,255,0) 100%)',
            filter: 'blur(6px)',
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
