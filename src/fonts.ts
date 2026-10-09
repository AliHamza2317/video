import {loadFont} from '@remotion/fonts';
import inter400 from '@fontsource/inter/files/inter-latin-400-normal.woff2';
import inter500 from '@fontsource/inter/files/inter-latin-500-normal.woff2';
import inter600 from '@fontsource/inter/files/inter-latin-600-normal.woff2';
import inter700 from '@fontsource/inter/files/inter-latin-700-normal.woff2';
import jakarta600 from '@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-600-normal.woff2';
import jakarta700 from '@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-700-normal.woff2';
import jakarta800 from '@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-800-normal.woff2';

// Fonts are bundled from npm so rendering never depends on Google Fonts.
const faces: Array<[family: string, url: string, weight: string]> = [
  ['Inter', inter400, '400'],
  ['Inter', inter500, '500'],
  ['Inter', inter600, '600'],
  ['Inter', inter700, '700'],
  ['Plus Jakarta Sans', jakarta600, '600'],
  ['Plus Jakarta Sans', jakarta700, '700'],
  ['Plus Jakarta Sans', jakarta800, '800'],
];

for (const [family, url, weight] of faces) {
  loadFont({family, url, weight, format: 'woff2'});
}
