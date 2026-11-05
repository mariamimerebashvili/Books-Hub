import { useEffect, useState } from 'react'
import { DinoArt } from './Dino.jsx'

/*
 * One 1400×1300 tile, repeated over the whole page behind the content.
 * `kind` items are hand-drawn SVGs (Dino.jsx); `img` items are cut-outs in /public/dinos.
 */
const TILE_W = 1400
const TILE_H = 1300

// Cut-out sizes (px) so each <image> gets its real aspect ratio.
const IMAGES = {
  'teal-bronto': [520, 447], palm: [520, 484], 'green-rex': [520, 491], ptero: [428, 466],
  succulent: [445, 368], raptor: [520, 464], 'fern-sprig': [179, 353], leafy: [307, 247],
  'striped-plant': [520, 455], 'green-bronto': [413, 520], grass: [398, 502], bush: [394, 266], sprig: [520, 143],
}

const ITEMS = [
  // row 1
  { kind: 'rex', x: 30, y: 60, w: 180 },
  { img: 'teal-bronto', x: 300, y: 30, w: 220 },
  { img: 'fern-sprig', x: 580, y: 60, w: 60 },
  { kind: 'ptero', x: 700, y: 20, w: 150, rotate: -8 },
  { img: 'green-rex', x: 950, y: 40, w: 220 },
  { kind: 'palm', x: 1230, y: 70, w: 140 },
  // row 2
  { img: 'succulent', x: 40, y: 330, w: 130 },
  { kind: 'stego', x: 260, y: 360, w: 200, flip: true },
  { img: 'ptero', x: 560, y: 300, w: 150 },
  { img: 'leafy', x: 800, y: 340, w: 110 },
  { kind: 'bronto', x: 980, y: 330, w: 210 },
  { kind: 'egg', x: 1290, y: 360, w: 60, rotate: 12 },
  // row 3
  { img: 'raptor', x: 20, y: 560, w: 250 },
  { img: 'striped-plant', x: 380, y: 600, w: 170 },
  { kind: 'trike', x: 640, y: 600, w: 200 },
  { img: 'palm', x: 920, y: 560, w: 170 },
  { kind: 'rock', x: 1200, y: 640, w: 130 },
  // row 4
  { kind: 'volcano', x: 60, y: 900, w: 170 },
  { img: 'green-bronto', x: 330, y: 840, w: 200 },
  { img: 'bush', x: 620, y: 960, w: 130 },
  { kind: 'parasaur', x: 820, y: 900, w: 210, flip: true },
  { img: 'grass', x: 1150, y: 880, w: 110 },
  { img: 'sprig', x: 1100, y: 1180, w: 180, rotate: -10 },
  { kind: 'grass', x: 200, y: 1190, w: 80 },
  { kind: 'fern', x: 1300, y: 1020, w: 90 },
]

function useScale() {
  const get = () => (window.innerWidth < 600 ? 0.5 : window.innerWidth < 960 ? 0.7 : 1)
  const [scale, setScale] = useState(get)
  useEffect(() => {
    const onResize = () => setScale(get())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return scale
}

function Cutout({ img, x, y, w, rotate = 0 }) {
  const [iw, ih] = IMAGES[img]
  const h = Math.round((w * ih) / iw)
  return (
    <image
      href={`/dinos/${img}.webp`}
      x={x}
      y={y}
      width={w}
      height={h}
      transform={rotate ? `rotate(${rotate} ${x + w / 2} ${y + h / 2})` : undefined}
    />
  )
}

export default function DinoBackdrop() {
  const scale = useScale()
  return (
    <div className="dino-backdrop" aria-hidden="true">
      <svg width="100%" height="100%">
        <defs>
          <pattern
            id="dino-tile"
            patternUnits="userSpaceOnUse"
            width={TILE_W}
            height={TILE_H}
            patternTransform={`scale(${scale})`}
          >
            {ITEMS.map((it, i) => (it.img ? <Cutout key={i} {...it} /> : <DinoArt key={i} {...it} />))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dino-tile)" />
      </svg>
    </div>
  )
}
