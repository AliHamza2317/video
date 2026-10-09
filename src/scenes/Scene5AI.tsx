import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Sparkles} from 'lucide-react';
import {easeInOut, pop, settle, tween} from '../anim';
import {Backdrop} from '../components/Backdrop';
import {Headline} from '../components/Headline';
import {HostCharacter} from '../components/HostCharacter';
import {Avatar, Card} from '../components/ui';
import {useSceneFrame} from '../sceneTime';
import {colors, fonts} from '../theme';

type Msg =
  | {from: 'guest'; name: string; initials: string; color: string; lang: string; time: string; text: string; at: number}
  | {from: 'ai'; text: string; meta: string; at: number};

// Late-night questions in three languages, each answered instantly.
const THREAD: Msg[] = [
  {from: 'guest', name: 'Emma', initials: 'EW', color: '#7A8FE0', lang: 'EN', time: '11:42 PM', text: 'Hi! What time can we check in on Friday?', at: 22},
  {from: 'ai', text: 'Hi Emma! Check-in is from 3:00 PM. Your door code arrives by text that morning.', meta: 'Replied in 2s', at: 46},
  {from: 'guest', name: 'Lucía', initials: 'LM', color: colors.coral, lang: 'ES', time: '1:15 AM', text: '¿Hay aparcamiento cerca del apartamento?', at: 96},
  {from: 'ai', text: '¡Sí! Tienes una plaza gratuita justo al lado de la entrada.', meta: 'Spanish · 2s', at: 118},
  {from: 'guest', name: 'Julien', initials: 'JD', color: '#5BB98B', lang: 'FR', time: '3:07 AM', text: 'Le Wi-Fi est-il inclus ?', at: 168},
  {from: 'ai', text: 'Oui ! Le Wi-Fi est inclus — le code est sur le frigo.', meta: 'French · 2s', at: 188},
];

const CHAT = {x: 760, y: 112, w: 760, h: 770};
const PULLBACK = 262;

export const Scene5AI: React.FC = () => {
  const frame = useSceneFrame();
  const chatIn = settle(frame, 2, 26);

  // Pull back: the chat shrinks to the side and the relaxed host is revealed.
  const pull = tween(frame, PULLBACK, PULLBACK + 44, 0, 1, easeInOut);
  const chatScale = interpolate(pull, [0, 1], [1, 0.56]);
  const chatX = interpolate(pull, [0, 1], [0, 400]);
  const chatY = interpolate(pull, [0, 1], [0, -60]);
  const hostScale = interpolate(pull, [0, 1], [1.35, 1]);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop tint="#D7EEF6" drift={frame * 0.2} />

      {/* Relaxed host, revealed by the pull-back */}
      <AbsoluteFill style={{opacity: pull, transform: `scale(${hostScale})`, transformOrigin: '960px 620px'}}>
        <HostCharacter
          pose="relaxed"
          frame={frame}
          width={600}
          shirt={colors.teal}
          chair={colors.ink}
          lidLogo
          style={{position: 'absolute', left: 650, top: 300}}
        />
      </AbsoluteFill>

      <Headline
        chip={{icon: Sparkles, label: 'AI Guest Messaging'}}
        lines={['Instant answers.', 'Any language.', 'Any hour.']}
        highlight={[0]}
        size={68}
        start={8}
        style={{position: 'absolute', left: 116, top: 250, width: 620}}
      />

      <div
        style={{
          position: 'absolute',
          left: CHAT.x,
          top: CHAT.y,
          transformOrigin: 'center center',
          transform: `translate(${chatX}px, ${chatY + (1 - chatIn) * 60}px) scale(${chatScale})`,
          opacity: chatIn,
        }}
      >
        <ChatPanel frame={frame} />
      </div>
    </AbsoluteFill>
  );
};

const ChatPanel: React.FC<{frame: number}> = ({frame}) => {
  // Scroll the thread up as new messages arrive.
  const scroll = tween(frame, 186, 204, 0, 1, easeInOut) * 120;
  const live = 0.5 + 0.5 * Math.sin(frame / 6);

  return (
    <Card style={{width: CHAT.w, height: CHAT.h, overflow: 'hidden', display: 'flex', flexDirection: 'column', fontFamily: fonts.body}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px', borderBottom: `1px solid ${colors.line}`}}>
        <div>
          <div style={{fontSize: 24, fontWeight: 700, color: colors.ink}}>Guest inbox</div>
          <div style={{fontSize: 15, color: colors.muted, marginTop: 3}}>All properties · 3 conversations</div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 999, background: colors.tealTint, color: colors.tealDark, fontWeight: 700, fontSize: 16}}>
          <span style={{width: 10, height: 10, borderRadius: 5, background: colors.teal, boxShadow: `0 0 0 ${3 + live * 4}px rgba(18,165,160,${0.25 - live * 0.15})`}} />
          AI replies on
        </div>
      </div>

      <div style={{flex: 1, position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 18, transform: `translateY(${-scroll}px)`}}>
          {THREAD.map((m, i) => (
            <Bubble key={i} msg={m} frame={frame} />
          ))}
        </div>
      </div>

      <div style={{padding: '16px 24px', borderTop: `1px solid ${colors.line}`, display: 'flex', alignItems: 'center', gap: 12, color: colors.muted, fontSize: 17}}>
        <Sparkles size={20} color={colors.teal} />
        AI is handling routine questions — you&apos;re free to step away.
      </div>
    </Card>
  );
};

const Bubble: React.FC<{msg: Msg; frame: number}> = ({msg, frame}) => {
  const typingFrom = msg.from === 'ai' ? msg.at - 12 : msg.at;
  if (frame < typingFrom) return null;

  if (msg.from === 'ai' && frame < msg.at) {
    return (
      <div style={{alignSelf: 'flex-end', display: 'flex', gap: 6, padding: '16px 20px', borderRadius: 20, background: colors.tealTint}}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{width: 9, height: 9, borderRadius: 5, background: colors.teal, opacity: 0.4 + 0.6 * Math.max(0, Math.sin(frame / 2 - i))}} />
        ))}
      </div>
    );
  }

  const p = pop(frame, msg.at, {damping: 14, stiffness: 200});
  const style: React.CSSProperties = {opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 20}px) scale(${0.94 + p * 0.06})`};

  if (msg.from === 'guest') {
    return (
      <div style={{...style, display: 'flex', gap: 12, alignItems: 'flex-start', transformOrigin: 'left bottom'}}>
        <Avatar initials={msg.initials} color={msg.color} size={44} />
        <div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: colors.muted, marginBottom: 6}}>
            <span style={{fontWeight: 700, color: colors.ink}}>{msg.name}</span>
            <span style={{padding: '2px 8px', borderRadius: 6, background: '#EEF2F3', fontWeight: 700, fontSize: 13, color: colors.slate}}>{msg.lang}</span>
            {msg.time}
          </div>
          <div style={{padding: '14px 18px', borderRadius: '6px 20px 20px 20px', background: '#F1F4F5', fontSize: 21, color: colors.ink, maxWidth: 470, lineHeight: 1.35}}>
            {msg.text}
          </div>
        </div>
      </div>
    );
  }

  const pulse = ((frame - msg.at) % 36) / 36;
  return (
    <div style={{...style, alignSelf: 'flex-end', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', transformOrigin: 'right bottom'}}>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 12}}>
        <div style={{padding: '14px 18px', borderRadius: '20px 20px 6px 20px', background: colors.teal, color: '#fff', fontSize: 21, maxWidth: 470, lineHeight: 1.35}}>
          {msg.text}
        </div>
        <div style={{position: 'relative', width: 40, height: 40, flexShrink: 0}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 20, border: `2px solid ${colors.teal}`, transform: `scale(${1 + pulse * 0.7})`, opacity: 1 - pulse}} />
          <div style={{position: 'absolute', inset: 0, borderRadius: 20, background: colors.tealTint, color: colors.teal, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Sparkles size={20} strokeWidth={2.4} />
          </div>
        </div>
      </div>
      <div style={{marginTop: 6, marginRight: 52, fontSize: 14, fontWeight: 600, color: colors.tealDark}}>AI · {msg.meta}</div>
    </div>
  );
};
