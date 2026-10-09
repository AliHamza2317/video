import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Backdrop} from '../components/Backdrop';
import {Headline} from '../components/Headline';
import {ScreenStage} from '../components/ScreenStage';
import {HEADLINES, SCREENS} from '../script';
import {useSceneFrame} from '../sceneTime';

type FeatureId = keyof typeof SCREENS;

// Big headline on the left, the real app screen on the right.
const SCREEN_BOX = {x: 720, y: 140, w: 1110, h: 700};

export const FeatureScene: React.FC<{id: FeatureId}> = ({id}) => {
  const frame = useSceneFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop grid drift={frame * 0.25} />
      <Headline spec={HEADLINES[id]} size={70} style={{position: 'absolute', left: 104, top: 270, width: 580}} />
      <ScreenStage spec={SCREENS[id]} box={SCREEN_BOX} />
    </AbsoluteFill>
  );
};
