/* isometric-room.jsx — Pixel art version
   - Pixelated rendering, chunky blocks, dithered shading
   - Cool sky/lavender palette
*/

const STATE_LABELS = {
  clean: { ko: '쾌적', en: 'PRISTINE', score: 95, color: 'var(--state-clean)' },
  ok:    { ko: '양호', en: 'STEADY',   score: 70, color: 'var(--state-ok)' },
  dirty: { ko: '주의', en: 'MESSY',    score: 38, color: 'var(--state-dirty)' },
  critical: { ko: '심각', en: 'CHAOS', score: 12, color: 'var(--state-critical)' },
};

// Pixel-art palette per state — wall/floor/sky tints
const PALETTE = {
  clean:    { wall: '#A8C8E0', wallShade: '#7FA9C8', wallDark: '#5B8DB8', floor: '#D8C8B0', floorDark: '#A89880', sky: '#C5DCEC', sun: '#F2C94C' },
  ok:       { wall: '#9BBAD0', wallShade: '#7298B5', wallDark: '#52819F', floor: '#C9B89F', floorDark: '#998870', sky: '#B8CFDF', sun: '#E0B940' },
  dirty:    { wall: '#7A95AC', wallShade: '#5B7A93', wallDark: '#42627B', floor: '#A8987F', floorDark: '#7A6E58', sky: '#8B9EAE', sun: '#B8965A' },
  critical: { wall: '#4F5F75', wallShade: '#384458', wallDark: '#28324A', floor: '#7A6E55', floorDark: '#544A38', sky: '#3D4A5F', sun: '#6B5A40' },
};

// ── Pixel canvas helper: draw a sprite from a string grid
// Each char is one pixel; legend maps chars to colors. Renders as <svg>.
function PixelSprite({ grid, legend, scale = 4, style = {} }) {
  const rows = grid.split('\n').filter(r => r.length);
  const w = rows[0].length;
  const h = rows.length;
  return (
    <svg className="pixel" width={w * scale} height={h * scale} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', ...style }} shapeRendering="crispEdges">
      {rows.map((row, y) =>
        [...row].map((ch, x) => {
          const c = legend[ch];
          if (!c) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={c}/>;
        })
      )}
    </svg>
  );
}

// ── Pixel character (front-facing)
function Character({ state = 'clean', pose = 'idle' }) {
  const expr = { clean: 'happy', ok: 'neutral', dirty: 'sad', critical: 'cry' }[state];
  // Color legend
  const L = {
    '.': null,
    'k': '#1F2840',         // outline
    's': '#F2D2B8',         // skin
    'S': '#D9B095',         // skin shadow
    'h': '#1F2840',         // hair (dark)
    'H': '#3A4258',         // hair light
    'b': '#5B8DB8',         // beanie
    'B': '#3F6F94',         // beanie shadow
    'p': '#B886D9',         // beanie pin
    't': '#F4F7FB',         // tee
    'T': '#D6DDE8',         // tee shadow
    'g': '#5B8DB8',         // overalls strap
    'G': '#3F6F94',         // overalls dark
    'a': '#B886D9',         // accent (heart)
    'd': '#1F2840',         // pants
    'D': '#0F1828',         // pants dark
    'o': '#1F2840',         // shoe
    'e': '#1F2840',         // eye
    'm': '#D9627A',         // mouth red
    'c': '#E8895C',         // cheek
    'w': '#FFFFFF',         // white
    'r': '#D9627A',         // tear
    'q': '#87C4DC',         // tear blue
  };

  // 18 wide × 24 tall body (idle pose)
  // Frame: head with beanie, face, body with strap, legs
  const idleFace = expr === 'happy' ?
`..k..k..
..k..k..
..ccmmcc
....mm..` :
expr === 'neutral' ?
`..k..k..
........
....mm..
........` :
expr === 'sad' ?
`..kk.kk.
........
...mm...
..mm.mm.` :
/* cry */
`..kkkkk.
.k...k..
...mmm..
.mm.mmm.`;

  // Build full sprite — beanie + hair + face + body + legs
  // 16 cols × 28 rows
  const sprite =
`....bbbbbbbb....
...bbbBBBBBb....
..bppbBBBBBb....
..bbbbBBBBBBb...
..hhhhhhhhhhhh..
..hHHHHHHHHHhh..
.hsssssssssssh..
.hsssssssssssh..
.hssEEsssEEssh..
.hssEEsssEEssh..
.hssccsssccssh..
.hsssssMMsssh..
.hsssMMMMMsssh..
..hhsssssssh....
....TttTttT.....
.gggttttttggg...
.gggttAAttggg...
..ggtAAAAtgg....
..ggttttttgg....
..ggttttttgg....
..gddddddddg....
..ddddddddddd...
..ddd....ddd....
..ddd....ddd....
..ddd....ddd....
..ddd....ddd....
.OOOO....OOOO...
.oooo....oooo...`;

  // Pose-conditional face pixels — replace E (eye) and M (mouth) accordingly
  let processed = sprite;
  if (expr === 'happy') {
    processed = processed
      .replace(/EE/g, 'ee')
      .replace(/MMMMM/g, 'mmmmm')
      .replace(/MM/g, 'mm');
  } else if (expr === 'neutral') {
    processed = processed
      .replace(/EE/g, 'ee')
      .replace(/MMMMM/g, '..mm.')
      .replace(/MM/g, 'mm');
  } else if (expr === 'sad') {
    processed = processed
      .replace(/EE/g, 'kk')
      .replace(/MMMMM/g, 'mm.mm')
      .replace(/MM/g, 'mm');
  } else {
    processed = processed
      .replace(/EE/g, 'qq')
      .replace(/MMMMM/g, '.mmm.')
      .replace(/MM/g, 'mm');
  }

  L['O'] = '#1F2840';
  L['E'] = '#1F2840';
  L['M'] = '#D9627A';
  L['A'] = '#B886D9';

  return (
    <div style={{ animation: 'float-y 3s ease-in-out infinite', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <PixelSprite grid={processed} legend={L} scale={3.5}/>
      {/* shadow */}
      <div style={{ width: 50, height: 6, background: 'rgba(0,0,0,0.25)', borderRadius: '50%', marginTop: 2, filter: 'blur(2px)' }}/>
    </div>
  );
}

// ── Pixel furniture sprites ─────────────────────────────────────────────────

function PixelBed({ state }) {
  const messy = state === 'dirty' || state === 'critical';
  const L = {
    '.': null,
    'w': '#7A5C40',  // wood
    'W': '#5B4530',  // wood dark
    's': '#F4F7FB',  // sheet
    'S': '#D6DDE8',  // sheet shade
    'p': '#E8895C',  // pillow
    'P': '#B96B45',  // pillow dark
    'b': '#5B8DB8',  // blanket
    'B': '#3F6F94',  // blanket dark
  };
  const grid = messy ?
`....................
.WWWWWWWWWWWWWWWWWW.
.WppPPpppPbbbbbbbWW.
.WppppPPpbbbBbbbBWW.
.WSSSSSSSbbbbBbbbWW.
.WsssSSSSbBbbbbBbWW.
.WssssssssbbbbbbWW..
.WWWWWWWWWWWWWWWWW..
.W................W.` :
`....................
.WWWWWWWWWWWWWWWWWW.
.WppPPppppppppppppW.
.WppppPPpppppppppPW.
.WSSSSSSSbbbbbbbbBW.
.WssssSSSbbbbbbBBBW.
.WssssssssbbbbBBBBW.
.WWWWWWWWWWWWWWWWWW.
.W................W.`;
  return <PixelSprite grid={grid} legend={L} scale={3}/>;
}

function PixelDesk({ state }) {
  const dark = state === 'critical';
  const L = {
    '.': null,
    'w': '#7A5C40',
    'W': '#5B4530',
    'l': dark ? '#28324A' : '#87C4DC', // laptop screen
    'L': '#1F2840',  // laptop frame
    'm': '#E8895C', // mug
    'M': '#B96B45',
  };
  const grid =
`...LLLLLLLL....
...Llllllll....
...Llllllll...mm
...Llllllll...mm
...Llllllll...mM
.LLLLLLLLLLL..MM
.WWWWWWWWWWW....
.W.WWWWWWW.W....
.W.W.....W.W....
.W.W.....W.W....
.W.W.....W.W....`;
  return <PixelSprite grid={grid} legend={L} scale={3}/>;
}

function PixelPlant({ state }) {
  const dead = state === 'critical';
  const wilted = state === 'dirty';
  const L = {
    '.': null,
    'p': '#D9627A',  // pot
    'P': '#A8485E',  // pot dark
    'g': wilted ? '#7A8A5C' : '#5B8DB8',  // leaf
    'G': wilted ? '#5C6B40' : '#3F6F94',  // leaf dark
    'b': '#7A5C40',  // dead branch
  };
  const grid = dead ?
`...b.b....
...bbb....
....b.....
....b.....
....b.....
.PPPPPPPP.
.pppppppp.
.pppppppp.
.PPPPPPPP.` :
`....gG....
...ggGG...
..gggGGG..
.ggGgggGG.
..gggGgg..
.gGgggGGg.
....b.....
.PPPPPPPP.
.pppppppp.
.pppppppp.
.PPPPPPPP.`;
  return <PixelSprite grid={grid} legend={L} scale={3}/>;
}

function PixelTrash({ state }) {
  const overflow = state === 'critical';
  const L = {
    '.': null,
    't': '#4A5570',
    'T': '#1F2840',
    'r': '#D9627A',
    'b': '#B886D9',
    'y': '#F2C94C',
  };
  const grid = overflow ?
`...rrr.bb.
..rryryybb
..ryyrybyy
TTTTTTTTTTT
.TttttttT.
.Ttttttt.T
.TttttttT.
.Ttttttt.T
.TtttttttT
.TTTTTTTT.` :
`..........
..........
..........
.TTTTTTTT.
.TtttttttT
.TtttttttT
.TtttttttT
.TtttttttT
.TtttttttT
.TTTTTTTT.`;
  return <PixelSprite grid={grid} legend={L} scale={3}/>;
}

function PixelDust({ size = 'md' }) {
  const L = {
    '.': null,
    'd': '#4A5570',
    'D': '#1F2840',
  };
  const grid = size === 'lg' ?
`..ddd...
.dDDDDd.
ddDDDDDdd
.DDDDDDD.
.dDDDDd..` :
`..d.....
.dDDd...
ddDDDdd.
.dDDd...`;
  return <PixelSprite grid={grid} legend={L} scale={2.5}/>;
}

function PixelWindow({ state }) {
  const dark = state === 'critical';
  const sunny = state === 'clean';
  const L = {
    '.': null,
    'f': '#7A5C40',  // frame
    'F': '#5B4530',
    'g': dark ? '#28324A' : '#C5DCEC',  // glass
    'G': dark ? '#1F2840' : '#87C4DC',  // glass shade
    's': '#F2C94C',  // sun
  };
  const grid = sunny ?
`fffffffffffff
fFFFFFFFFFFFFf
fFssGGGGGGGGFf
fFsssGGGGGGGFf
fFsssGGGgggGFf
fFGGGGGGgggGFf
fFGGGGGGgggGFf
fFGGGGGGGGGGFf
fFFFFFFFFFFFFf
fffffffffffff` :
`fffffffffffff
fFFFFFFFFFFFFf
fFGGGGGGGGGGFf
fFGGgggggGGGFf
fFGGgggggGGGFf
fFGGgggggGGGFf
fFGGGGGGGGGGFf
fFGGGGGGGGGGFf
fFFFFFFFFFFFFf
fffffffffffff`;
  return <PixelSprite grid={grid} legend={L} scale={3}/>;
}

function PixelDoor() {
  const L = {
    '.': null,
    'd': '#7A5C40',
    'D': '#5B4530',
    'k': '#F2C94C',
  };
  const grid =
`DDDDDDDDDDDD
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
  return <PixelSprite grid={grid} legend={L} scale={3.5}/>;
}

function PixelShelf() {
  const L = {
    '.': null,
    's': '#7A5C40',
    'S': '#5B4530',
    'r': '#D9627A',
    'g': '#5B8DB8',
    'y': '#F2C94C',
    'b': '#B886D9',
    'p': '#E8895C',
    'k': '#1F2840',
  };
  const grid =
`.r.gg.yy..b...p.
.r.gg.yy..b..pp.
.r.gg.yy..b..pp.
.r.gg.yy..b..pp.
.r.gg.yy..b..pp.
SSSSSSSSSSSSSSSS
ssssssssssssssss
SSSSSSSSSSSSSSSS`;
  return <PixelSprite grid={grid} legend={L} scale={3}/>;
}

function PixelPicture({ state, color = '#E8895C' }) {
  const dark = state === 'critical';
  const L = {
    '.': null,
    'f': '#7A5C40',
    'F': '#5B4530',
    'p': '#F4F7FB',
    'c': dark ? '#28324A' : color,
  };
  const grid =
`FFFFFFFFFFF
FppppppppppF
FppccccccpF.
FppccccccpF.
FppccccccpF.
FppppppppppF
FFFFFFFFFFFF`;
  return <PixelSprite grid={grid} legend={L} scale={3}/>;
}

// ── Pixel rug (top-down)
function PixelRug() {
  const L = {
    '.': null,
    'a': '#1F2840',
    'b': '#F4F7FB',
    'k': '#1F2840',
  };
  const grid =
`kkkkkkkkkkkkkkkkk
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
  return <PixelSprite grid={grid} legend={L} scale={3}/>;
}

// ─────────────────────────────────────────────────────────────
// THE ROOM — flat pixel art (front view, slight isometric tilt)
// ─────────────────────────────────────────────────────────────
function IsometricRoom({ state = 'clean', scale = 1, pose = 'idle' }) {
  const p = PALETTE[state];
  const dustCount = { clean: 0, ok: 2, dirty: 6, critical: 12 }[state];
  const dusts = Array.from({ length: dustCount }, (_, i) => i);

  return (
    <div className="iso-stage pixel" style={{ background: p.sky, transition: 'background 600ms ease', overflow: 'hidden' }}>
      {/* Sky / sun layer */}
      {state === 'clean' && (
        <>
          <div style={{ position: 'absolute', left: 30, top: 24, width: 36, height: 36, background: p.sun, boxShadow: `8px 0 0 ${p.sun}, -8px 0 0 ${p.sun}, 0 8px 0 ${p.sun}, 0 -8px 0 ${p.sun}` }}/>
          {/* Cloud */}
          <div style={{ position: 'absolute', right: 30, top: 30, display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 60, height: 8, background: '#FFFFFF' }}/>
            <div style={{ width: 76, height: 8, background: '#FFFFFF', marginLeft: -8 }}/>
            <div style={{ width: 50, height: 8, background: '#FFFFFF', marginLeft: 4 }}/>
          </div>
        </>
      )}
      {state === 'critical' && (
        <>
          {/* dark clouds */}
          <div style={{ position: 'absolute', left: 20, top: 20, width: 80, height: 8, background: '#28324A' }}/>
          <div style={{ position: 'absolute', left: 30, top: 28, width: 90, height: 8, background: '#1F2840' }}/>
          <div style={{ position: 'absolute', right: 20, top: 22, width: 70, height: 8, background: '#28324A' }}/>
          {/* rain */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute', top: 36, left: 30 + i * 35,
              width: 2, height: 12, background: '#5B8DB8', opacity: 0.6,
              animation: `rain-fall 1s ${i * 0.1}s linear infinite`,
            }}/>
          ))}
        </>
      )}

      {/* ROOM CONTAINER — 360 wide, 320 tall */}
      <div style={{
        position: 'relative',
        width: 360, height: 320,
        transition: 'transform 400ms ease',
        transform: `scale(${scale})`,
      }}>
        {/* Back wall */}
        <div style={{
          position: 'absolute', left: 20, top: 20, width: 320, height: 200,
          background: p.wall,
          borderTop: `4px solid ${p.wallShade}`,
          borderLeft: `4px solid ${p.wallShade}`,
          borderRight: `4px solid ${p.wallDark}`,
          boxShadow: `inset 0 4px 0 ${p.wallShade}, inset 0 -4px 0 ${p.wallDark}`,
        }}>
          {/* Wallpaper dots */}
          {state !== 'critical' && Array.from({ length: 24 }).map((_, i) => {
            const r = i;
            const x = (r * 31) % 290 + 12;
            const y = (r * 47) % 170 + 14;
            return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 4, height: 4, background: p.wallShade, opacity: 0.6 }}/>;
          })}

          {/* Window */}
          <div style={{ position: 'absolute', left: 200, top: 30 }}>
            <PixelWindow state={state}/>
          </div>

          {/* Pictures */}
          <div style={{ position: 'absolute', left: 30, top: 36 }}>
            <PixelPicture state={state} color="#B886D9"/>
          </div>
          <div style={{ position: 'absolute', left: 110, top: 50 }}>
            <PixelPicture state={state} color="#5B8DB8"/>
          </div>

          {/* Stains for critical */}
          {state === 'critical' && (
            <>
              <div style={{ position: 'absolute', left: 50, top: 130, width: 30, height: 16, background: 'rgba(0,0,0,0.35)' }}/>
              <div style={{ position: 'absolute', left: 160, top: 150, width: 22, height: 12, background: 'rgba(0,0,0,0.35)' }}/>
            </>
          )}

          {/* Door */}
          <div style={{ position: 'absolute', right: 20, bottom: 0 }}>
            <PixelDoor/>
          </div>

          {/* Shelf */}
          <div style={{ position: 'absolute', left: 24, top: 96 }}>
            <PixelShelf/>
          </div>
        </div>

        {/* Floor — diagonal/iso-ish via skew */}
        <div style={{
          position: 'absolute', left: 0, top: 220, width: 360, height: 96,
          background: p.floor,
          borderTop: `4px solid ${p.floorDark}`,
        }}>
          {/* Floor tiles — horizontal lines */}
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              position: 'absolute', left: 0, top: i * 24, width: '100%', height: 1,
              background: p.floorDark, opacity: 0.5,
            }}/>
          ))}
          {/* Vertical seams */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} style={{
              position: 'absolute', left: i * 45, top: 0, height: '100%', width: 1,
              background: p.floorDark, opacity: 0.4,
            }}/>
          ))}

          {/* Rug */}
          <div style={{ position: 'absolute', left: 100, top: 30 }}>
            <PixelRug/>
          </div>
        </div>

        {/* Furniture on floor — bed */}
        <div style={{ position: 'absolute', left: 220, top: 162 }}>
          <PixelBed state={state}/>
        </div>

        {/* Desk */}
        <div style={{ position: 'absolute', left: 24, top: 178 }}>
          <PixelDesk state={state}/>
        </div>

        {/* Plant */}
        <div style={{ position: 'absolute', left: 174, top: 200 }}>
          <PixelPlant state={state}/>
        </div>

        {/* Trash */}
        <div style={{ position: 'absolute', left: 130, top: 245 }}>
          <PixelTrash state={state}/>
        </div>

        {/* Character */}
        <div style={{ position: 'absolute', left: 152, top: 152, zIndex: 5 }}>
          <Character state={state} pose={pose}/>
        </div>

        {/* Dust bunnies on floor */}
        {dusts.map(i => {
          const seed = (i * 137) % 360;
          const x = 30 + (seed % 280);
          const y = 240 + ((seed * 7) % 60);
          return (
            <div key={i} style={{ position: 'absolute', left: x, top: y, animation: `float-y 3s ${i*0.2}s ease-in-out infinite` }}>
              <PixelDust size={state === 'critical' ? 'lg' : 'md'}/>
            </div>
          );
        })}

        {/* Trash items scattered when critical */}
        {state === 'critical' && (
          <>
            {[
              { x: 80, y: 270, c: '#D9627A' },
              { x: 200, y: 280, c: '#E8895C' },
              { x: 260, y: 290, c: '#F4F7FB' },
              { x: 60, y: 295, c: '#5B8DB8' },
            ].map((t, i) => (
              <div key={i} style={{ position: 'absolute', left: t.x, top: t.y, width: 14, height: 8, background: t.c, border: '1px solid #1F2840' }}/>
            ))}
          </>
        )}

        {/* Sparkles for clean */}
        {state === 'clean' && [
          { x: 80, y: 100 },
          { x: 280, y: 120 },
          { x: 200, y: 80 },
        ].map((s, i) => (
          <div key={i} style={{ position: 'absolute', left: s.x, top: s.y, animation: `sparkle 2s ${i*0.4}s ease-in-out infinite` }}>
            <svg width="14" height="14" viewBox="0 0 7 7" shapeRendering="crispEdges">
              <rect x="3" y="0" width="1" height="7" fill="#F2C94C"/>
              <rect x="0" y="3" width="7" height="1" fill="#F2C94C"/>
              <rect x="2" y="2" width="3" height="3" fill="#FFFFFF"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

// Compatibility export
function DustBunny({ size = 'md' }) { return <PixelDust size={size}/>; }

Object.assign(window, { IsometricRoom, Character, STATE_LABELS, DustBunny, PixelSprite });
