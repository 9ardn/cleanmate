import { PixelSprite, type PixelLegend } from '../PixelSprite';

interface PixelDustProps { size?: 'md' | 'lg' }

const LEGEND: PixelLegend = {
  '.': null,
  d: '#4A5570',
  D: '#1F2840',
};

const LG = `..ddd...
.dDDDDd.
ddDDDDDdd
.DDDDDDD.
.dDDDDd..`;

const MD = `..d.....
.dDDd...
ddDDDdd.
.dDDd...`;

export function PixelDust({ size = 'md' }: PixelDustProps) {
  return <PixelSprite grid={size === 'lg' ? LG : MD} legend={LEGEND} scale={2.5} />;
}
