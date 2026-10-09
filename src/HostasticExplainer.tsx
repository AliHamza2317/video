import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Captions} from './components/Captions';
import {SceneTransition} from './components/SceneTransition';
import {Soundtrack} from './components/Soundtrack';
import {CloseScene} from './scenes/CloseScene';
import {FeatureScene} from './scenes/FeatureScene';
import {ProblemScene} from './scenes/ProblemScene';
import {SolutionScene} from './scenes/SolutionScene';
import {SCENES, SceneId, sec, TOTAL_FRAMES, TRANSITION_FRAMES} from './script';
import {SceneLeadContext} from './sceneTime';
import {colors} from './theme';
import './fonts';

const RENDER: Record<SceneId, React.FC> = {
  problem: ProblemScene,
  solution: SolutionScene,
  channels: () => <FeatureScene id="channels" />,
  direct: () => <FeatureScene id="direct" />,
  ai: () => <FeatureScene id="ai" />,
  reporting: () => <FeatureScene id="reporting" />,
  close: CloseScene,
};

export type ExplainerProps = {showCaptions: boolean};

export const HostasticExplainer: React.FC<ExplainerProps> = ({showCaptions}) => {
  const half = TRANSITION_FRAMES / 2;
  return (
    <AbsoluteFill style={{background: colors.cream}}>
      {SCENES.map((scene, i) => {
        // Crossfades are centred on the cut, so each scene starts half a
        // transition early and runs half a transition past its end.
        const lead = i === 0 ? 0 : half;
        const tail = i === SCENES.length - 1 ? 0 : half;
        const from = sec(scene.start) - lead;
        const to = Math.min(TOTAL_FRAMES, sec(scene.end) + tail);
        const Scene = RENDER[scene.id];
        return (
          <Sequence key={scene.id} from={from} durationInFrames={to - from} name={scene.id}>
            <SceneLeadContext.Provider value={lead}>
              <SceneTransition type={i === 0 ? 'none' : scene.id === 'solution' ? 'wipe' : 'fade'}>
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
