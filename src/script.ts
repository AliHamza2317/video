/**
 * The storyboard from "hostastic-explainer-script.md" as data.
 *
 * Scene start/end times match the storyboard (seconds). Caption cue times are
 * paced for a natural read of the voiceover; once the real VO is recorded,
 * nudge the `from`/`to` values to line up with it.
 */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export type SceneId =
  | 'problem'
  | 'solution'
  | 'channels'
  | 'direct'
  | 'ai'
  | 'reporting'
  | 'close';

export type TransitionIn = {type: 'none' | 'fade' | 'wipe'; frames: number};

export type Cue = {from: number; to: number; text: string};

export type Scene = {
  id: SceneId;
  title: string;
  start: number;
  end: number;
  transitionIn: TransitionIn;
  onScreenText: string;
  voiceover: string;
  captions: Cue[];
};

export const SCENES: Scene[] = [
  {
    id: 'problem',
    title: 'Scene 1 — The Problem',
    start: 0,
    end: 6,
    transitionIn: {type: 'none', frames: 0},
    onScreenText: '5 platforms. 1 calendar. 0 peace of mind.',
    voiceover:
      'Running a vacation rental means juggling five different tools just to keep your calendar straight.',
    captions: [
      {from: 0.3, to: 3.0, text: 'Running a vacation rental means juggling five different tools'},
      {from: 3.0, to: 5.7, text: 'just to keep your calendar straight.'},
    ],
  },
  {
    id: 'solution',
    title: 'Scene 2 — The Solution',
    start: 6,
    end: 12,
    transitionIn: {type: 'wipe', frames: 24},
    onScreenText: 'Hostastic — everything, in one place.',
    voiceover:
      "Hostastic brings it all into one place, built for hosts who'd rather grow than manage.",
    captions: [
      {from: 6.4, to: 8.6, text: 'Hostastic brings it all into one place,'},
      {from: 8.6, to: 11.6, text: "built for hosts who'd rather grow than manage."},
    ],
  },
  {
    id: 'channels',
    title: 'Scene 3 — Channel Manager',
    start: 12,
    end: 24,
    transitionIn: {type: 'fade', frames: 16},
    onScreenText: 'Sync once. Update everywhere.',
    voiceover:
      'Sync every booking channel — Airbnb, Booking.com, Vrbo — automatically. No double bookings, no manual updates.',
    captions: [
      {from: 12.5, to: 14.4, text: 'Sync every booking channel —'},
      {from: 14.4, to: 18.0, text: 'Airbnb, Booking.com, Vrbo — automatically.'},
      {from: 18.3, to: 21.8, text: 'No double bookings, no manual updates.'},
    ],
  },
  {
    id: 'direct',
    title: 'Scene 4 — Direct Booking / Hostastic Website',
    start: 24,
    end: 36,
    transitionIn: {type: 'fade', frames: 16},
    onScreenText: 'Your brand. Your booking. 0% commission.',
    voiceover:
      'Give guests a way to book directly, on your own branded website — no commission, no middleman.',
    captions: [
      {from: 24.5, to: 26.8, text: 'Give guests a way to book directly,'},
      {from: 26.8, to: 29.2, text: 'on your own branded website —'},
      {from: 29.4, to: 32.2, text: 'no commission, no middleman.'},
    ],
  },
  {
    id: 'ai',
    title: 'Scene 5 — AI Guest Communication',
    start: 36,
    end: 50,
    transitionIn: {type: 'fade', frames: 16},
    onScreenText: 'Instant answers. Any language. Any hour.',
    voiceover:
      'Let AI handle the repetitive guest messages — check-in details, FAQs, even multiple languages — while you focus on the hospitality that actually matters.',
    captions: [
      {from: 36.5, to: 39.6, text: 'Let AI handle the repetitive guest messages —'},
      {from: 39.6, to: 43.2, text: 'check-in details, FAQs, even multiple languages —'},
      {from: 43.6, to: 46.0, text: 'while you focus on the hospitality'},
      {from: 46.0, to: 48.4, text: 'that actually matters.'},
    ],
  },
  {
    id: 'reporting',
    title: 'Scene 6 — Reporting',
    start: 50,
    end: 64,
    transitionIn: {type: 'fade', frames: 16},
    onScreenText: 'Every number. Zero extra cost.',
    voiceover:
      "And see exactly how you're doing with built-in reporting — invoices, occupancy, guest and channel breakdowns — free for every Hostastic user.",
    captions: [
      {from: 50.5, to: 54.2, text: "And see exactly how you're doing with built-in reporting —"},
      {from: 54.2, to: 58.2, text: 'invoices, occupancy, guest and channel breakdowns —'},
      {from: 58.5, to: 61.4, text: 'free for every Hostastic user.'},
    ],
  },
  {
    id: 'close',
    title: 'Scene 7 — Close / CTA',
    start: 64,
    end: 76,
    transitionIn: {type: 'fade', frames: 20},
    onScreenText: 'One platform. Every booking channel. Get started free. / hostasticnow.com',
    voiceover:
      "One platform. Every booking channel. Happier guests, less busywork — that's Hostastic.",
    captions: [
      {from: 64.6, to: 67.6, text: 'One platform. Every booking channel.'},
      {from: 67.8, to: 70.0, text: 'Happier guests, less busywork —'},
      {from: 70.0, to: 72.4, text: "that's Hostastic."},
    ],
  },
];

export const CTA_URL = 'hostasticnow.com';

export const TOTAL_SECONDS = SCENES[SCENES.length - 1].end;
export const TOTAL_FRAMES = Math.round(TOTAL_SECONDS * FPS);

export const sec = (s: number) => Math.round(s * FPS);
