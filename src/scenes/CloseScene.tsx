import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ArrowRight} from 'lucide-react';
import {easeOut, enter, enterScale, tween} from '../anim';
import {Backdrop} from '../components/Backdrop';
import {Logo} from '../components/Logo';
import {CTA_LABEL, CTA_URL, HEADLINES, sec} from '../script';
import {useSceneFrame} from '../sceneTime';
import {colors, fonts} from '../theme';

const CLICK_AT = sec(4.6);

export const CloseScene: React.FC = () => {
  const frame = useSceneFrame();
  const drift = tween(frame, 0, sec(9), 0, -14, (x) => x);
  const glow = 0.5 + 0.5 * Math.sin(frame / 9);
  const pressed = frame >= CLICK_AT && frame < CLICK_AT + 5;
  const [first, second] = HEADLINES.close.lines;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop drift={frame * 0.3} />
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 196, transform: `translateY(${drift}px)`}}>
        <div style={enterScale(frame, -4, 0.92, 12)}>
          <Logo width={620} />
        </div>
        <div
          style={{
            ...enter(frame, -2, 24),
            marginTop: 54,
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 72,
            letterSpacing: '-0.035em',
            color: colors.ink,
            whiteSpace: 'nowrap',
          }}
        >
          {first} <span style={{color: colors.teal}}>{second}</span>
        </div>
        <div style={{...enter(frame, 1, 20), marginTop: 52, position: 'relative'}}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '24px 52px',
              borderRadius: 999,
              background: `linear-gradient(135deg, #1BB9B3 0%, ${colors.tealDark} 100%)`,
              color: '#fff',
              fontFamily: fonts.body,
              fontWeight: 700,
              fontSize: 40,
              transform: `scale(${pressed ? 0.96 : 1})`,
              boxShadow: `0 0 0 ${8 + glow * 12}px rgba(18,165,160,${0.12 + glow * 0.1}), 0 20px 40px rgba(18,165,160,0.35)`,
            }}
          >
            {CTA_LABEL}
            <ArrowRight size={40} strokeWidth={2.6} />
          </div>
          <Cursor frame={frame} />
        </div>
        <div style={{...enter(frame, 3, 16), marginTop: 30, fontFamily: fonts.body, fontWeight: 600, fontSize: 38, color: colors.slate}}>
          {CTA_URL}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Cursor: React.FC<{frame: number}> = ({frame}) => {
  const arrive = CLICK_AT - 14;
  if (frame < arrive - 2) return null;
  const move = tween(frame, arrive, CLICK_AT - 2, 0, 1, easeOut);
  const ripple = tween(frame, CLICK_AT, CLICK_AT + 14, 0, 1, easeOut);
  const x = 250 + (1 - move) * 160;
  const y = 54 + (1 - move) * 120;
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: tween(frame, arrive - 2, arrive + 4, 0, 1)}}>
      {frame >= CLICK_AT ? (
        <div style={{position: 'absolute', left: -40, top: -40, width: 80, height: 80, borderRadius: '50%', border: '4px solid #fff', transform: `scale(${0.3 + ripple})`, opacity: 1 - ripple}} />
      ) : null}
      <svg width={48} height={48} viewBox="0 0 24 24" style={{position: 'absolute', left: -6, top: -3, filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.3))'}}>
        <path d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.6 L11 13.4 L18 13.4 Z" fill="#14262C" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
