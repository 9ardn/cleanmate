import type { RoomState } from '@/types/app';
import type { CharacterPose } from '@/lib/constants';
import { PixelSprite, type PixelLegend } from './PixelSprite';

interface CharacterProps {
  state?: RoomState;
  pose?: CharacterPose;
}

const SPRITE = `....bbbbbbbb....
...bbbBBBBBb....
..bppbBBBBBb....
..bbbbBBBBBBb...
..hhhhhhhhhhhh..
..hHHHHHHHHHhh..
.hsssssssssssh..
.hsssssssssssh..
.hssEEsssEEssh..
.hssEEsssEEssh..
.hssccsssccssh..
.hsssssMMsssh..
.hsssMMMMMsssh..
..hhsssssssh....
....TttTttT.....
.gggttttttggg...
.gggttAAttggg...
..ggtAAAAtgg....
..ggttttttgg....
..ggttttttgg....
..gddddddddg....
..ddddddddddd...
..ddd....ddd....
..ddd....ddd....
..ddd....ddd....
..ddd....ddd....
.OOOO....OOOO...
.oooo....oooo...`;

const BASE_LEGEND: PixelLegend = {
  '.': null,
  k: '#1F2840',
  s: '#F2D2B8',
  S: '#D9B095',
  h: '#1F2840',
  H: '#3A4258',
  b: '#5B8DB8',
  B: '#3F6F94',
  p: '#B886D9',
  t: '#F4F7FB',
  T: '#D6DDE8',
  g: '#5B8DB8',
  G: '#3F6F94',
  a: '#B886D9',
  d: '#1F2840',
  D: '#0F1828',
  o: '#1F2840',
  O: '#1F2840',
  e: '#1F2840',
  E: '#1F2840',
  m: '#D9627A',
  M: '#D9627A',
  c: '#E8895C',
  w: '#FFFFFF',
  r: '#D9627A',
  q: '#87C4DC',
  A: '#B886D9',
};

const EXPRESSION: Record<RoomState, 'happy' | 'neutral' | 'sad' | 'cry'> = {
  clean: 'happy',
  ok: 'neutral',
  dirty: 'sad',
  critical: 'cry',
};

function applyExpression(sprite: string, expr: 'happy' | 'neutral' | 'sad' | 'cry') {
  if (expr === 'happy') {
    return sprite
      .replace(/EE/g, 'ee')
      .replace(/MMMMM/g, 'mmmmm')
      .replace(/MM/g, 'mm');
  }
  if (expr === 'neutral') {
    return sprite
      .replace(/EE/g, 'ee')
      .replace(/MMMMM/g, '..mm.')
      .replace(/MM/g, 'mm');
  }
  if (expr === 'sad') {
    return sprite
      .replace(/EE/g, 'kk')
      .replace(/MMMMM/g, 'mm.mm')
      .replace(/MM/g, 'mm');
  }
  return sprite
    .replace(/EE/g, 'qq')
    .replace(/MMMMM/g, '.mmm.')
    .replace(/MM/g, 'mm');
}

export function Character({ state = 'clean', pose: _pose = 'idle' }: CharacterProps) {
  const expr = EXPRESSION[state];
  const processed = applyExpression(SPRITE, expr);

  return (
    <div
      style={{
        animation: 'float-y 3s ease-in-out infinite',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <PixelSprite grid={processed} legend={BASE_LEGEND} scale={3.5} />
      <div
        style={{
          width: 50,
          height: 6,
          background: 'rgba(0,0,0,0.25)',
          borderRadius: '50%',
          marginTop: 2,
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
}
