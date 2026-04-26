import type { RoomState } from '@/types/app';
import { PixelSprite, type PixelLegend } from '../PixelSprite';

interface PixelDeskProps { state: RoomState }

const GRID = `...LLLLLLLL....
...Llllllll....
...Llllllll...mm
...Llllllll...mm
...Llllllll...mM
.LLLLLLLLLLL..MM
.WWWWWWWWWWW....
.W.WWWWWWW.W....
.W.W.....W.W....
.W.W.....W.W....
.W.W.....W.W....`;

export function PixelDesk({ state }: PixelDeskProps) {
  const dark = state === 'critical';
  const legend: PixelLegend = {
    '.': null,
    w: '#7A5C40',
    W: '#5B4530',
    l: dark ? '#28324A' : '#87C4DC',
    L: '#1F2840',
    m: '#E8895C',
    M: '#B96B45',
  };
  return <PixelSprite grid={GRID} legend={legend} scale={3} />;
}
