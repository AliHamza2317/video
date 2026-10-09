import {createContext, useContext} from 'react';
import {useCurrentFrame} from 'remotion';

/**
 * Each scene's <Sequence> starts a little before its storyboard start time so
 * transitions can overlap. The lead is provided here so scenes can work in
 * "storyboard time": useSceneFrame() === 0 at the scene's storyboard start.
 */
export const SceneLeadContext = createContext(0);

export const useSceneFrame = () => useCurrentFrame() - useContext(SceneLeadContext);
