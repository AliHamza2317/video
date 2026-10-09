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

export const SCREENS: Record<'channels' | 'direct' | 'reporting', ScreenSpec> = {
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
  // Designed in the app's style (src/designs/BookingSiteDesign.tsx, 1600x1037):
  // the host's own domain, then Book now, the host notification and the
  // $0.00 commission line.
  direct: {
    file: 'booking-website',
    label: 'Booking website screen',
    aspect: 1600 / 1037,
    camera: [
      {t: 0, x: 0.44, y: 0.4, zoom: 1.15},
      {t: 2.0, x: 0.72, y: 0.42, zoom: 1.5},
      {t: 2.8, x: 0.74, y: 0.37, zoom: 1.5},
      {t: 5.4, x: 0.76, y: 0.36, zoom: 1.62},
    ],
    rings: [
      {t: 0.3, x: 0.318, y: 0.004, w: 0.364, h: 0.047, hold: 1.8},
      {t: 3.3, x: 0.652, y: 0.486, w: 0.314, h: 0.05},
    ],
    clicks: [{t: 2.3, x: 0.8125, y: 0.3857}],
  },
  // Designed in the app's style (src/designs/ReportsDesign.tsx, 1600x1037):
  // invoices, today's check-ins and checkouts, then guest, property and
  // channel reports.
  reporting: {
    file: 'reporting',
    label: 'Reporting screen',
    aspect: 1600 / 1037,
    camera: [
      {t: 0, x: 0.33, y: 0.53, zoom: 1.45},
      {t: 2.9, x: 0.68, y: 0.55, zoom: 1.45},
      {t: 5.6, x: 0.74, y: 0.6, zoom: 1.6},
      {t: 8.2, x: 0.75, y: 0.62, zoom: 1.7},
    ],
    rings: [
      {t: 0.3, x: 0.076, y: 0.343, w: 0.458, h: 0.618, hold: 1.1},
      {t: 1.45, x: 0.076, y: 0.222, w: 0.446, h: 0.108, hold: 1.5},
      {t: 5.5, x: 0.55, y: 0.469, w: 0.4125, h: 0.42},
    ],
    clicks: [
      {t: 3.9, x: 0.698, y: 0.428},
      {t: 4.7, x: 0.792, y: 0.428},
    ],
  },
};

/** Guest messaging scene: late-night questions, answered instantly by AI. */
export type ChatCard = {
  initials: string;
  name: string;
  property: string;
  channel: 'Airbnb' | 'Booking.com' | 'VRBO' | 'Direct';
  time: string;
  language: string;
  question: string;
  answer: string;
  /** Scene seconds when the card appears and when the AI reply lands. */
  at: number;
  replyAt: number;
  x: number;
  y: number;
};

export const CHAT_CARDS: ChatCard[] = [
  {
    initials: 'JW',
    name: 'James Wilson',
    property: 'Sunset Villa Malibu',
    channel: 'Airbnb',
    time: '11:42 PM',
    language: 'English',
    question: 'Is early check-in possible on Apr 7?',
    answer: 'Hi James! Early check-in is available on April 7. We can welcome you from 10am.',
    at: 0,
    replyAt: 0.85,
    x: 704,
    y: 140,
  },
  {
    initials: 'LM',
    name: 'Lucía Moreno',
    property: 'Ocean Breeze Condo',
    channel: 'Booking.com',
    time: '1:15 AM',
    language: 'Español',
    question: '¿Hay aparcamiento cerca del apartamento?',
    answer: '¡Sí! Tienes una plaza gratuita justo al lado de la entrada.',
    at: 2.9,
    replyAt: 3.45,
    x: 1268,
    y: 338,
  },
  {
    initials: 'JD',
    name: 'Julien Dubois',
    property: 'Mountain Retreat',
    channel: 'VRBO',
    time: '3:07 AM',
    language: 'Français',
    question: 'Le Wi-Fi est-il inclus ?',
    answer: "Oui ! Le code Wi-Fi est dans votre guide d'arrivée.",
    at: 3.85,
    replyAt: 4.4,
    x: 740,
    y: 528,
  },
];
