import timeline from './timeline.json';

/**
 * Scene, voiceover and caption timings come from src/timeline.json, which
 * voiceover/build.py generates from the measured voiceover. Everything that
 * appears on screen is defined here.
 *
 * On-screen copy rules: no em dashes or double dashes, never "Dashboard",
 * never call the platform free (only Reporting is free for every user).
 */

export const FPS = timeline.fps;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TOTAL_FRAMES = Math.round(timeline.duration * FPS);

export const sec = (s: number) => Math.round(s * FPS);

/** Crossfade between scenes (0.27 s, under the 0.3 s limit). */
export const TRANSITION_FRAMES = 8;

export type SceneId = 'problem' | 'solution' | 'channels' | 'direct' | 'ai' | 'reporting' | 'close';

export type TimelineScene = {id: SceneId; start: number; end: number};
export type Cue = {text: string; start: number};
export type TimelineLine = {id: SceneId; text: string; start: number; end: number; cues: Cue[]};

export const SCENES = timeline.scenes as TimelineScene[];
export const LINES = timeline.lines as TimelineLine[];

export const CTA_URL = 'hostasticnow.com';
export const CTA_LABEL = 'Get started';

export type Headline = {chip?: string; lines: string[]; accent?: number[]};

export const HEADLINES: Record<SceneId, Headline> = {
  problem: {lines: ['5 tools.', '1 calendar.', 'Zero peace of mind.'], accent: [2]},
  solution: {lines: ['Everything, in one place.']},
  channels: {chip: 'Channel Manager', lines: ['Sync once.', 'Update everywhere.'], accent: [1]},
  direct: {chip: 'Booking Website', lines: ['Your brand.', 'Your booking.', '0% commission.'], accent: [2]},
  ai: {chip: 'Guest Messaging', lines: ['Instant answers.', 'Any language.', 'Any hour.'], accent: [0]},
  reporting: {chip: 'Reporting', lines: ['Every number.', 'Zero extra cost.'], accent: [1]},
  close: {lines: ['One platform.', 'Every booking channel.'], accent: [1]},
};

/**
 * Real app screens. Drop a file named `public/screens/<file>.<ext>` (png, jpg,
 * webp, mp4, webm or mov) and it replaces the labelled placeholder.
 *
 * All positions are fractions of the screen (0 to 1, left/top origin) and all
 * times are seconds from the scene start, so they survive a re-export at a
 * different resolution. They are first guesses: once the real screens are in,
 * move the rings and clicks onto the parts worth pointing at.
 */
export type CameraKey = {t: number; x: number; y: number; zoom: number};
export type Ring = {t: number; x: number; y: number; w: number; h: number; hold?: number};
export type Click = {t: number; x: number; y: number};

export type ScreenSpec = {
  file: string;
  label: string;
  aspect: number;
  camera: CameraKey[];
  rings: Ring[];
  clicks: Click[];
  /** For screen recordings: where to start playing, in seconds. */
  videoStart?: number;
};

export const SCREENS: Record<'channels' | 'direct' | 'ai' | 'reporting', ScreenSpec> = {
  // Unified Calendar (2000x1296): Airbnb and Booking.com stays on one calendar,
  // then a click on Refresh to sync.
  channels: {
    file: 'channel-manager',
    label: 'Channel Manager screen',
    aspect: 2000 / 1296,
    camera: [
      {t: 0, x: 0.33, y: 0.46, zoom: 2.0},
      {t: 2.6, x: 0.5, y: 0.47, zoom: 2.1},
      {t: 4.6, x: 0.74, y: 0.45, zoom: 2.1},
      {t: 7.2, x: 0.76, y: 0.46, zoom: 2.2},
    ],
    rings: [
      {t: 0.5, x: 0.272, y: 0.355, w: 0.174, h: 0.042},
      {t: 2.2, x: 0.4885, y: 0.411, w: 0.149, h: 0.042},
    ],
    clicks: [{t: 5.4, x: 0.946, y: 0.273}],
  },
  direct: {
    file: 'booking-website',
    label: 'Booking website screen',
    aspect: 16 / 10,
    camera: [
      {t: 0, x: 0.45, y: 0.32, zoom: 1.12},
      {t: 5.4, x: 0.6, y: 0.62, zoom: 1.3},
    ],
    rings: [{t: 3.4, x: 0.66, y: 0.56, w: 0.24, h: 0.14}],
    clicks: [{t: 2.8, x: 0.78, y: 0.63}],
  },
  // Conversations (2000x1296): the AI-generated reply, AI reply suggestions,
  // then a click on the composer's AI button.
  ai: {
    file: 'guest-messaging',
    label: 'Guest messaging screen',
    aspect: 2000 / 1296,
    camera: [
      {t: 0, x: 0.6, y: 0.38, zoom: 2.1},
      {t: 3.0, x: 0.53, y: 0.62, zoom: 2.0},
      {t: 5.2, x: 0.52, y: 0.84, zoom: 2.1},
      {t: 7.6, x: 0.52, y: 0.86, zoom: 2.15},
    ],
    rings: [
      {t: 0.5, x: 0.4635, y: 0.38, w: 0.302, h: 0.085},
      {t: 3.0, x: 0.284, y: 0.698, w: 0.481, h: 0.121},
    ],
    clicks: [{t: 5.6, x: 0.7105, y: 0.915}],
  },
  reporting: {
    file: 'reporting',
    label: 'Reporting screen',
    aspect: 16 / 10,
    camera: [
      {t: 0, x: 0.36, y: 0.4, zoom: 1.2},
      {t: 8.2, x: 0.62, y: 0.55, zoom: 1.2},
    ],
    rings: [
      {t: 0.9, x: 0.1, y: 0.18, w: 0.4, h: 0.18},
      {t: 3.4, x: 0.55, y: 0.45, w: 0.38, h: 0.3},
    ],
    clicks: [{t: 5.6, x: 0.5, y: 0.12}],
  },
};
