import React from 'react';
import {AbsoluteFill} from 'remotion';
import {enterScale, tween} from '../anim';
import {Backdrop} from '../components/Backdrop';
import {Headline} from '../components/Headline';
import {Logo} from '../components/Logo';
import {HEADLINES} from '../script';
import {useSceneFrame} from '../sceneTime';

export const SolutionScene: React.FC = () => {
  const frame = useSceneFrame();
  const push = tween(frame, -4, 90, 1, 1.03, (x) => x);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop drift={frame * 0.4} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `scale(${push})`}}>
        <div style={{...enterScale(frame, -4, 0.92, 12), marginTop: -60}}>
          <Logo width={700} />
        </div>
        <Headline spec={HEADLINES.solution} size={80} align="center" style={{marginTop: 56}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
