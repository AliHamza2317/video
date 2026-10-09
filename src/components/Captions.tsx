import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {tween} from '../anim';
import {SCENES, sec} from '../script';
import {fonts} from '../theme';

const CUES = SCENES.flatMap((s) => s.captions);
const FADE = 5;

/** Burned-in voiceover captions (muted autoplay is common on landing pages). */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = CUES.find((c) => frame >= sec(c.from) && frame < sec(c.to));
  if (!cue) return null;

  const from = sec(cue.from);
  const to = sec(cue.to);
  const opacity = Math.min(tween(frame, from, from + FADE, 0, 1), tween(frame, to - FADE, to, 1, 0));

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 46}}>
      <div
        style={{
          opacity,
          maxWidth: 1500,
          padding: '14px 30px 16px',
          borderRadius: 18,
          background: 'rgba(8, 28, 34, 0.80)',
          color: '#fff',
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 38,
          lineHeight: 1.3,
          textAlign: 'center',
          letterSpacing: '-0.005em',
        }}
      >
        {cue.text}
      </div>
    </AbsoluteFill>
  );
};
