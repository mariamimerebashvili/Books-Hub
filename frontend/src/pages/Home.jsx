import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api, whatsappLink } from '../api.js'
import { useCatalog } from '../catalog.jsx'
import Banner from '../components/Banner.jsx'
import CategoryTree from '../components/CategoryTree.jsx'
import ProductCard, { CardSkeleton } from '../components/ProductCard.jsx'
import PoemOrderForm from '../components/PoemOrderForm.jsx'
import WhyUs from '../components/WhyUs.jsx'
import Dino from '../components/Dino.jsx'
import { catLink } from '../components/Header.jsx'
import { ArrowIcon, ChatIcon, CloseIcon, FilterIcon, SearchIcon } from '../components/Icons.jsx'

const TYPES = [
  { value: '', label: 'ყველა' },
  { value: 'book', label: 'ზღაპრები' },
  { value: 'poem', label: 'ლექსები' },
]
const PRICES = [
  { value: '', label: 'ყველა' },
  { value: 'free', label: 'უფასო' },
  { value: 'paid', label: 'ფასიანი' },
]

function Featured() {
  const [items, setItems] = useState(null)

  useEffect(() => {
    api.products()
      .then((all) => {
        // Featured first, topped up with the newest so the row never looks empty.
        const featured = all.filter((p) => p.featured)
        setItems([...featured, ...all.filter((p) => !p.featured)].slice(0, 5))
      })
      .catch(() => setItems([]))
  }, [])

  if (items && items.length === 0) return null
  return (
    <section className="wrap section">
      <div className="section-head">
        <div>
          <span className="eyebrow">რჩეული</span>
          <h2>ჩვენი საყვარელი ისტორიები</h2>
        </div>
        <Link className="see-all" to="/#products">ყველა →</Link>
      </div>
      <div className="rail">
        {items
          ? items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
          : Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />)}
      </div>
    </section>
  )
}

function CategoryTiles({ tree }) {
  if (!tree.length) return null
  return (
    <section id="categories" className="wrap section">
      <div className="section-head">
        <div>
          <span className="eyebrow">კატეგორიები</span>
          <h2>აირჩიე თავგადასავალი</h2>
        </div>
      </div>
      <div className="rail cat-tiles">
        {tree.map((node, i) => (
          <Link key={node.id} to={catLink(node.id)} className={`cat-tile t${i % 3}`}>
            <span className="arrow"><ArrowIcon /></span>
            <span className="name">{node.name}</span>
            <span className="sub">
              {node.children.length ? node.children.map((c) => c.name).slice(0, 3).join(' · ') : 'ნახე ყველა'}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const { tree, byId } = useCatalog()
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState(null)
  const [error, setError] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [query, setQuery] = useState(params.get('q') || '')

  const type = params.get('type') || ''
  const price = params.get('price') || ''
  const sort = params.get('sort') || ''
  const q = params.get('q') || ''
  const catParam = params.get('cat') || ''
  const selected = useMemo(() => new Set(catParam.split(',').filter(Boolean)), [catParam])
  const filterCount = selected.size + (type ? 1 : 0) + (price ? 1 : 0)

  function update(changes) {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(changes)) v ? next.set(k, v) : next.delete(k)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  function clearAll() {
    setQuery('')
    setParams({}, { replace: true, preventScrollReset: true })
  }

  // Keep the box in sync when navigation changes the URL (e.g. header search).
  useEffect(() => { setQuery(q) }, [q])

  // Debounce the search box into the URL.
  useEffect(() => {
    const t = setTimeout(() => { if (query.trim() !== q) update({ q: query.trim() }) }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    let cancelled = false
    setError('')
    api.products({ type, price, sort, q, categories: catParam })
      .then((data) => { if (!cancelled) setProducts(data) })
      .catch((e) => { if (!cancelled) { setProducts([]); setError(e.message) } })
    return () => { cancelled = true }
  }, [type, price, sort, q, catParam])

  useEffect(() => {
    document.body.classList.toggle('lock', filtersOpen)
    return () => document.body.classList.remove('lock')
  }, [filtersOpen])

  const hasFilters = filterCount > 0 || q

  return (
    <>
      <Banner />
      <Featured />
      <CategoryTiles tree={tree} />

      <section id="products" className="wrap section">
        <div className="section-head">
          <div>
            <span className="eyebrow">კატალოგი</span>
            <h2>ყველა წიგნი და ლექსი</h2>
          </div>
        </div>

        <div className="catalog">
          {filtersOpen && <div className="backdrop" onClick={() => setFiltersOpen(false)} />}
          <aside className={`filters${filtersOpen ? ' open' : ''}`} aria-label="ფილტრები">
            <div className="sheet-handle sheet-only" />
            <div className="filters-head sheet-only">
              <h3>ფილტრები</h3>
              <button className="icon-btn" aria-label="დახურვა" onClick={() => setFiltersOpen(false)}><CloseIcon /></button>
            </div>
            <div className="filter-group">
              <h4>კატეგორიები</h4>
              {tree.length
                ? <CategoryTree tree={tree} selected={selected} onChange={(next) => update({ cat: [...next].join(',') })} />
                : <p className="muted">კატეგორიები ჯერ არ არის</p>}
            </div>
            <div className="filter-group">
              <h4>ტიპი</h4>
              <div className="options">
                {TYPES.map((t) => (
                  <label key={t.value} className="option">
                    <input type="radio" name="type" checked={type === t.value} onChange={() => update({ type: t.value })} />
                    <span>{t.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <h4>ფასი</h4>
              <div className="options">
                {PRICES.map((p) => (
                  <label key={p.value} className="option">
                    <input type="radio" name="price" checked={price === p.value} onChange={() => update({ price: p.value })} />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="filters-actions sheet-only">
              <button className="btn ghost" type="button" onClick={clearAll}>გასუფთავება</button>
              <button className="btn" type="button" onClick={() => setFiltersOpen(false)}>
                ნახე შედეგები{products ? ` (${products.length})` : ''}
              </button>
            </div>
          </aside>

          <div>
            <div className="toolbar">
              <div className="search-form">
                <SearchIcon />
                <input
                  className="input"
                  type="search"
                  placeholder="მოძებნე სათაურით…"
                  aria-label="ძებნა კატალოგში"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <select className="input" aria-label="დალაგება" value={sort} onChange={(e) => update({ sort: e.target.value })}>
                <option value="">რჩეული</option>
                <option value="price_asc">ფასი: ზრდადობით</option>
                <option value="price_desc">ფასი: კლებადობით</option>
              </select>
              <button className="btn light filters-toggle" type="button" onClick={() => setFiltersOpen(true)}>
                <FilterIcon /> ფილტრები {filterCount > 0 && <span className="count">{filterCount}</span>}
              </button>
            </div>

            {hasFilters && (
              <div className="active-filters">
                {[...selected].map((id) => byId.get(id) && (
                  <button key={id} onClick={() => update({ cat: [...selected].filter((s) => s !== id).join(',') })}>
                    {byId.get(id).name} ✕
                  </button>
                ))}
                {type && <button onClick={() => update({ type: '' })}>{TYPES.find((t) => t.value === type)?.label} ✕</button>}
                {price && <button onClick={() => update({ price: '' })}>{PRICES.find((p) => p.value === price)?.label} ✕</button>}
                {q && <button onClick={() => { setQuery(''); update({ q: '' }) }}>„{q}“ ✕</button>}
                <button className="clear" onClick={clearAll}>გასუფთავება</button>
              </div>
            )}

            {products && <div className="result-line muted">{products.length} შედეგი</div>}
            {error && <p className="notice error">{error}</p>}

            {products === null ? (
              <div className="grid">{Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}</div>
            ) : products.length === 0 ? (
              <div className="empty">
                <Dino kind="bronto" className="dino-empty" />
                <p>ვერაფერი მოიძებნა. სცადე სხვა ფილტრი.</p>
                {hasFilters && <button className="btn" onClick={clearAll}>ფილტრების გასუფთავება</button>}
              </div>
            ) : (
              <div className="grid">
                {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      <WhyUs />

      <section id="order" className="wrap section">
        <div className="section-head">
          <div>
            <span className="eyebrow">ინდივიდუალური შეკვეთა</span>
            <h2>შეუკვეთე შენი ლექსი ✨</h2>
          </div>
        </div>
        <PoemOrderForm />
      </section>

      <section id="about" className="wrap section">
        <div className="panel about">
          <div>
            <span className="eyebrow">ჩვენს შესახებ</span>
            <h2>პატარა ზღაპრული სივრცე</h2>
            <p>„ჯადოსნური ბუმბული“ აერთიანებს ბავშვებისთვის შექმნილ ორიგინალურ ისტორიებსა და ლექსებს.</p>
            <p style={{ marginBottom: 0 }}>გვჯერა, რომ ზღაპრებს შეუძლიათ ბავშვებს ასწავლონ სიკეთე, მზრუნველობა, მეგობრობა და სიყვარული.</p>
          </div>
          <blockquote>„ჩვენი მიზანია, თითოეულ პატარა მკითხველს ჯადოსნური სამყარო ვაჩუქოთ.“</blockquote>
        </div>
      </section>

      <section id="contact" className="wrap section">
        <div className="contact-card">
          <h2>დაგვიკავშირდი 💌</h2>
          <p>ზღაპრების შეძენისა და ლექსების შეკვეთისთვის მოგვწერე WhatsApp-ზე.</p>
          <a className="btn gold" href={whatsappLink()} target="_blank" rel="noreferrer"><ChatIcon /> მოგვწერე WhatsApp-ზე</a>
        </div>
      </section>
    </>
  )
}
