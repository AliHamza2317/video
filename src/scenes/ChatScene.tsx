import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {Check, CheckCheck, Languages, Moon, Sparkles, Zap} from 'lucide-react';
import {easeOut, enterScale, tween} from '../anim';
import {Backdrop} from '../components/Backdrop';
import {Headline} from '../components/Headline';
import {findScreen} from '../components/ScreenStage';
import {ChannelTag} from '../designs/AppShell';
import {CHAT_CARDS, ChatCard, HEADLINES, sec} from '../script';
import {REEL, useIsPortrait} from '../layout';
import {useSceneFrame} from '../sceneTime';
import {colors, fonts} from '../theme';

// Guest messaging: the real Conversations screen sits softly in the frame
// while three late-night guest messages, in three languages, get instant AI
// replies in the app's own bubble style.

const FRAME = {x: 680, y: 118, w: 1180, h: 740};

// Reel: the frame sits under the headline and the cards stack top to bottom,
// clear of the caption bar and Instagram's right-hand buttons.
const FRAME_PORTRAIT = {x: 40, y: 710, w: 1000, h: 680};
const CARDS_PORTRAIT: Array<[number, number]> = [
  [60, 682],
  [120, 926],
  [60, 1144],
];

export const ChatScene: React.FC = () => {
  const frame = useSceneFrame();
  const screen = findScreen('guest-messaging');
  const push = tween(frame, -4, sec(7.6), 1, 1.05, (x) => x);
  const portrait = useIsPortrait();
  const box = portrait ? FRAME_PORTRAIT : FRAME;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop grid drift={frame * 0.25} />
      {portrait ? (
        <Headline spec={HEADLINES.ai} size={88} style={{position: 'absolute', left: REEL.headlineLeft, top: REEL.headlineTop, width: 940}} />
      ) : (
        <Headline spec={HEADLINES.ai} size={76} style={{position: 'absolute', left: 100, top: 270, width: 550}} />
      )}

      <div
        style={{
          position: 'absolute',
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          borderRadius: 24,
          overflow: 'hidden',
          background: colors.cream,
          boxShadow: '0 30px 70px rgba(60,40,20,0.14), 0 6px 18px rgba(60,40,20,0.07)',
          outline: `1px solid ${colors.line}`,
          ...enterScale(frame, -4, 0.96),
        }}
      >
        {screen ? (
          <Img
            src={screen.src}
            style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${push})`, filter: 'blur(2.5px)', opacity: 0.85}}
          />
        ) : null}
        <AbsoluteFill style={{background: 'linear-gradient(135deg, rgba(255,248,239,0.55) 0%, rgba(253,234,227,0.62) 100%)'}} />
      </div>

      {CHAT_CARDS.map((card, i) => (
        <Card
          key={card.name}
          card={portrait ? {...card, x: CARDS_PORTRAIT[i][0], y: CARDS_PORTRAIT[i][1]} : card}
          frame={frame}
          index={i}
          compact={portrait}
        />
      ))}

      <AiPill frame={frame} at={portrait ? {x: 560, y: 580} : {x: 1452, y: 784}} />
    </AbsoluteFill>
  );
};

const Card: React.FC<{card: ChatCard; frame: number; index: number; compact: boolean}> = ({card, frame, index, compact}) => {
  const at = sec(card.at) - (index === 0 ? 4 : 0);
  if (frame < at) return null;
  const p = tween(frame, at, at + 11, 0, 1, easeOut);
  const replyAt = sec(card.replyAt);
  const typing = frame >= at + 6 && frame < replyAt;
  const reply = frame >= replyAt;
  const r = tween(frame, replyAt, replyAt + 10, 0, 1, easeOut);
  const float = Math.sin((frame + index * 20) / 28) * 4;

  return (
    <div
      style={{
        position: 'absolute',
        left: card.x,
        top: card.y + float,
        width: compact ? 900 : 590,
        boxSizing: 'border-box',
        padding: compact ? '16px 20px 16px' : '18px 20px 16px',
        borderRadius: 22,
        background: '#fff',
        border: '1px solid #EFE7DF',
        boxShadow: '0 28px 60px rgba(60,40,20,0.18), 0 6px 16px rgba(60,40,20,0.08)',
        fontFamily: fonts.body,
        color: colors.ink,
        opacity: p,
        transform: `translateY(${(1 - p) * 26}px) scale(${0.96 + 0.04 * p})`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <div style={{width: 46, height: 46, borderRadius: 23, background: '#EDEDF0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600}}>{card.initials}</div>
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <span style={{fontSize: compact ? 20 : 18, fontWeight: 600}}>{card.name}</span>
            <ChannelTag channel={card.channel} size={13} />
          </div>
          <div style={{fontSize: compact ? 15 : 13.5, color: '#9B97A6', marginTop: 2}}>{card.property}</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5}}>
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 14, fontWeight: 600, color: colors.navyLight}}>
            <Moon size={14} strokeWidth={2.2} /> {card.time}
          </span>
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999, background: colors.navy, color: '#fff', fontSize: 12.5, fontWeight: 600}}>
            <Languages size={13} /> {card.language}
          </span>
        </div>
      </div>

      <div style={{marginTop: compact ? 12 : 14, display: 'flex'}}>
        <div style={{padding: '12px 16px', borderRadius: '6px 18px 18px 18px', background: '#F1F1F3', fontSize: compact ? 20 : 17.5, lineHeight: 1.4, maxWidth: compact ? 640 : 440}}>{card.question}</div>
      </div>

      <div style={{marginTop: compact ? 10 : 12, display: 'flex', justifyContent: 'flex-end', minHeight: 50}}>
        {typing ? (
          <div style={{display: 'flex', gap: 6, padding: '16px 18px', borderRadius: '18px 18px 6px 18px', background: colors.peach}}>
            {[0, 1, 2].map((d) => (
              <span key={d} style={{width: 9, height: 9, borderRadius: 5, background: colors.orange, opacity: 0.35 + 0.65 * Math.max(0, Math.sin(frame / 2.2 - d))}} />
            ))}
          </div>
        ) : null}
        {reply ? (
          <div style={{maxWidth: compact ? 760 : 470, opacity: r, transform: `translateY(${(1 - r) * 10}px)`}}>
            <div style={{padding: '12px 16px 13px', borderRadius: '18px 18px 6px 18px', background: colors.peach}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 7, border: '1px solid #CFE3B8', background: '#F2F8EA', color: '#5B7F2E', fontSize: 12.5, fontWeight: 600}}>
                <Zap size={12} strokeWidth={2.4} /> AI Generated
              </span>
              {compact ? (
                <span style={{marginLeft: 10, fontSize: 14, color: '#9B97A6', display: 'inline-flex', alignItems: 'center', gap: 5}}>
                  Replied in 2s <CheckCheck size={15} color={colors.orange} />
                </span>
              ) : null}
              <div style={{marginTop: 8, fontSize: compact ? 20 : 17.5, lineHeight: 1.4}}>{card.answer}</div>
            </div>
            {compact ? null : (
              <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 13, color: '#9B97A6'}}>
                Replied in 2s <CheckCheck size={15} color={colors.orange} />
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const AiPill: React.FC<{frame: number; at: {x: number; y: number}}> = ({frame, at: pos}) => {
  const at = sec(5.1);
  if (frame < at) return null;
  const p = tween(frame, at, at + 11, 0, 1, easeOut);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 6);
  return (
    <div
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 20px',
        borderRadius: 999,
        background: colors.navy,
        color: '#fff',
        fontFamily: fonts.body,
        fontSize: 18,
        fontWeight: 600,
        boxShadow: '0 16px 34px rgba(28,27,41,0.3)',
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
      }}
    >
      <span style={{width: 10, height: 10, borderRadius: 5, background: '#7BD389', boxShadow: `0 0 0 ${3 + pulse * 4}px rgba(123,211,137,${0.35 - pulse * 0.2})`}} />
      <Sparkles size={18} color={colors.orange} />
      AI replies on, 24/7
      <Check size={18} strokeWidth={3} color="#7BD389" />
    </div>
  );
};
