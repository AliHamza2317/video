import React from 'react';
import {Composition} from 'remotion';
import {HostasticExplainer} from './HostasticExplainer';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './script';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="HostasticExplainer"
      component={HostasticExplainer}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{showCaptions: true}}
    />
    <Composition
      id="HostasticReel"
      component={HostasticExplainer}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{showCaptions: true}}
    />
    <Composition
      id="HostasticExplainerNoCaptions"
      component={HostasticExplainer}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{showCaptions: false}}
    />
  </>
);
