import type { RoomState } from '@/types/app';
import { PixelSprite, type PixelLegend } from '../PixelSprite';

interface PixelPlantProps { state: RoomState }

const ALIVE = `....gG....
...ggGG...
..gggGGG..
.ggGgggGG.
..gggGgg..
.gGgggGGg.
....b.....
.PPPPPPPP.
.pppppppp.
.pppppppp.
.PPPPPPPP.`;

const DEAD = `...b.b....
...bbb....
....b.....
....b.....
....b.....
.PPPPPPPP.
.pppppppp.
.pppppppp.
.PPPPPPPP.`;

export function PixelPlant({ state }: PixelPlantProps) {
  const dead = state === 'critical';
  const wilted = state === 'dirty';
  const legend: PixelLegend = {
    '.': null,
    p: '#D9627A',
    P: '#A8485E',
    g: wilted ? '#7A8A5C' : '#5B8DB8',
    G: wilted ? '#5C6B40' : '#3F6F94',
    b: '#7A5C40',
  };
  return <PixelSprite grid={dead ? DEAD : ALIVE} legend={legend} scale={3} />;
}
