/* Hand-drawn cartoon dinosaurs used as single decorative accents across the site. */

const STROKE = { strokeWidth: 2.5, strokeLinejoin: 'round', strokeLinecap: 'round' }

function Eye({ x, y, r = 6 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#fff" stroke="#2b1622" strokeWidth="1.6" />
      <circle cx={x + r * 0.2} cy={y + r * 0.1} r={r * 0.58} fill="#2b1622" />
      <circle cx={x + r * 0.42} cy={y - r * 0.2} r={r * 0.22} fill="#fff" />
    </g>
  )
}

const Shadow = ({ cx = 60, w = 46 }) => <ellipse cx={cx} cy="95" rx={w} ry="4" fill="#2b1622" opacity="0.1" />

function Rex() {
  const c = { fill: '#f39a2e', stroke: '#b45b17', ...STROKE }
  return (
    <>
      <Shadow cx={62} w={42} />
      <path d="M58 82 l-2 11 h10 l1-11 Z" {...c} fill="#e2861d" />
      <path d="M60 46 l3-9 5 7 M67 34 l5-9 4 8 M76 22 l6-7 3 8" fill="#6b4fa0" stroke="#4b3378" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 70 C 24 68 40 54 58 50 C 64 38 70 22 82 16 C 96 10 113 15 113 28 C 113 37 104 41 95 40 C 89 43 88 50 90 58 C 93 72 85 84 70 84 L 34 80 C 22 78 12 75 6 70 Z" {...c} />
      <path d="M74 80 l-1 13 h11 l0-11 Z" {...c} />
      <ellipse cx="79" cy="64" rx="8" ry="15" fill="#fde3b5" />
      <path d="M88 52 q7 2 8 7" {...c} fill="none" />
      <circle cx="44" cy="66" r="2.2" fill="#fde3b5" /><circle cx="52" cy="60" r="1.6" fill="#fde3b5" /><circle cx="36" cy="70" r="1.6" fill="#fde3b5" />
      <Eye x={95} y={24} />
      <path d="M101 34 q6 3 11-1" fill="none" stroke="#b45b17" strokeWidth="2" strokeLinecap="round" />
      <circle cx="109" cy="22" r="1.3" fill="#b45b17" />
    </>
  )
}

function Stego() {
  const c = { fill: '#9a7ad6', stroke: '#5b3f96', ...STROKE }
  const plate = { fill: '#6e4fb3', stroke: '#4b3378', ...STROKE }
  return (
    <>
      <Shadow />
      <path d="M38 44 l4-14 9 12 Z M52 38 l5-17 10 15 Z M68 37 l7-15 7 17 Z M84 43 l8-12 4 15 Z" {...plate} />
      <path d="M40 72 v16 h9 v-14 M82 72 v16 h-9 v-14" {...c} fill="#8667c4" />
      <path d="M6 64 C 26 62 34 42 60 40 C 84 38 96 50 104 58 C 110 55 117 58 117 64 C 117 71 108 73 100 70 C 92 74 80 77 60 77 C 40 77 22 72 6 64 Z" {...c} />
      <path d="M8 63 l-4-7 8 3 Z M15 62 l-2-8 7 5 Z" fill="#fde3b5" stroke="#5b3f96" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M30 76 v13 h9 v-12 M64 77 v12 h9 v-13" {...c} />
      <path d="M40 72 C 55 76 75 76 92 70" fill="none" stroke="#c8b5ef" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="56" r="2.4" fill="#c8b5ef" /><circle cx="62" cy="50" r="1.8" fill="#c8b5ef" /><circle cx="74" cy="56" r="2" fill="#c8b5ef" />
      <Eye x={108} y={61} r={4.6} />
      <path d="M110 68 q4 1 6-2" fill="none" stroke="#5b3f96" strokeWidth="1.8" strokeLinecap="round" />
    </>
  )
}

function Bronto() {
  const c = { fill: '#62b3ec', stroke: '#2f6fa8', ...STROKE }
  return (
    <>
      <Shadow cx={54} />
      <path d="M38 80 v13 h9 v-12 M72 78 v15 h-9 v-13" {...c} fill="#4f9fd8" />
      <path d="M4 82 C 18 78 26 62 40 53 C 54 45 70 48 76 56 C 80 42 84 26 90 16 C 95 7 109 7 111 16 C 113 23 106 27 100 27 C 96 35 92 50 89 66 C 87 79 76 85 60 85 L 30 85 C 18 85 10 84 4 82 Z" {...c} />
      <path d="M28 82 v11 h9 v-10 M78 76 v17 h-9 v-12" {...c} />
      <path d="M86 30 C 82 46 80 60 76 70" fill="none" stroke="#f6e7b9" strokeWidth="6" strokeLinecap="round" />
      <circle cx="46" cy="60" r="2.6" fill="#a8d6f6" /><circle cx="58" cy="56" r="2" fill="#a8d6f6" /><circle cx="36" cy="68" r="1.8" fill="#a8d6f6" />
      <Eye x={100} y={15} r={4.8} />
      <path d="M104 22 q4 2 6-1" fill="none" stroke="#2f6fa8" strokeWidth="1.8" strokeLinecap="round" />
    </>
  )
}

function Trike() {
  const c = { fill: '#f7b538', stroke: '#b4741a', ...STROKE }
  return (
    <>
      <Shadow />
      <path d="M34 74 v15 h10 v-13 M74 74 v15 h-10 v-13" {...c} fill="#e8a226" />
      <path d="M6 68 l18-8 v14 Z" {...c} />
      <ellipse cx="52" cy="64" rx="34" ry="20" {...c} />
      <circle cx="84" cy="46" r="21" fill="#ef7e34" stroke="#b4541a" {...STROKE} />
      <circle cx="84" cy="46" r="14" fill="#f7a14f" />
      <path d="M96 44 l14-14 -6 18 Z M86 42 l10-15 -2 17 Z" fill="#fff4dc" stroke="#b4741a" strokeWidth="2" strokeLinejoin="round" />
      <path d="M86 56 C 86 46 98 44 108 50 C 116 54 118 64 112 68 C 104 74 88 72 86 56 Z" {...c} />
      <path d="M110 54 l8-7 -2 10 Z" fill="#fff4dc" stroke="#b4741a" strokeWidth="2" strokeLinejoin="round" />
      <path d="M26 78 v11 h10 v-10 M60 82 v7 h10 v-9" {...c} />
      <circle cx="40" cy="58" r="2.4" fill="#fde3b5" /><circle cx="52" cy="52" r="1.8" fill="#fde3b5" /><circle cx="60" cy="60" r="2" fill="#fde3b5" />
      <Eye x={100} y={56} r={4.8} />
      <path d="M104 66 q4 2 8-1" fill="none" stroke="#b4741a" strokeWidth="1.8" strokeLinecap="round" />
    </>
  )
}

function Ptero() {
  const c = { fill: '#e8457a', stroke: '#a3214f', ...STROKE }
  return (
    <>
      <path d="M58 50 L 4 26 C 12 40 22 50 30 52 C 36 58 46 60 56 62 Z" fill="#f27aa2" stroke="#a3214f" {...STROKE} />
      <path d="M62 50 L 116 26 C 108 40 98 50 90 52 C 84 58 74 60 64 62 Z" fill="#f27aa2" stroke="#a3214f" {...STROKE} />
      <path d="M20 36 l10 14 M100 36 l-10 14" stroke="#a3214f" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M54 74 l-3 8 M66 74 l3 8" stroke="#a3214f" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="60" cy="60" rx="10" ry="15" {...c} />
      <ellipse cx="60" cy="64" rx="5.5" ry="9" fill="#fde3b5" />
      <path d="M52 30 L 34 16 L 54 24 Z" {...c} />
      <circle cx="60" cy="34" r="10" {...c} />
      <path d="M68 32 L 88 38 L 68 40 Z" fill="#f7b538" stroke="#b4741a" strokeWidth="2" strokeLinejoin="round" />
      <Eye x={61} y={32} r={4.2} />
    </>
  )
}

function Parasaur() {
  const c = { fill: '#3dbf8b', stroke: '#1f7f59', ...STROKE }
  return (
    <>
      <Shadow cx={58} />
      <path d="M50 76 v17 h10 v-15" {...c} fill="#30a879" />
      <path d="M4 64 C 22 62 36 50 52 48 C 66 46 76 40 84 30 C 88 24 96 22 102 26 C 108 30 108 38 102 42 C 96 46 92 50 90 58 C 88 72 80 80 66 80 C 46 80 22 72 4 64 Z" {...c} />
      <path d="M92 26 C 82 14 72 10 62 12 C 70 16 80 22 88 30 Z" fill="#a6d84a" stroke="#5f8f1f" {...STROKE} />
      <path d="M68 78 v15 h10 v-17" {...c} />
      <path d="M30 60 l4 6 M40 56 l4 7 M50 52 l4 8 M60 50 l3 8" stroke="#a6e7c9" strokeWidth="3" strokeLinecap="round" />
      <path d="M84 50 C 86 60 82 70 76 74" fill="none" stroke="#fde3b5" strokeWidth="5" strokeLinecap="round" />
      <Eye x={98} y={32} r={4.8} />
      <path d="M100 40 q4 2 7-1" fill="none" stroke="#1f7f59" strokeWidth="1.8" strokeLinecap="round" />
    </>
  )
}

/* ---------- scenery ---------- */

function Palm() {
  const leaf = { fill: '#4cae4f', stroke: '#2e7d32', ...STROKE }
  return (
    <>
      <path d="M56 96 C 58 76 58 56 62 34 L 68 35 C 64 56 64 76 66 96 Z" fill="#b98a5a" stroke="#7a5532" {...STROKE} />
      <path d="M58 82 h8 M59 70 h7 M60 58 h7 M61 46 h6" stroke="#7a5532" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M64 34 C 50 18 30 18 14 30 C 32 26 46 28 64 36 Z" {...leaf} />
      <path d="M64 34 C 78 16 98 16 112 28 C 94 25 80 28 64 36 Z" {...leaf} />
      <path d="M64 34 C 52 34 36 44 30 60 C 42 48 52 42 64 38 Z" {...leaf} fill="#3d9a41" />
      <path d="M64 34 C 78 36 92 46 96 62 C 86 50 76 42 64 38 Z" {...leaf} fill="#3d9a41" />
      <path d="M64 34 C 60 20 64 8 74 4 C 70 14 68 24 66 34 Z" {...leaf} />
      <circle cx="62" cy="38" r="3" fill="#7a5532" /><circle cx="67" cy="39" r="3" fill="#7a5532" />
    </>
  )
}

function Grass() {
  return (
    <>
      <ellipse cx="60" cy="92" rx="30" ry="5" fill="#8d8d8d" />
      <path d="M60 92 C 56 74 48 62 38 56 C 50 66 54 78 54 92 Z M60 92 C 60 72 62 60 70 48 C 66 62 66 78 66 92 Z M66 92 C 70 78 78 68 90 64 C 80 72 76 82 74 92 Z M50 92 C 46 82 38 76 30 74 C 38 80 42 86 44 92 Z" fill="#5fbf4a" stroke="#2e7d32" strokeWidth="1.8" strokeLinejoin="round" />
    </>
  )
}

function Fern() {
  return (
    <>
      <path d="M60 96 C 58 70 60 40 66 10" fill="none" stroke="#5f8f1f" strokeWidth="3" strokeLinecap="round" />
      {[20, 34, 48, 62, 76].map((y, i) => (
        <g key={y}>
          <ellipse cx={46 + i} cy={y + 2} rx="12" ry="5" transform={`rotate(-25 ${46 + i} ${y + 2})`} fill="#a6d84a" stroke="#5f8f1f" strokeWidth="1.6" />
          <ellipse cx={76 - i * 0.6} cy={y - 2} rx="12" ry="5" transform={`rotate(25 ${76 - i * 0.6} ${y - 2})`} fill="#a6d84a" stroke="#5f8f1f" strokeWidth="1.6" />
        </g>
      ))}
    </>
  )
}

function Volcano() {
  return (
    <>
      <path d="M8 94 L 44 30 H 76 L 112 94 Z" fill="#8a8f98" stroke="#555b63" {...STROKE} />
      <path d="M44 30 C 50 40 56 34 60 44 C 64 34 70 42 76 30 Z" fill="#f7792b" stroke="#c2481a" strokeWidth="2" strokeLinejoin="round" />
      <path d="M50 30 C 46 20 40 16 34 14 M60 28 V 10 M70 30 C 74 20 80 16 86 14" fill="none" stroke="#f7b538" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 80 L 44 56 M84 82 L 72 58" stroke="#a9aeb6" strokeWidth="5" strokeLinecap="round" />
    </>
  )
}

function Rock() {
  return (
    <>
      <path d="M10 92 L 22 62 L 52 50 L 92 54 L 112 80 L 108 92 Z" fill="#8a6650" stroke="#5a4031" {...STROKE} />
      <path d="M22 62 L 40 74 L 52 50 M40 74 L 80 72 L 92 54 M80 72 L 108 92" fill="none" stroke="#5a4031" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M96 92 C 98 84 102 80 106 78 M102 92 C 104 86 108 84 112 84" stroke="#4cae4f" strokeWidth="2.5" strokeLinecap="round" />
    </>
  )
}

function Egg() {
  return (
    <>
      <path d="M60 14 C 82 14 92 48 92 66 C 92 84 78 94 60 94 C 42 94 28 84 28 66 C 28 48 38 14 60 14 Z" fill="#f4ecd8" stroke="#a89a78" {...STROKE} />
      <circle cx="50" cy="44" r="4" fill="#cfc3a3" /><circle cx="68" cy="58" r="5" fill="#cfc3a3" /><circle cx="48" cy="72" r="3.5" fill="#cfc3a3" /><circle cx="72" cy="34" r="3" fill="#cfc3a3" />
    </>
  )
}

export const KINDS = {
  rex: Rex, stego: Stego, bronto: Bronto, trike: Trike, ptero: Ptero, parasaur: Parasaur,
  palm: Palm, grass: Grass, fern: Fern, volcano: Volcano, rock: Rock, egg: Egg,
}

/** One shape placed inside a larger SVG (used by the background pattern). */
export function DinoArt({ kind, x, y, w, flip = false, rotate = 0 }) {
  const Shape = KINDS[kind]
  const h = (w * 100) / 120
  return (
    <svg x={x} y={y} width={w} height={h} viewBox="0 0 120 100" overflow="visible">
      <g transform={`${flip ? 'matrix(-1 0 0 1 120 0) ' : ''}rotate(${rotate} 60 50)`}><Shape /></g>
    </svg>
  )
}

export default function Dino({ kind = 'rex', flip = false, className = '' }) {
  const Shape = KINDS[kind] || Rex
  return (
    <svg
      className={`dino dino-${kind}${className ? ` ${className}` : ''}`}
      viewBox="0 0 120 100"
      aria-hidden="true"
      focusable="false"
    >
      <g transform={flip ? 'matrix(-1 0 0 1 120 0)' : undefined}><Shape /></g>
    </svg>
  )
}
