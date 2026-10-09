import type React from 'react';
import type {SceneId} from '../script';
import {Scene1Problem} from './Scene1Problem';
import {Scene2Solution} from './Scene2Solution';
import {Scene3Channels} from './Scene3Channels';
import {Scene4Direct} from './Scene4Direct';
import {Scene5AI} from './Scene5AI';
import {Scene6Reporting} from './Scene6Reporting';
import {Scene7Close} from './Scene7Close';

export const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  problem: Scene1Problem,
  solution: Scene2Solution,
  channels: Scene3Channels,
  direct: Scene4Direct,
  ai: Scene5AI,
  reporting: Scene6Reporting,
  close: Scene7Close,
};
