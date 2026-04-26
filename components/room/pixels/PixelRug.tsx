import { PixelSprite, type PixelLegend } from '../PixelSprite';

const LEGEND: PixelLegend = {
  '.': null,
  a: '#1F2840',
  b: '#F4F7FB',
  k: '#1F2840',
};

const GRID = `kkkkkkkkkkkkkkkkk
kababababababababk
kbabababababababak
kababababababababk
kbabababababababak
kababababababababk
kbabababababababak
kababababababababk
kbabababababababak
kababababababababk
kkkkkkkkkkkkkkkkk`;

export function PixelRug() {
  return <PixelSprite grid={GRID} legend={LEGEND} scale={3} />;
}
