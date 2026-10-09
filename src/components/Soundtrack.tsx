import React from 'react';
import {Audio, getStaticFiles, interpolate, staticFile, useVideoConfig} from 'remotion';
import {LINES, sec} from '../script';

const find = (names: string[]) => {
  const files = getStaticFiles();
  return names.find((n) => files.some((f) => f.name === n));
};

/**
 * Preview audio for Remotion Studio. The delivered files are mixed and
 * loudness-normalised by scripts/finish.mjs instead (renders use --muted).
 */
export const Soundtrack: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  const vo = find(['audio/voiceover.wav']);
  const music = find(['audio/music.mp3', 'audio/music.wav', 'audio/music.m4a']);
  const voStart = sec(LINES[0].start);
  const voEnd = sec(LINES[LINES.length - 1].end);

  return (
    <>
      {vo ? <Audio src={staticFile(vo)} /> : null}
      {music ? (
        <Audio
          src={staticFile(music)}
          volume={(f) => {
            const fade = Math.min(
              interpolate(f, [0, 30], [0, 1], {extrapolateRight: 'clamp'}),
              interpolate(f, [durationInFrames - 60, durationInFrames], [1, 0], {extrapolateLeft: 'clamp'}),
            );
            // About -18 dB under the voice, lifting when the voice is out.
            const ducked = f >= voStart - 6 && f <= voEnd + 6;
            return fade * (ducked ? 0.126 : 0.4);
          }}
        />
      ) : null}
    </>
  );
};
