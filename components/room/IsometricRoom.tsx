import type { RoomState } from '@/types/app';
import { PALETTE, type CharacterPose } from '@/lib/constants';
import { Character } from './Character';
import { PixelBed } from './pixels/PixelBed';
import { PixelDesk } from './pixels/PixelDesk';
import { PixelPlant } from './pixels/PixelPlant';
import { PixelTrash } from './pixels/PixelTrash';
import { PixelDust } from './pixels/PixelDust';
import { PixelWindow } from './pixels/PixelWindow';
import { PixelDoor } from './pixels/PixelDoor';
import { PixelShelf } from './pixels/PixelShelf';
import { PixelPicture } from './pixels/PixelPicture';
import { PixelRug } from './pixels/PixelRug';

interface IsometricRoomProps {
  state?: RoomState;
  scale?: number;
  pose?: CharacterPose;
}

const DUST_COUNT: Record<RoomState, number> = {
  clean: 0, ok: 2, dirty: 6, critical: 12,
};

const CRITICAL_TRASH = [
  { x: 80,  y: 270, c: '#D9627A' },
  { x: 200, y: 280, c: '#E8895C' },
  { x: 260, y: 290, c: '#F4F7FB' },
  { x: 60,  y: 295, c: '#5B8DB8' },
];

const CLEAN_SPARKLES = [
  { x: 80,  y: 100 },
  { x: 280, y: 120 },
  { x: 200, y: 80 },
];

export function IsometricRoom({ state = 'clean', scale = 1, pose = 'idle' }: IsometricRoomProps) {
  const p = PALETTE[state];
  const dusts = Array.from({ length: DUST_COUNT[state] }, (_, i) => i);

  return (
    <div
      className="iso-stage pixel"
      style={{ background: p.sky, transition: 'background 600ms ease', overflow: 'hidden' }}
    >
      {/* Sun + cloud (clean) */}
      {state === 'clean' && (
        <>
          <div
            style={{
              position: 'absolute', left: 30, top: 24,
              width: 36, height: 36, background: p.sun,
              boxShadow: `8px 0 0 ${p.sun}, -8px 0 0 ${p.sun}, 0 8px 0 ${p.sun}, 0 -8px 0 ${p.sun}`,
            }}
          />
          <div style={{ position: 'absolute', right: 30, top: 30, display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 60, height: 8, background: '#FFFFFF' }} />
            <div style={{ width: 76, height: 8, background: '#FFFFFF', marginLeft: -8 }} />
            <div style={{ width: 50, height: 8, background: '#FFFFFF', marginLeft: 4 }} />
          </div>
        </>
      )}

      {/* Storm + rain (critical) */}
      {state === 'critical' && (
        <>
          <div style={{ position: 'absolute', left: 20, top: 20, width: 80, height: 8, background: '#28324A' }} />
          <div style={{ position: 'absolute', left: 30, top: 28, width: 90, height: 8, background: '#1F2840' }} />
          <div style={{ position: 'absolute', right: 20, top: 22, width: 70, height: 8, background: '#28324A' }} />
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute', top: 36, left: 30 + i * 35,
                width: 2, height: 12, background: '#5B8DB8', opacity: 0.6,
                animation: `rain-fall 1s ${i * 0.1}s linear infinite`,
              }}
            />
          ))}
        </>
      )}

      {/* Room container */}
      <div
        style={{
          position: 'relative',
          width: 360,
          height: 320,
          transition: 'transform 400ms ease',
          transform: `scale(${scale})`,
        }}
      >
        {/* Back wall */}
        <div
          style={{
            position: 'absolute', left: 20, top: 20, width: 320, height: 200,
            background: p.wall,
            borderTop: `4px solid ${p.wallShade}`,
            borderLeft: `4px solid ${p.wallShade}`,
            borderRight: `4px solid ${p.wallDark}`,
            boxShadow: `inset 0 4px 0 ${p.wallShade}, inset 0 -4px 0 ${p.wallDark}`,
          }}
        >
          {state !== 'critical' &&
            Array.from({ length: 24 }).map((_, i) => {
              const r = i;
              const x = ((r * 31) % 290) + 12;
              const y = ((r * 47) % 170) + 14;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute', left: x, top: y,
                    width: 4, height: 4, background: p.wallShade, opacity: 0.6,
                  }}
                />
              );
            })}

          <div style={{ position: 'absolute', left: 200, top: 30 }}>
            <PixelWindow state={state} />
          </div>

          <div style={{ position: 'absolute', left: 30, top: 36 }}>
            <PixelPicture state={state} color="#B886D9" />
          </div>
          <div style={{ position: 'absolute', left: 110, top: 50 }}>
            <PixelPicture state={state} color="#5B8DB8" />
          </div>

          {state === 'critical' && (
            <>
              <div style={{ position: 'absolute', left: 50, top: 130, width: 30, height: 16, background: 'rgba(0,0,0,0.35)' }} />
              <div style={{ position: 'absolute', left: 160, top: 150, width: 22, height: 12, background: 'rgba(0,0,0,0.35)' }} />
            </>
          )}

          <div style={{ position: 'absolute', right: 20, bottom: 0 }}>
            <PixelDoor />
          </div>

          <div style={{ position: 'absolute', left: 24, top: 96 }}>
            <PixelShelf />
          </div>
        </div>

        {/* Floor */}
        <div
          style={{
            position: 'absolute', left: 0, top: 220, width: 360, height: 96,
            background: p.floor,
            borderTop: `4px solid ${p.floorDark}`,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute', left: 0, top: i * 24, width: '100%', height: 1,
                background: p.floorDark, opacity: 0.5,
              }}
            />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute', left: i * 45, top: 0, height: '100%', width: 1,
                background: p.floorDark, opacity: 0.4,
              }}
            />
          ))}
          <div style={{ position: 'absolute', left: 100, top: 30 }}>
            <PixelRug />
          </div>
        </div>

        {/* Furniture */}
        <div style={{ position: 'absolute', left: 220, top: 162 }}>
          <PixelBed state={state} />
        </div>
        <div style={{ position: 'absolute', left: 24, top: 178 }}>
          <PixelDesk state={state} />
        </div>
        <div style={{ position: 'absolute', left: 174, top: 200 }}>
          <PixelPlant state={state} />
        </div>
        <div style={{ position: 'absolute', left: 130, top: 245 }}>
          <PixelTrash state={state} />
        </div>

        <div style={{ position: 'absolute', left: 152, top: 152, zIndex: 5 }}>
          <Character state={state} pose={pose} />
        </div>

        {dusts.map((i) => {
          const seed = (i * 137) % 360;
          const x = 30 + (seed % 280);
          const y = 240 + ((seed * 7) % 60);
          return (
            <div
              key={i}
              style={{
                position: 'absolute', left: x, top: y,
                animation: `float-y 3s ${i * 0.2}s ease-in-out infinite`,
              }}
            >
              <PixelDust size={state === 'critical' ? 'lg' : 'md'} />
            </div>
          );
        })}

        {state === 'critical' &&
          CRITICAL_TRASH.map((t, i) => (
            <div
              key={i}
              style={{
                position: 'absolute', left: t.x, top: t.y,
                width: 14, height: 8, background: t.c, border: '1px solid #1F2840',
              }}
            />
          ))}

        {state === 'clean' &&
          CLEAN_SPARKLES.map((s, i) => (
            <div
              key={i}
              style={{
                position: 'absolute', left: s.x, top: s.y,
                animation: `sparkle 2s ${i * 0.4}s ease-in-out infinite`,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 7 7" shapeRendering="crispEdges">
                <rect x="3" y="0" width="1" height="7" fill="#F2C94C" />
                <rect x="0" y="3" width="7" height="1" fill="#F2C94C" />
                <rect x="2" y="2" width="3" height="3" fill="#FFFFFF" />
              </svg>
            </div>
          ))}
      </div>
    </div>
  );
}
