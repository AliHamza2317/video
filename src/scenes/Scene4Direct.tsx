import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Car, Check, Globe, Menu, Star, Waves, Wifi, CalendarDays, Users} from 'lucide-react';
import {easeInOut, fadeUp, pop, settle, tween} from '../anim';
import {Backdrop} from '../components/Backdrop';
import {Headline} from '../components/Headline';
import {Card} from '../components/ui';
import {useSceneFrame} from '../sceneTime';
import {colors, fonts} from '../theme';

// The host's own brand (deliberately not Hostastic, Airbnb, etc.).
const BRAND = {name: 'Coastline Stays', color: '#0F6E7A', accent: colors.coral};

const PHONE = {x: 380, y: 92, w: 392, h: 800, bezel: 14};
const SCREEN_W = PHONE.w - PHONE.bezel * 2;
const SCREEN_H = PHONE.h - PHONE.bezel * 2;

const T = {
  scrollStart: 26,
  scrollEnd: 132,
  tap: 176,
  confirm: 186,
  receipt: 226,
};

export const Scene4Direct: React.FC = () => {
  const frame = useSceneFrame();
  const phoneIn = settle(frame, 0, 28);
  const drift = tween(frame, 0, 380, 0, -24, (t) => t);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop tint="#FBE5D6" drift={frame * 0.2} />

      {/* Warm glow behind the phone */}
      <div
        style={{
          position: 'absolute',
          left: PHONE.x - 260,
          top: PHONE.y - 120,
          width: PHONE.w + 520,
          height: PHONE.h + 240,
          background: 'radial-gradient(ellipse at center, rgba(255,196,150,0.45) 0%, rgba(255,255,255,0) 65%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: PHONE.x,
          top: PHONE.y,
          transform: `translateY(${(1 - phoneIn) * 140 + drift}px) rotate(${(1 - phoneIn) * -4}deg)`,
          opacity: phoneIn,
        }}
      >
        <Phone frame={frame} />
      </div>

      <FloatingBadge frame={frame} at={60} x={170} y={250} icon={<Star size={22} fill={colors.amber} color={colors.amber} />} label="4.9 · 128 stays" />
      <FloatingBadge frame={frame} at={74} x={96} y={690} icon={<Globe size={22} color={BRAND.color} />} label="coastlinestays.com" />

      <Headline
        chip={{icon: Globe, label: 'Direct Booking'}}
        lines={['Your brand.', 'Your booking.', '0% commission.']}
        highlight={[2]}
        size={76}
        start={10}
        style={{position: 'absolute', left: 1060, top: 150}}
      />

      <Receipt frame={frame} />
    </AbsoluteFill>
  );
};

const FloatingBadge: React.FC<{frame: number; at: number; x: number; y: number; icon: React.ReactNode; label: string}> = ({
  frame,
  at,
  x,
  y,
  icon,
  label,
}) => {
  const p = pop(frame, at, {damping: 13});
  const bob = Math.sin((frame - at) / 20) * 6;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + bob,
        transform: `scale(${p})`,
        opacity: Math.min(1, p * 1.5),
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '14px 20px',
        borderRadius: 18,
        background: '#fff',
        boxShadow: '0 16px 36px rgba(14,47,56,0.14)',
        fontFamily: fonts.body,
        fontWeight: 600,
        fontSize: 20,
        color: colors.ink,
      }}
    >
      {icon}
      {label}
    </div>
  );
};

const Phone: React.FC<{frame: number}> = ({frame}) => {
  const confirm = tween(frame, T.confirm, T.confirm + 22, 0, 1, easeInOut);
  return (
    <div
      style={{
        width: PHONE.w,
        height: PHONE.h,
        borderRadius: 58,
        background: '#14262C',
        padding: PHONE.bezel,
        boxSizing: 'border-box',
        boxShadow: '0 40px 80px rgba(14,47,56,0.28), inset 0 0 0 2px #2C4249',
      }}
    >
      <div
        style={{
          width: SCREEN_W,
          height: SCREEN_H,
          borderRadius: 44,
          overflow: 'hidden',
          position: 'relative',
          background: '#fff',
        }}
      >
        <ListingPage frame={frame} />
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - confirm) * 100}%)`}}>
          <Confirmation frame={frame} />
        </div>
        <StatusBar light={confirm < 0.98} />
        <TapIndicator frame={frame} />
      </div>
    </div>
  );
};

const StatusBar: React.FC<{light: boolean}> = ({light}) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 44,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 28px',
      fontFamily: fonts.body,
      fontWeight: 700,
      fontSize: 15,
      color: colors.ink,
      background: light ? '#fff' : '#EAF6F7',
    }}
  >
    <span>9:41</span>
    <div style={{width: 96, height: 26, borderRadius: 13, background: '#14262C', position: 'absolute', left: '50%', marginLeft: -48, top: 9}} />
    <span style={{display: 'flex', gap: 5, alignItems: 'center'}}>
      <Wifi size={16} strokeWidth={2.6} />
      <span style={{width: 24, height: 11, borderRadius: 3, border: `2px solid ${colors.ink}`, display: 'inline-block'}} />
    </span>
  </div>
);

const ListingPage: React.FC<{frame: number}> = ({frame}) => {
  const scroll = tween(frame, T.scrollStart, T.scrollEnd, 0, 1, easeInOut);
  const contentY = -scroll * 300;
  const photoY = -scroll * 120; // slower = parallax
  const slide = tween(frame, 40, 62, 0, 1, easeInOut) + tween(frame, 90, 112, 0, 1, easeInOut);
  const pressed = frame >= T.tap && frame < T.tap + 8;
  const glow = tween(frame, T.tap - 20, T.tap, 0, 1);

  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: fonts.body}}>
      {/* Photo gallery (parallax) */}
      <div style={{position: 'absolute', top: 96, left: 0, width: SCREEN_W, height: 300, overflow: 'hidden', transform: `translateY(${photoY}px)`}}>
        <div style={{display: 'flex', width: SCREEN_W * 3, height: '100%', transform: `translateX(${-slide * SCREEN_W}px)`}}>
          <Photo variant="exterior" />
          <Photo variant="bedroom" />
          <Photo variant="sunset" />
        </div>
        <div style={{position: 'absolute', bottom: 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 7}}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{width: 8, height: 8, borderRadius: 4, background: '#fff', opacity: Math.round(slide) === i ? 1 : 0.5}} />
          ))}
        </div>
      </div>

      {/* Listing details */}
      <div style={{position: 'absolute', top: 396, left: 0, width: SCREEN_W, transform: `translateY(${contentY}px)`, background: '#fff', padding: '22px 22px 0', boxSizing: 'border-box'}}>
        <div style={{fontSize: 28, fontWeight: 800, color: colors.ink, fontFamily: fonts.display, letterSpacing: '-0.02em'}}>Seaside Loft</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, color: colors.slate, marginTop: 6}}>
          <Star size={15} fill={colors.amber} color={colors.amber} /> 4.9 · 2 bedrooms · Sleeps 4
        </div>
        <div style={{display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap'}}>
          {[
            {icon: Waves, label: 'Ocean view'},
            {icon: Wifi, label: 'Wi-Fi'},
            {icon: Car, label: 'Parking'},
          ].map(({icon: Icon, label}) => (
            <span key={label} style={{display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 12, background: '#F1F6F7', fontSize: 14, fontWeight: 600, color: colors.slate}}>
              <Icon size={15} /> {label}
            </span>
          ))}
        </div>
        <div style={{marginTop: 18, borderRadius: 16, border: `1px solid ${colors.line}`, padding: 14, display: 'flex', flexDirection: 'column', gap: 10}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 600, color: colors.ink}}>
            <CalendarDays size={18} color={BRAND.color} /> Oct 14 → Oct 18
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 600, color: colors.ink}}>
            <Users size={18} color={BRAND.color} /> 2 guests
          </div>
        </div>
        {[0.95, 0.88, 0.92, 0.6, 0.9, 0.75].map((w, i) => (
          <div key={i} style={{height: 10, width: `${w * 100}%`, borderRadius: 5, background: '#EDF2F3', marginTop: i === 0 ? 22 : 12}} />
        ))}
      </div>

      {/* Branded site header */}
      <div style={{position: 'absolute', top: 44, left: 0, right: 0, height: 52, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: `1px solid ${colors.line}`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <div style={{width: 30, height: 30, borderRadius: 9, background: BRAND.color, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Waves size={18} color="#fff" strokeWidth={2.6} />
          </div>
          <span style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 18, color: BRAND.color}}>{BRAND.name}</span>
        </div>
        <Menu size={22} color={colors.ink} />
      </div>

      {/* Sticky booking bar */}
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 96, background: '#fff', borderTop: `1px solid ${colors.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 14px'}}>
        <div>
          <div style={{fontSize: 20, fontWeight: 800, color: colors.ink}}>
            $210 <span style={{fontSize: 14, fontWeight: 500, color: colors.slate}}>/ night</span>
          </div>
          <div style={{fontSize: 13, color: colors.slate, textDecoration: 'underline'}}>$840 total</div>
        </div>
        <div
          style={{
            padding: '15px 26px',
            borderRadius: 16,
            background: BRAND.accent,
            color: '#fff',
            fontWeight: 700,
            fontSize: 19,
            transform: `scale(${pressed ? 0.93 : 1})`,
            boxShadow: `0 0 0 ${glow * 8}px rgba(255,126,103,0.25), 0 8px 18px rgba(255,126,103,${0.25 + glow * 0.3})`,
          }}
        >
          Book Now
        </div>
      </div>
    </div>
  );
};

/** Finger tap: glides in, presses "Book Now", ripples. */
const TapIndicator: React.FC<{frame: number}> = ({frame}) => {
  const start = T.tap - 34;
  if (frame < start || frame > T.tap + 24) return null;
  const move = tween(frame, start, T.tap - 4, 0, 1, easeInOut);
  const target = {x: SCREEN_W - 92, y: SCREEN_H - 58};
  const x = interpolate(move, [0, 1], [target.x + 60, target.x]);
  const y = interpolate(move, [0, 1], [target.y - 230, target.y]);
  const press = frame >= T.tap - 2 && frame < T.tap + 8;
  const ripple = tween(frame, T.tap, T.tap + 20, 0, 1);
  const fade = tween(frame, T.tap + 12, T.tap + 24, 1, 0);
  return (
    <div style={{position: 'absolute', left: x - 28, top: y - 28, opacity: fade}}>
      {frame >= T.tap ? (
        <div style={{position: 'absolute', left: -12, top: -12, width: 80, height: 80, borderRadius: 40, border: '3px solid rgba(255,255,255,0.95)', transform: `scale(${0.6 + ripple})`, opacity: 1 - ripple}} />
      ) : null}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          background: 'rgba(20,38,44,0.32)',
          border: '3px solid rgba(255,255,255,0.9)',
          transform: `scale(${press ? 0.82 : 1})`,
        }}
      />
    </div>
  );
};

const Confirmation: React.FC<{frame: number}> = ({frame}) => {
  const start = T.confirm + 18;
  const ring = pop(frame, start, {damping: 11});
  const check = tween(frame, start + 6, start + 22, 0, 1);
  return (
    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, #EAF6F7 0%, #fff 55%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 150, fontFamily: fonts.body, boxSizing: 'border-box'}}>
      <div style={{width: 128, height: 128, borderRadius: 64, background: colors.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${ring})`, boxShadow: '0 18px 40px rgba(18,165,160,0.35)'}}>
        <svg width={70} height={70} viewBox="0 0 24 24">
          <path d="M5 12.5 L10 17.5 L19 7.5" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - check} />
        </svg>
      </div>
      <div style={{...fadeUp(frame, start + 12, 16), marginTop: 34, fontFamily: fonts.display, fontWeight: 800, fontSize: 34, color: colors.ink, letterSpacing: '-0.02em'}}>
        You&apos;re booked!
      </div>
      <div style={{...fadeUp(frame, start + 18, 16), marginTop: 10, fontSize: 18, color: colors.slate}}>Seaside Loft · Oct 14–18</div>
      <div style={{...fadeUp(frame, start + 24, 16), marginTop: 30, width: SCREEN_W - 56, borderRadius: 18, background: '#fff', border: `1px solid ${colors.line}`, padding: '18px 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12}}>
        {[
          ['Confirmation', 'CS-2048'],
          ['Guests', '2'],
          ['Paid to', BRAND.name],
        ].map(([k, v]) => (
          <div key={k} style={{display: 'flex', justifyContent: 'space-between', fontSize: 16}}>
            <span style={{color: colors.slate}}>{k}</span>
            <span style={{color: colors.ink, fontWeight: 700}}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{...fadeUp(frame, start + 32, 16), marginTop: 22, width: SCREEN_W - 56, padding: '16px 0', borderRadius: 16, border: `2px solid ${BRAND.color}`, color: BRAND.color, textAlign: 'center', fontWeight: 700, fontSize: 18, boxSizing: 'border-box'}}>
        Add to calendar
      </div>
      <div style={{...fadeUp(frame, start + 36, 16), marginTop: 16, fontSize: 14, color: colors.muted}}>Receipt sent to your email</div>
    </div>
  );
};

const Photo: React.FC<{variant: 'exterior' | 'bedroom' | 'sunset'}> = ({variant}) => (
  <svg width={SCREEN_W} height={300} viewBox="0 0 364 300" preserveAspectRatio="xMidYMid slice">
    {variant === 'exterior' && (
      <>
        <rect width="364" height="300" fill="#BFE6EE" />
        <circle cx="296" cy="64" r="30" fill="#FFE2A8" />
        <rect y="186" width="364" height="40" fill="#5EC1C9" />
        <rect y="222" width="364" height="78" fill="#F3DEC0" />
        <rect x="86" y="120" width="170" height="110" rx="6" fill="#FFFFFF" />
        <path d="M70 128 L171 70 L272 128 Z" fill={BRAND.color} />
        <rect x="112" y="150" width="40" height="34" rx="4" fill="#9FD3DB" />
        <rect x="190" y="150" width="40" height="34" rx="4" fill="#9FD3DB" />
        <rect x="156" y="178" width="30" height="52" rx="4" fill={colors.coral} />
        <path d="M300 230 C296 190 300 170 312 150" stroke="#8A6A4F" strokeWidth="7" fill="none" />
        <path d="M312 150 C290 140 278 146 270 156 M312 150 C330 136 344 140 352 150 M312 150 C312 130 300 122 290 122" stroke="#4FA77D" strokeWidth="9" fill="none" strokeLinecap="round" />
      </>
    )}
    {variant === 'bedroom' && (
      <>
        <rect width="364" height="300" fill="#F6EEE4" />
        <rect x="200" y="40" width="120" height="120" rx="8" fill="#BFE6EE" />
        <rect y="190" width="364" height="110" fill="#E7D7C3" />
        <rect x="40" y="150" width="210" height="80" rx="14" fill="#FFFFFF" />
        <rect x="40" y="120" width="210" height="40" rx="14" fill="#D4E9EA" />
        <rect x="58" y="128" width="70" height="28" rx="10" fill="#fff" />
        <rect x="150" y="128" width="70" height="28" rx="10" fill="#fff" />
        <rect x="40" y="176" width="210" height="34" rx="8" fill={BRAND.color} opacity="0.85" />
        <rect x="282" y="190" width="10" height="50" fill="#8A6A4F" />
        <path d="M262 190 L312 190 L300 160 L274 160 Z" fill="#FFD58C" />
      </>
    )}
    {variant === 'sunset' && (
      <>
        <rect width="364" height="300" fill="#FFC9A8" />
        <rect y="0" width="364" height="120" fill="#FFB38E" />
        <circle cx="182" cy="170" r="56" fill="#FFE2A8" />
        <rect y="168" width="364" height="132" fill="#4FB3BF" />
        <rect y="200" width="364" height="8" fill="#7FCFD8" opacity="0.6" />
        <rect y="236" width="364" height="64" fill="#2F8E9A" />
        <rect x="0" y="246" width="364" height="10" fill="#fff" opacity="0.85" />
        <rect x="30" y="256" width="10" height="44" fill="#fff" />
        <rect x="120" y="256" width="10" height="44" fill="#fff" />
        <rect x="210" y="256" width="10" height="44" fill="#fff" />
        <rect x="300" y="256" width="10" height="44" fill="#fff" />
      </>
    )}
  </svg>
);

const Receipt: React.FC<{frame: number}> = ({frame}) => {
  const p = settle(frame, T.receipt, 26);
  const zero = tween(frame, T.receipt + 18, T.receipt + 40, 126, 0);
  return (
    <div style={{position: 'absolute', left: 1064, top: 590, opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
      <Card style={{width: 560, padding: '26px 30px', boxSizing: 'border-box', fontFamily: fonts.body}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 700, color: colors.slate, textTransform: 'uppercase', letterSpacing: '0.06em'}}>
          Direct booking · {BRAND.name}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 18, fontSize: 22, color: colors.ink}}>
          <span>4 nights × $210</span>
          <span style={{fontWeight: 700}}>$840</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 22, color: colors.ink}}>
          <span>Platform commission</span>
          <span style={{fontWeight: 700, color: colors.tealDark}}>${Math.round(zero)}</span>
        </div>
        <div style={{height: 1, background: colors.line, margin: '18px 0'}} />
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 26, fontWeight: 800, color: colors.ink}}>
          <span style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <span style={{width: 34, height: 34, borderRadius: 17, background: colors.tealTint, color: colors.teal, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
              <Check size={20} strokeWidth={3.2} />
            </span>
            You keep
          </span>
          <span style={{color: colors.teal}}>$840</span>
        </div>
      </Card>
    </div>
  );
};
