import {Easing, interpolate, spring} from 'remotion';
import {FPS} from './script';

export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45);

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

/** 0 → 1 spring starting at `start`. */
export const pop = (
  frame: number,
  start: number,
  config: {damping?: number; stiffness?: number; mass?: number} = {},
) =>
  spring({
    frame: frame - start,
    fps: FPS,
    config: {damping: 14, stiffness: 150, mass: 0.8, ...config},
  });

/** Gentle 0 → 1 spring with no overshoot. */
export const settle = (frame: number, start: number, durationInFrames = 24) =>
  spring({
    frame: frame - start,
    fps: FPS,
    durationInFrames,
    config: {damping: 200},
  });

/** Fade + rise entrance style. */
export const fadeUp = (frame: number, start: number, distance = 28, duration = 20) => {
  const p = tween(frame, start, start + duration, 0, 1);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * distance}px)`,
  } as const;
};

/** Fade-out multiplier (1 → 0) between two frames. */
export const fadeOut = (frame: number, start: number, duration = 12) =>
  tween(frame, start, start + duration, 1, 0, easeInOut);
