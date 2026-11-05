import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, fileUrl } from '../api.js'
import { ArrowIcon } from './Icons.jsx'

function BannerButton({ banner }) {
  if (!banner.link || !banner.button_text) return null
  const content = <>{banner.button_text} <ArrowIcon /></>
  return banner.link.startsWith('/')
    ? <Link className="btn gold" to={banner.link}>{content}</Link>
    : <a className="btn gold" href={banner.link} target="_blank" rel="noreferrer">{content}</a>
}

export default function Banner() {
  const [banners, setBanners] = useState([])
  const [index, setIndex] = useState(0)
  const touchX = useRef(null)

  useEffect(() => {
    api.banners().then(setBanners).catch(() => setBanners([]))
  }, [])

  useEffect(() => {
    if (banners.length < 2) return
    const t = setInterval(() => setIndex((i) => (i + 1) % banners.length), 7000)
    return () => clearInterval(t)
  }, [banners.length, index])

  if (!banners.length) return null
  const banner = banners[index % banners.length]
  const go = (step) => setIndex((i) => (i + step + banners.length) % banners.length)

  return (
    <section className="wrap hero" aria-roledescription="carousel" aria-label="ბანერი">
      <div
        className="hero-card"
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          if (touchX.current == null || banners.length < 2) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
          touchX.current = null
        }}
      >
        {/* key re-mounts the slide so the entrance animation replays */}
        <div className="hero-text" key={`t-${banner.id}`}>
          <span className="chip hero-eyebrow">✨ ჯადოსნური ბუმბული</span>
          {banner.title && <h1>{banner.title}</h1>}
          {banner.subtitle && <p>{banner.subtitle}</p>}
          <BannerButton banner={banner} />
        </div>
        {banner.image_url && (
          <div className="hero-img" key={`i-${banner.id}`}>
            <img src={fileUrl(banner.image_url)} alt="" />
          </div>
        )}
      </div>
      {banners.length > 1 && (
        <div className="hero-dots">
          {banners.map((b, i) => (
            <button key={b.id} aria-label={`ბანერი ${i + 1}`} aria-current={i === index} onClick={() => setIndex(i)} />
          ))}
        </div>
      )}
    </section>
  )
}
