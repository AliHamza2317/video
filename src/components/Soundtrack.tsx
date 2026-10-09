import React from 'react';
import {Audio, getStaticFiles, interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';
import {SCENES, sec} from '../script';

const exists = (name: string) => getStaticFiles().some((f) => f.name === name);

/**
 * Optional audio. Nothing is rendered unless the files exist in public/audio:
 *   music.mp3            light, upbeat bed (lifts at Scene 2)
 *   voiceover.mp3        the full VO as one take, starting at 0:00
 *   vo-<scene-id>.mp3    or one VO file per scene (e.g. vo-channels.mp3)
 */
export const Soundtrack: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  const music = exists('audio/music.mp3');
  const fullVo = exists('audio/voiceover.mp3');
  const sceneVo = SCENES.filter((s) => exists(`audio/vo-${s.id}.mp3`));
  const hasVo = fullVo || sceneVo.length > 0;

  const lift = sec(SCENES[1].start);
  const bed = hasVo ? 0.22 : 0.45;

  return (
    <>
      {music ? (
        <Audio
          src={staticFile('audio/music.mp3')}
          volume={(f) =>
            interpolate(
              f,
              [0, lift - 10, lift + 20, durationInFrames - 45, durationInFrames],
              [bed * 0.6, bed * 0.6, bed, bed, 0],
              {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
            )
          }
        />
      ) : null}
      {fullVo ? <Audio src={staticFile('audio/voiceover.mp3')} /> : null}
      {!fullVo &&
        sceneVo.map((s) => (
          <Sequence key={s.id} from={sec(s.start)} name={`VO ${s.id}`}>
            <Audio src={staticFile(`audio/vo-${s.id}.mp3`)} />
          </Sequence>
        ))}
    </>
  );
};
