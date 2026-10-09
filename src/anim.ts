import {Easing, interpolate} from 'remotion';

export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

/** Element entrances: 0.37 s ease-out (the brief allows 0.3 to 0.5 s). */
export const ENTER_FRAMES = 11;

/** Clamped interpolation between two frames. */
export const tween = (
  frame: number,
  start: number,
  end: number,
  from: number,
  to: number,
  easing: (t: number) => number = easeOut,
) =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** Fade + rise entrance. */
export const enter = (frame: number, start: number, distance = 22, duration = ENTER_FRAMES) => {
  const p = tween(frame, start, start + duration, 0, 1);
  return {opacity: p, transform: `translateY(${(1 - p) * distance}px)`} as const;
};

/** Fade + scale entrance (for logos and framed screens). */
export const enterScale = (frame: number, start: number, from = 0.95, duration = ENTER_FRAMES) => {
  const p = tween(frame, start, start + duration, 0, 1);
  return {opacity: p, transform: `scale(${from + (1 - from) * p})`} as const;
};
