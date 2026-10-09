import React from 'react';
import type {LucideIcon} from 'lucide-react';
import {Car, Check, Lock, RotateCw, Star, Waves, Wifi} from 'lucide-react';
import {staticFile} from 'remotion';
import {easeOut, tween} from '../anim';
import {Logo} from '../components/Logo';
import {LogoMark} from '../components/LogoMark';
import {sec} from '../script';
import {useSceneFrame} from '../sceneTime';
import {colors, fonts} from '../theme';

// A host's own branded booking site, powered by Hostastic. Uses the Sunset
// Villa Malibu photo from the supplied login screen and the booking from the
// supplied Conversations screen (David Statham, 14 to 17 Mar 2026, $1,500).
// Layout is absolute so rings and clicks in src/script.ts can target it.

export const SITE_W = 1600;
export const SITE_H = 1037;

/** Scene times (s) for the booking interaction. */
export const SITE_TIMES = {click: 2.3, confirmed: 2.5, toast: 2.7};

const PHOTO = staticFile('photos/sunset-villa-login.jpg');
const PHOTO_W = 2000;
const PHOTO_H = 1296;

/** A crop of the villa photo (source pixel box) filling a box. */
const Photo: React.FC<{src: [number, number, number, number]; x: number; y: number; w: number; h: number; radius?: number}> = ({
  src: [sx, sy, sw, sh],
  x,
  y,
  w,
  h,
  radius = 16,
}) => {
  const scale = Math.max(w / sw, h / sh);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: radius, overflow: 'hidden'}}>
      <div
        style={{
          width: PHOTO_W * scale,
          height: PHOTO_H * scale,
          backgroundImage: `url(${PHOTO})`,
          backgroundSize: '100% 100%',
          transform: `translate(${-sx * scale}px, ${-sy * scale}px)`,
          filter: 'brightness(1.12) saturate(1.05)',
        }}
      />
    </div>
  );
};

const AMENITIES: Array<{icon: LucideIcon; label: string}> = [
  {icon: Waves, label: 'Sea view'},
  {icon: Waves, label: 'Infinity pool'},
  {icon: Wifi, label: 'Fast Wi-Fi'},
  {icon: Car, label: 'Free parking'},
];

export const BookingSiteDesign: React.FC = () => {
  const frame = useSceneFrame();
  const confirmed = frame >= sec(SITE_TIMES.confirmed);
  const pressed = frame >= sec(SITE_TIMES.click) && frame < sec(SITE_TIMES.click) + 5;

  return (
    <div style={{position: 'relative', width: SITE_W, height: SITE_H, background: '#fff', fontFamily: fonts.body, color: colors.ink, overflow: 'hidden'}}>
      {/* Browser bar with the host's own domain */}
      <div style={{position: 'absolute', left: 0, top: 0, width: SITE_W, height: 56, background: '#F6F2EE', borderBottom: '1px solid #ECE3D9'}}>
        <div style={{position: 'absolute', left: 22, top: 22, display: 'flex', gap: 8}}>
          {['#F2A49C', '#F4CF7C', '#93D9B3'].map((c) => (
            <span key={c} style={{width: 12, height: 12, borderRadius: 6, background: c}} />
          ))}
        </div>
        <div style={{position: 'absolute', left: 520, top: 11, width: 560, height: 34, borderRadius: 17, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15, fontWeight: 500, color: colors.navy}}>
          <Lock size={14} strokeWidth={2.4} color="#3E8E3A" /> sunsetvillamalibu.com
        </div>
        <RotateCw size={16} color="#9B97A6" style={{position: 'absolute', left: 1100, top: 20}} />
      </div>

      {/* Site header: the host's brand */}
      <div style={{position: 'absolute', left: 0, top: 56, width: SITE_W, height: 72, borderBottom: '1px solid #F1ECE6', display: 'flex', alignItems: 'center', padding: '0 40px', boxSizing: 'border-box'}}>
        <div style={{fontFamily: fonts.display, fontSize: 30, lineHeight: 1}}>Sunset Villa</div>
        <div style={{marginLeft: 12, fontSize: 12, fontWeight: 600, letterSpacing: '0.28em', color: colors.orange}}>MALIBU</div>
        <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 32, fontSize: 15.5, color: colors.slate}}>
          <span>Gallery</span>
          <span>Amenities</span>
          <span>Location</span>
          <span>Reviews</span>
          <span style={{padding: '10px 18px', borderRadius: 999, background: colors.navy, color: '#fff', fontWeight: 600}}>Book your stay</span>
        </div>
      </div>

      {/* Gallery */}
      <Photo src={[1290, 590, 710, 362]} x={40} y={150} w={660} h={410} radius={20} />
      <Photo src={[1290, 250, 400, 310]} x={712} y={150} w={288} h={199} />
      <Photo src={[360, 640, 356, 260]} x={712} y={361} w={288} h={199} />

      {/* Listing details */}
      <div style={{position: 'absolute', left: 40, top: 588, width: 960}}>
        <div style={{fontFamily: fonts.display, fontSize: 42, lineHeight: 1.05}}>Sunset Villa Malibu</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, fontSize: 17, color: colors.slate}}>
          Malibu, California · 3 bedrooms · Sleeps 6 ·
          <Star size={16} fill={colors.orange} color={colors.orange} />
          <span style={{color: colors.ink, fontWeight: 600}}>4.9</span> (128 reviews)
        </div>
        <div style={{display: 'flex', gap: 10, marginTop: 20}}>
          {AMENITIES.map(({icon: Icon, label}) => (
            <span key={label} style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 12, background: colors.peach, fontSize: 15.5, fontWeight: 500}}>
              <Icon size={17} color={colors.orangeDeep} /> {label}
            </span>
          ))}
        </div>
        <div style={{marginTop: 22, fontSize: 17, lineHeight: 1.6, color: colors.slate, maxWidth: 900}}>
          Wake up to the Pacific from every room. A private infinity pool, a sunset terrace and direct beach access,
          minutes from Malibu Pier.
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 22}}>
          <div style={{width: 44, height: 44, borderRadius: 12, background: colors.navy, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600}}>OS</div>
          <div>
            <div style={{fontSize: 16, fontWeight: 600}}>Hosted by Okasha Sipra</div>
            <div style={{fontSize: 14, color: '#9B97A6'}}>Replies within an hour</div>
          </div>
        </div>
      </div>

      {/* Booking widget */}
      <div style={{position: 'absolute', left: 1040, top: 150, width: 520, height: 540, boxSizing: 'border-box', padding: 26, borderRadius: 22, background: '#fff', border: '1px solid #EFE7DF', boxShadow: '0 24px 60px rgba(60,40,20,0.12)'}}>
        <div style={{display: 'flex', alignItems: 'baseline', height: 36}}>
          <span style={{fontSize: 32, fontWeight: 700}}>$500</span>
          <span style={{fontSize: 17, color: colors.slate, marginLeft: 6}}>/ night</span>
          <span style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 15, fontWeight: 600}}>
            <Star size={15} fill={colors.orange} color={colors.orange} /> 4.9
          </span>
        </div>
        <div style={{marginTop: 20, height: 120, borderRadius: 14, border: '1px solid #E6DDD3', overflow: 'hidden'}}>
          <div style={{display: 'flex', height: 60, borderBottom: '1px solid #E6DDD3'}}>
            <Field label="CHECK-IN" value="14 Mar 2026" />
            <div style={{width: 1, background: '#E6DDD3'}} />
            <Field label="CHECKOUT" value="17 Mar 2026" />
          </div>
          <div style={{display: 'flex', height: 60}}>
            <Field label="GUESTS" value="3 guests" />
          </div>
        </div>
        <div
          style={{
            marginTop: 20,
            height: 56,
            borderRadius: 14,
            background: confirmed ? '#3E8E3A' : `linear-gradient(135deg, ${colors.orange} 0%, ${colors.orangeDeep} 100%)`,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontSize: 19,
            fontWeight: 700,
            transform: `scale(${pressed ? 0.97 : 1})`,
            boxShadow: '0 12px 24px rgba(236,117,54,0.28)',
          }}
        >
          {confirmed ? (
            <>
              <Check size={22} strokeWidth={3} /> Booking confirmed
            </>
          ) : (
            'Book now'
          )}
        </div>
        <div style={{marginTop: 12, textAlign: 'center', fontSize: 14, color: '#9B97A6', height: 18}}>You won&apos;t be charged yet</div>
        <Line label="$500 × 3 nights" value="$1,500.00" top={28} />
        <Line label="Booking commission" value="$0.00" top={14} accent />
        <div style={{height: 1, background: '#EFE7DF', marginTop: 16}} />
        <Line label="Total" value="$1,500.00" top={14} bold />
        <div style={{marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 13.5, color: '#9B97A6'}}>
          <Lock size={13} /> Secure booking · Powered by <Logo width={98} />
        </div>
      </div>

      <HostToast frame={frame} />
    </div>
  );
};

const Field: React.FC<{label: string; value: string}> = ({label, value}) => (
  <div style={{flex: 1, padding: '10px 16px'}}>
    <div style={{fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', color: colors.slate}}>{label}</div>
    <div style={{fontSize: 17, fontWeight: 500, marginTop: 4}}>{value}</div>
  </div>
);

const Line: React.FC<{label: string; value: string; top: number; accent?: boolean; bold?: boolean}> = ({label, value, top, accent, bold}) => (
  <div style={{display: 'flex', marginTop: top, fontSize: bold ? 18 : 16.5, fontWeight: bold ? 700 : 400, color: accent ? '#3E8E3A' : colors.ink}}>
    <span style={{textDecoration: !accent && !bold ? 'underline' : 'none', textDecorationColor: '#D9D2CA'}}>{label}</span>
    <span style={{marginLeft: 'auto', fontWeight: bold || accent ? 700 : 500}}>{value}</span>
  </div>
);

/** The host's Hostastic notification for the new direct booking. */
const HostToast: React.FC<{frame: number}> = ({frame}) => {
  const at = sec(SITE_TIMES.toast);
  if (frame < at - 1) return null;
  const p = tween(frame, at, at + 11, 0, 1, easeOut);
  return (
    <div
      style={{
        position: 'absolute',
        left: 1040,
        top: 66,
        width: 520,
        boxSizing: 'border-box',
        padding: '14px 18px',
        borderRadius: 18,
        background: '#fff',
        border: '1px solid #EFE7DF',
        boxShadow: '0 22px 50px rgba(28,27,41,0.22)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity: p,
        transform: `translateY(${(1 - p) * -24}px)`,
      }}
    >
      <div style={{width: 48, height: 48, borderRadius: 14, background: colors.peach, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <LogoMark size={30} />
      </div>
      <div style={{flex: 1}}>
        <div style={{fontSize: 16.5, fontWeight: 700}}>New direct booking</div>
        <div style={{fontSize: 14, color: colors.slate, marginTop: 2}}>David Statham · 14 to 17 Mar · $1,500.00</div>
      </div>
      <div style={{padding: '6px 12px', borderRadius: 999, background: colors.peach, color: colors.orangeDeep, fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap'}}>0% commission</div>
    </div>
  );
};
