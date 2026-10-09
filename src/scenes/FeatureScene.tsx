import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Backdrop} from '../components/Backdrop';
import {Headline} from '../components/Headline';
import {ScreenStage} from '../components/ScreenStage';
import {HEADLINES, SCREENS} from '../script';
import {useSceneFrame} from '../sceneTime';

type FeatureId = keyof typeof SCREENS;

// Big headline on the left, the real app screen on the right.
const SCREEN_BOX = {x: 680, y: 118, w: 1180, h: 740};

export const FeatureScene: React.FC<{id: FeatureId}> = ({id}) => {
  const frame = useSceneFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop grid drift={frame * 0.25} />
      <Headline spec={HEADLINES[id]} size={76} style={{position: 'absolute', left: 100, top: 270, width: 550}} />
      <ScreenStage spec={SCREENS[id]} box={SCREEN_BOX} />
    </AbsoluteFill>
  );
};
