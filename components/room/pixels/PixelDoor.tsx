import { PixelSprite, type PixelLegend } from '../PixelSprite';

const LEGEND: PixelLegend = {
  '.': null,
  d: '#7A5C40',
  D: '#5B4530',
  k: '#F2C94C',
};

const GRID = `DDDDDDDDDDDD
Dddddddddddd
Dddddddddddd
DddDDDDDDddd
DddDDDDDDddd
DddDDDDDDddk
DddDDDDDDddd
DddDDDDDDddd
DddDDDDDDddd
DddDDDDDDddd
DDDDDDDDDDDD`;

export function PixelDoor() {
  return <PixelSprite grid={GRID} legend={LEGEND} scale={3.5} />;
}
