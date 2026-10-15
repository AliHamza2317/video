import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Backdrop} from '../components/Backdrop';
import {Headline} from '../components/Headline';
import {ScreenStage} from '../components/ScreenStage';
import {BookingSiteDesign, SITE_H, SITE_W} from '../designs/BookingSiteDesign';
import {ReportsDesign} from '../designs/ReportsDesign';
import {APP_H, APP_W} from '../designs/AppShell';
import {HEADLINES, SCREENS} from '../script';
import {REEL, useIsPortrait} from '../layout';
import {useSceneFrame} from '../sceneTime';

type FeatureId = keyof typeof SCREENS;

// Big headline on the left, the app screen on the right.
const SCREEN_BOX = {x: 680, y: 118, w: 1180, h: 740};

// Screens drawn in the app's style where no file was supplied. A file in
// public/screens/ with the same name still takes precedence.
const DESIGNS: Partial<Record<FeatureId, {node: React.ReactNode; width: number; height: number}>> = {
  direct: {node: <BookingSiteDesign />, width: SITE_W, height: SITE_H},
  reporting: {node: <ReportsDesign />, width: APP_W, height: APP_H},
};

export const FeatureScene: React.FC<{id: FeatureId}> = ({id}) => {
  const frame = useSceneFrame();
  const portrait = useIsPortrait();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop grid drift={frame * 0.25} />
      {portrait ? (
        <Headline spec={HEADLINES[id]} size={88} style={{position: 'absolute', left: REEL.headlineLeft, top: REEL.headlineTop, width: 940}} />
      ) : (
        <Headline spec={HEADLINES[id]} size={76} style={{position: 'absolute', left: 100, top: 270, width: 550}} />
      )}
      <ScreenStage spec={SCREENS[id]} box={portrait ? REEL.screenBox : SCREEN_BOX} design={DESIGNS[id]} />
    </AbsoluteFill>
  );
};
