import type { RoomState } from '@/types/app';
import { PixelSprite, type PixelLegend } from '../PixelSprite';

interface PixelWindowProps { state: RoomState }

const SUNNY = `fffffffffffff
fFFFFFFFFFFFFf
fFssGGGGGGGGFf
fFsssGGGGGGGFf
fFsssGGGgggGFf
fFGGGGGGgggGFf
fFGGGGGGgggGFf
fFGGGGGGGGGGFf
fFFFFFFFFFFFFf
fffffffffffff`;

const PLAIN = `fffffffffffff
fFFFFFFFFFFFFf
fFGGGGGGGGGGFf
fFGGgggggGGGFf
fFGGgggggGGGFf
fFGGgggggGGGFf
fFGGGGGGGGGGFf
fFGGGGGGGGGGFf
fFFFFFFFFFFFFf
fffffffffffff`;

export function PixelWindow({ state }: PixelWindowProps) {
  const dark = state === 'critical';
  const sunny = state === 'clean';
  const legend: PixelLegend = {
    '.': null,
    f: '#7A5C40',
    F: '#5B4530',
    g: dark ? '#28324A' : '#C5DCEC',
    G: dark ? '#1F2840' : '#87C4DC',
    s: '#F2C94C',
  };
  return <PixelSprite grid={sunny ? SUNNY : PLAIN} legend={legend} scale={3} />;
}
