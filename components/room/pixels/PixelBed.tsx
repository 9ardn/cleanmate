import type { RoomState } from '@/types/app';
import { PixelSprite, type PixelLegend } from '../PixelSprite';

interface PixelBedProps { state: RoomState }

const LEGEND: PixelLegend = {
  '.': null,
  w: '#7A5C40',
  W: '#5B4530',
  s: '#F4F7FB',
  S: '#D6DDE8',
  p: '#E8895C',
  P: '#B96B45',
  b: '#5B8DB8',
  B: '#3F6F94',
};

const MESSY = `....................
.WWWWWWWWWWWWWWWWWW.
.WppPPpppPbbbbbbbWW.
.WppppPPpbbbBbbbBWW.
.WSSSSSSSbbbbBbbbWW.
.WsssSSSSbBbbbbBbWW.
.WssssssssbbbbbbWW..
.WWWWWWWWWWWWWWWWW..
.W................W.`;

const TIDY = `....................
.WWWWWWWWWWWWWWWWWW.
.WppPPppppppppppppW.
.WppppPPpppppppppPW.
.WSSSSSSSbbbbbbbbBW.
.WssssSSSbbbbbbBBBW.
.WssssssssbbbbBBBBW.
.WWWWWWWWWWWWWWWWWW.
.W................W.`;

export function PixelBed({ state }: PixelBedProps) {
  const messy = state === 'dirty' || state === 'critical';
  return <PixelSprite grid={messy ? MESSY : TIDY} legend={LEGEND} scale={3} />;
}
