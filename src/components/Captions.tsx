import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {tween} from '../anim';
import {LINES, sec} from '../script';
import {fonts} from '../theme';

type Shown = {text: string; from: number; to: number};

// Each caption stays up until the next one starts, so there is no flicker
// between voiceover lines. The last one holds briefly after the VO ends.
const CUES: Shown[] = LINES.flatMap((line, li) =>
  line.cues.map((cue, ci) => {
    const next = line.cues[ci + 1]?.start ?? LINES[li + 1]?.start ?? line.end + 0.8;
    return {text: cue.text, from: sec(cue.start), to: sec(next)};
  }),
);

export const CAPTION_CUES = CUES;

/** Burned-in captions: large, bottom centre, inside the title-safe area. */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = CUES.find((c) => frame >= c.from && frame < c.to);
  if (!cue) return null;
  const opacity = Math.min(tween(frame, cue.from, cue.from + 3, 0, 1), tween(frame, cue.to - 3, cue.to, 1, 0));
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 62}}>
      <div
        style={{
          opacity,
          maxWidth: 1560,
          padding: '14px 34px 17px',
          borderRadius: 20,
          background: 'rgba(8, 28, 34, 0.82)',
          color: '#fff',
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 50,
          lineHeight: 1.25,
          textAlign: 'center',
        }}
      >
        {cue.text}
      </div>
    </AbsoluteFill>
  );
};
