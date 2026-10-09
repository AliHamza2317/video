import React from 'react';
import {colors} from '../theme';
import {LogoMark} from './Logo';

type Pose = 'stressed' | 'relaxed';

/**
 * Flat front-view host sitting behind a laptop. 600×600 viewBox; the desk
 * extends sideways past the viewBox so it can span the whole frame.
 */
export const HostCharacter: React.FC<{
  pose: Pose;
  frame: number;
  width?: number;
  shirt?: string;
  chair?: string;
  desk?: string;
  deskEdge?: string;
  lid?: string;
  lidLogo?: boolean;
  mug?: boolean;
  style?: React.CSSProperties;
}> = ({
  pose,
  frame,
  width = 600,
  shirt = colors.teal,
  chair = '#24434C',
  desk = colors.desk,
  deskEdge = colors.deskEdge,
  lid = '#E9EEF0',
  lidLogo = false,
  mug = true,
  style,
}) => {
  const stressed = pose === 'stressed';

  // Small idle motion: nervous head jitter vs. slow breathing.
  const headTilt = stressed ? Math.sin(frame * 0.9) * 2.2 + Math.sin(frame * 2.3) * 0.8 : Math.sin(frame / 22) * 1.5;
  const breathe = stressed ? 0 : Math.sin(frame / 18) * 3;
  const lean = stressed ? 0 : -3;
  const blink = stressed && frame % 50 > 46;

  const sleeve = shirt;
  const ink = '#3A2420';

  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 600 600"
      style={{overflow: 'visible', ...style}}
    >
      {/* Upper body, leaning back a touch when relaxed */}
      <g transform={`rotate(${lean} 300 560) translate(0 ${breathe})`}>
        <rect x="178" y="236" width="244" height="360" rx="70" fill={chair} />

        {!stressed && (
          <g strokeLinecap="round" fill="none">
            <path d="M226 324 L134 182" stroke={sleeve} strokeWidth="48" />
            <path d="M374 324 L466 182" stroke={sleeve} strokeWidth="48" />
            <path d="M134 182 L252 136" stroke={colors.skin} strokeWidth="34" />
            <path d="M466 182 L348 136" stroke={colors.skin} strokeWidth="34" />
          </g>
        )}

        {/* Torso + neck */}
        <rect x="279" y="250" width="42" height="56" rx="16" fill={colors.skinShade} />
        <path
          d="M192 600 L200 354 C204 312 238 290 300 290 C362 290 396 312 400 354 L408 600 Z"
          fill={shirt}
        />
        <path d="M274 291 Q300 332 326 291 Z" fill={colors.skinShade} />

        {/* Head */}
        <g transform={`rotate(${headTilt} 300 250)`}>
          <circle cx="238" cy="214" r="13" fill={colors.skinShade} />
          <circle cx="362" cy="214" r="13" fill={colors.skinShade} />
          <ellipse cx="300" cy="205" rx="62" ry="68" fill={colors.skin} />
          <path
            d="M237 218 C224 150 258 120 302 120 C348 120 378 152 364 218 C360 190 348 172 330 164 C306 176 270 174 250 164 C242 178 238 196 237 218 Z"
            fill={colors.hair}
          />

          {stressed ? (
            <g>
              <path d="M261 186 L287 177" stroke={colors.hair} strokeWidth="5" strokeLinecap="round" />
              <path d="M313 177 L339 186" stroke={colors.hair} strokeWidth="5" strokeLinecap="round" />
              {blink ? (
                <>
                  <path d="M269 207 h14" stroke={ink} strokeWidth="4" strokeLinecap="round" />
                  <path d="M317 207 h14" stroke={ink} strokeWidth="4" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <ellipse cx="276" cy="207" rx="6" ry="7.5" fill={ink} />
                  <ellipse cx="324" cy="207" rx="6" ry="7.5" fill={ink} />
                </>
              )}
              <path
                d="M282 241 q9 -7 18 0 q9 7 18 0"
                stroke={ink}
                strokeWidth="4.5"
                fill="none"
                strokeLinecap="round"
              />
              <path d="M368 150 q10 14 0 22 q-10 -8 0 -22 Z" fill="#9BCFEA" />
            </g>
          ) : (
            <g fill="none" strokeLinecap="round">
              <path d="M260 182 q14 -7 28 0" stroke={colors.hair} strokeWidth="5" />
              <path d="M312 182 q14 -7 28 0" stroke={colors.hair} strokeWidth="5" />
              <path d="M265 207 q11 9 22 0" stroke={ink} strokeWidth="4.5" />
              <path d="M313 207 q11 9 22 0" stroke={ink} strokeWidth="4.5" />
              <path d="M279 232 q21 21 42 0" stroke={ink} strokeWidth="4.5" />
              <circle cx="260" cy="228" r="11" fill={colors.coral} opacity="0.22" stroke="none" />
              <circle cx="340" cy="228" r="11" fill={colors.coral} opacity="0.22" stroke="none" />
            </g>
          )}
        </g>

        {stressed && (
          <g strokeLinecap="round" fill="none">
            <path d="M188 470 L204 400" stroke={sleeve} strokeWidth="48" />
            <path d="M412 470 L396 400" stroke={sleeve} strokeWidth="48" />
            <path d="M204 410 L244 222" stroke={colors.skin} strokeWidth="34" />
            <path d="M396 410 L356 222" stroke={colors.skin} strokeWidth="34" />
            <circle cx="246" cy="208" r="23" fill={colors.skin} />
            <circle cx="354" cy="208" r="23" fill={colors.skin} />
          </g>
        )}
      </g>

      {/* Desk */}
      <rect x="-1400" y="548" width="3400" height="700" fill={desk} />
      <rect x="-1400" y="548" width="3400" height="10" fill={deskEdge} />

      {/* Laptop (lid faces the viewer) */}
      <rect x="150" y="544" width="300" height="12" rx="6" fill="#B9C3C7" />
      <rect x="168" y="378" width="264" height="172" rx="16" fill={lid} />
      {lidLogo ? (
        <foreignObject x="272" y="436" width="56" height="56">
          <LogoMark size={56} />
        </foreignObject>
      ) : (
        <circle cx="300" cy="464" r="16" fill="#fff" opacity="0.6" />
      )}

      {mug ? <Mug frame={frame} steam={!stressed} /> : null}
    </svg>
  );
};

const Mug: React.FC<{frame: number; steam: boolean}> = ({frame, steam}) => (
  <g>
    {steam &&
      [0, 1].map((i) => {
        const t = (frame / 40 + i * 0.5) % 1;
        return (
          <path
            key={i}
            d={`M${488 + i * 16} ${470 - t * 30} q-8 -12 0 -24 q8 -12 0 -24`}
            stroke="#fff"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity={Math.sin(t * Math.PI) * 0.7}
          />
        );
      })}
    <circle cx="526" cy="514" r="15" stroke="#F0F3F4" strokeWidth="8" fill="none" />
    <rect x="468" y="484" width="60" height="70" rx="12" fill="#F0F3F4" />
    <rect x="468" y="500" width="60" height="12" fill={colors.coral} opacity="0.75" />
  </g>
);
