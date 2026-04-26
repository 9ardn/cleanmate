import { PixelSprite, type PixelLegend } from '../PixelSprite';

const LEGEND: PixelLegend = {
  '.': null,
  s: '#7A5C40',
  S: '#5B4530',
  r: '#D9627A',
  g: '#5B8DB8',
  y: '#F2C94C',
  b: '#B886D9',
  p: '#E8895C',
  k: '#1F2840',
};

const GRID = `.r.gg.yy..b...p.
.r.gg.yy..b..pp.
.r.gg.yy..b..pp.
.r.gg.yy..b..pp.
.r.gg.yy..b..pp.
SSSSSSSSSSSSSSSS
ssssssssssssssss
SSSSSSSSSSSSSSSS`;

export function PixelShelf() {
  return <PixelSprite grid={GRID} legend={LEGEND} scale={3} />;
}
