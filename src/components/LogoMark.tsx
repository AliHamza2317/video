import React from 'react';
import {Img, staticFile} from 'remotion';

// Shows only the mark from the client logo file by masking it (the file
// itself is untouched). The mark occupies the first 65x68 px of the PNG.
const SRC_W = 318;
const SRC_H = 68;
const MARK_W = 65;

export const LogoMark: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => (
  <div style={{width: (size * MARK_W) / SRC_H, height: size, overflow: 'hidden', flexShrink: 0, ...style}}>
    <Img
      src={staticFile('brand/hostastic-logo.png')}
      style={{height: size, width: (size * SRC_W) / SRC_H, maxWidth: 'none', display: 'block'}}
    />
  </div>
);
