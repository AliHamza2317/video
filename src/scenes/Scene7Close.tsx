import React from 'react';
import {AbsoluteFill, Freeze, interpolate} from 'remotion';
import {ArrowRight} from 'lucide-react';
import {easeInOut, fadeUp, pop, tween} from '../anim';
import {Backdrop} from '../components/Backdrop';
import {Logo} from '../components/Logo';
import {CTA_URL} from '../script';
import {SceneLeadContext, useSceneFrame} from '../sceneTime';
import {colors, fonts} from '../theme';
import {Scene3Channels} from './Scene3Channels';
import {Scene4Direct} from './Scene4Direct';
import {Scene5AI} from './Scene5AI';
import {Scene6Reporting} from './Scene6Reporting';

const TILE_SCALE = 0.3;
const TILE_W = 1920 * TILE_SCALE;
const TILE_H = 1080 * TILE_SCALE;
const GAP = 30;
const GRID_TOP = 150;

// The four feature screens, frozen on a representative moment.
const TILES: Array<{Comp: React.FC; frame: number; from: [number, number]}> = [
  {Comp: Scene3Channels, frame: 300, from: [-700, -500]},
  {Comp: Scene4Direct, frame: 300, from: [700, -500]},
  {Comp: Scene5AI, frame: 236, from: [-700, 500]},
  {Comp: Scene6Reporting, frame: 380, from: [700, 500]},
];

const MERGE = 128;

export const Scene7Close: React.FC = () => {
  const frame = useSceneFrame();
  const drift = tween(frame, 0, 380, 0, -16, (t) => t);

  const merge = tween(frame, MERGE, MERGE + 34, 0, 1, easeInOut);
  const logoIn = pop(frame, MERGE + 22, {damping: 12});
  const glow = 0.5 + 0.5 * Math.sin((frame - 200) / 9);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop drift={frame * 0.3} />

      <AbsoluteFill style={{transform: `translateY(${drift}px)`}}>
        {/* 2×2 grid of feature screens that collapses into the logo */}
        {TILES.map(({Comp, frame: still, from}, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const gx = 960 - TILE_W - GAP / 2 + col * (TILE_W + GAP);
          const gy = GRID_TOP + row * (TILE_H + GAP);
          const p = pop(frame, 4 + i * 6, {damping: 17, stiffness: 110});
          const x = interpolate(p, [0, 1], [from[0], 0]);
          const y = interpolate(p, [0, 1], [from[1], 0]);
          const s = interpolate(p, [0, 1], [2.2, 1]);
          // Converge on the logo position
          const cx = 960 - (gx + TILE_W / 2);
          const cy = 400 - (gy + TILE_H / 2);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: gx,
                top: gy,
                width: TILE_W,
                height: TILE_H,
                borderRadius: 22,
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(14,47,56,0.18)',
                border: `1px solid ${colors.line}`,
                opacity: Math.min(1, p * 1.5) * (1 - merge),
                transform: `translate(${x + cx * merge}px, ${y + cy * merge}px) scale(${s * (1 - merge * 0.75)})`,
              }}
            >
              <div style={{width: 1920, height: 1080, transform: `scale(${TILE_SCALE})`, transformOrigin: 'top left'}}>
                <SceneLeadContext.Provider value={0}>
                  <Freeze frame={still}>
                    <Comp />
                  </Freeze>
                </SceneLeadContext.Provider>
              </div>
            </div>
          );
        })}

        {/* Logo + CTA */}
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}>
          <div style={{transform: `scale(${logoIn})`, opacity: Math.min(1, logoIn * 1.5)}}>
            <Logo size={136} />
          </div>
          <div
            style={{
              ...fadeUp(frame, MERGE + 44, 26),
              marginTop: 44,
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 60,
              letterSpacing: '-0.03em',
              color: colors.ink,
            }}
          >
            One platform. <span style={{color: colors.teal}}>Every booking channel.</span>
          </div>
          <div style={{...fadeUp(frame, MERGE + 70, 20), marginTop: 46}}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '24px 46px',
                borderRadius: 999,
                background: `linear-gradient(135deg, #1BB9B3 0%, ${colors.tealDark} 100%)`,
                color: '#fff',
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: 36,
                boxShadow: `0 0 0 ${8 + glow * 12}px rgba(18,165,160,${0.12 + glow * 0.1}), 0 20px 40px rgba(18,165,160,0.35)`,
              }}
            >
              Get started free
              <ArrowRight size={36} strokeWidth={2.6} />
            </div>
          </div>
          <div
            style={{
              ...fadeUp(frame, MERGE + 88, 16),
              marginTop: 34,
              fontFamily: fonts.body,
              fontWeight: 600,
              fontSize: 32,
              color: colors.slate,
              letterSpacing: '0.01em',
            }}
          >
            {CTA_URL}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
