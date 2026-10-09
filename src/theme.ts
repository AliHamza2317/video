// Hostastic brand theme, sampled from the logo, the web app and hostasticnow.com.
export const colors = {
  // Brand
  orange: '#F78E52', // logo mark, primary CTA, accents
  orangeDeep: '#EC7536',
  peach: '#FCEBE4', // AI bubbles, selected states
  peachGlow: '#FDDCCB',
  cream: '#FFF8EF', // app and site background
  ink: '#1C1B29', // logo wordmark, headings
  navy: '#2D2B41', // secondary buttons
  navyLight: '#4F4D75',
  slate: '#5F5C6E',
  muted: '#9B97A6',
  line: '#ECE3D9',
  white: '#FFFFFF',

  // Accents
  coral: '#FF7E67',
  amber: '#F5B444',

  // Booking channels
  airbnb: '#FF5A5F',
  booking: '#0A3D91',
  vrbo: '#2F64D6',

  // Scene 1 (muted, cluttered)
  dull: '#D5D1C9',
  dullInk: '#3A3845',
  alarm: '#C2553F',

  // Illustration
  skin: '#D49B78',
  skinShade: '#BC8160',
  hair: '#2D2730',
  desk: '#E4D7C5',
  deskEdge: '#CDBBA3',
} as const;

export const fonts = {
  // Headings: high-contrast serif, as on hostasticnow.com
  display: '"DM Serif Display", Georgia, serif',
  body: 'Inter, system-ui, sans-serif',
} as const;
