import type { RoomState } from '@/types/app';
import { PixelSprite, type PixelLegend } from '../PixelSprite';

interface PixelTrashProps { state: RoomState }

const LEGEND: PixelLegend = {
  '.': null,
  t: '#4A5570',
  T: '#1F2840',
  r: '#D9627A',
  b: '#B886D9',
  y: '#F2C94C',
};

const OVERFLOW = `...rrr.bb.
..rryryybb
..ryyrybyy
TTTTTTTTTTT
.TttttttT.
.Ttttttt.T
.TttttttT.
.Ttttttt.T
.TtttttttT
.TTTTTTTT.`;

const TIDY = `..........
..........
..........
.TTTTTTTT.
.TtttttttT
.TtttttttT
.TtttttttT
.TtttttttT
.TtttttttT
.TTTTTTTT.`;

export function PixelTrash({ state }: PixelTrashProps) {
  const overflow = state === 'critical';
  return <PixelSprite grid={overflow ? OVERFLOW : TIDY} legend={LEGEND} scale={3} />;
}
