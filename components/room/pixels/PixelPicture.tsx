import type { RoomState } from '@/types/app';
import { PixelSprite, type PixelLegend } from '../PixelSprite';

interface PixelPictureProps {
  state: RoomState;
  color?: string;
}

const GRID = `FFFFFFFFFFF
FppppppppppF
FppccccccpF.
FppccccccpF.
FppccccccpF.
FppppppppppF
FFFFFFFFFFFF`;

export function PixelPicture({ state, color = '#E8895C' }: PixelPictureProps) {
  const dark = state === 'critical';
  const legend: PixelLegend = {
    '.': null,
    f: '#7A5C40',
    F: '#5B4530',
    p: '#F4F7FB',
    c: dark ? '#28324A' : color,
  };
  return <PixelSprite grid={GRID} legend={legend} scale={3} />;
}
