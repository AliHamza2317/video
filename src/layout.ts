import {useVideoConfig} from 'remotion';

/** True for the 1080x1920 Instagram Reel composition. */
export const useIsPortrait = () => {
  const {width, height} = useVideoConfig();
  return height > width;
};

// Reel safe area (1080x1920): Instagram overlays the top ~220 px (header),
// the bottom ~420 px (caption, audio, profile) and a column of buttons on the
// right from about y 1100. Headlines start at y 300 and captions end at y 1560.
export const REEL = {
  headlineTop: 300,
  headlineLeft: 70,
  screenBox: {x: 40, y: 710, w: 1000, h: 680},
  captionBottom: 360,
} as const;
