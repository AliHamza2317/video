import React from 'react';
import {getStaticFiles, Img, staticFile} from 'remotion';

// The client's logo file, used untouched. A vector or larger export dropped
// in as public/brand/hostastic-logo.svg takes precedence (sharper at 1080p).
const CANDIDATES = ['brand/hostastic-logo.svg', 'brand/hostastic-logo.png'];
const PNG_ASPECT = 318 / 68;

export const Logo: React.FC<{width: number; style?: React.CSSProperties}> = ({width, style}) => {
  const files = getStaticFiles();
  const file = CANDIDATES.find((c) => files.some((f) => f.name === c)) ?? CANDIDATES[1];
  return (
    <Img
      src={staticFile(file)}
      style={{width, height: width / PNG_ASPECT, objectFit: 'contain', display: 'block', ...style}}
    />
  );
};
