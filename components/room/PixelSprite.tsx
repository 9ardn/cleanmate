import type { CSSProperties } from 'react';

export type PixelLegend = Record<string, string | null>;

interface PixelSpriteProps {
  grid: string;
  legend: PixelLegend;
  scale?: number;
  style?: CSSProperties;
}

export function PixelSprite({ grid, legend, scale = 4, style }: PixelSpriteProps) {
  const rows = grid.split('\n').filter((r) => r.length);
  const w = rows[0].length;
  const h = rows.length;
  return (
    <svg
      className="pixel"
      width={w * scale}
      height={h * scale}
      viewBox={`0 0 ${w} ${h}`}
      style={{ display: 'block', ...style }}
      shapeRendering="crispEdges"
    >
      {rows.map((row, y) =>
        [...row].map((ch, x) => {
          const c = legend[ch];
          if (!c) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={c} />;
        }),
      )}
    </svg>
  );
}
