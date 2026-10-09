import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {Captions} from './components/Captions';
import {SceneTransition} from './components/SceneTransition';
import {Soundtrack} from './components/Soundtrack';
import {SCENE_COMPONENTS} from './scenes';
import {SCENES, sec} from './script';
import {SceneLeadContext} from './sceneTime';
import {colors} from './theme';
import './fonts';

export type ExplainerProps = {showCaptions: boolean};

export const HostasticExplainer: React.FC<ExplainerProps> = ({showCaptions}) => {
  const {durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill style={{background: colors.bg}}>
      {SCENES.map((scene, i) => {
        // Each scene starts half a transition early and ends half the next
        // transition late, so cuts stay centred on the storyboard times.
        const lead = Math.round(scene.transitionIn.frames / 2);
        const next = SCENES[i + 1];
        const tail = next ? Math.round(next.transitionIn.frames / 2) : 0;
        const from = sec(scene.start) - lead;
        const to = Math.min(durationInFrames, sec(scene.end) + tail);
        const Scene = SCENE_COMPONENTS[scene.id];
        return (
          <Sequence key={scene.id} from={from} durationInFrames={to - from} name={scene.title}>
            <SceneLeadContext.Provider value={lead}>
              <SceneTransition transition={scene.transitionIn}>
                <Scene />
              </SceneTransition>
            </SceneLeadContext.Provider>
          </Sequence>
        );
      })}
      {showCaptions ? <Captions /> : null}
      <Soundtrack />
    </AbsoluteFill>
  );
};
