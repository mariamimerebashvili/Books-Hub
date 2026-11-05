import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, formatPrice, pdfUrl, whatsappLink } from '../api.js'
import { TYPE_LABELS, useCatalog } from '../catalog.jsx'
import ProductCard, { Cover } from '../components/ProductCard.jsx'
import { catLink } from '../components/Header.jsx'
import { ChatIcon } from '../components/Icons.jsx'

function categoryPath(byId, id) {
  const path = []
  let current = byId.get(id)
  while (current && path.length < 10) {
    path.unshift(current)
    current = byId.get(current.parent_id)
  }
  return path
}

function BuyButton({ product }) {
  if (!(product.price > 0)) {
    return product.has_pdf
      ? <a className="btn" href={pdfUrl(product.id)}>ჩამოტვირთე PDF</a>
      : product.type === 'poem' && product.content
        ? <a className="btn" href="#poem">წაიკითხე ლექსი</a>
        : null
  }
  return (
    <a className="btn" href={whatsappLink(`გამარჯობა, მინდა „${product.title}“-ის შეძენა`)} target="_blank" rel="noreferrer">
      <ChatIcon /> შეიძინე WhatsApp-ით
    </a>
  )
}

export default function ProductPage() {
  const { id } = useParams()
  const { byId } = useCatalog()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setProduct(null)
    setError('')
    api.product(id)
      .then((p) => {
        if (cancelled) return
        setProduct(p)
        document.title = `${p.title} — ჯადოსნური ბუმბული`
        return api.products(p.category_id ? { categories: p.category_id } : { type: p.type })
      })
      .then((list) => { if (!cancelled && list) setRelated(list.filter((x) => x.id !== id).slice(0, 4)) })
      .catch((e) => { if (!cancelled) setError(e.message) })
    return () => { cancelled = true; document.title = 'ჯადოსნური ბუმბული' }
  }, [id])

  if (error) {
    return (
      <div className="wrap section">
        <div className="empty">
          <div className="icon">📕</div>
          <p>{error}</p>
          <Link className="btn" to="/">მთავარზე დაბრუნება</Link>
        </div>
      </div>
    )
  }
  if (!product) {
    return (
      <div className="wrap section">
        <div className="product">
          <div className="product-cover card skeleton" style={{ minHeight: 320 }} />
          <div><div className="sk-line" style={{ width: '70%', height: 28 }} /><div className="sk-line" style={{ width: '40%', marginTop: 14 }} /></div>
        </div>
      </div>
    )
  }

  const path = categoryPath(byId, product.category_id)
  const isFree = !(product.price > 0)
  const facts = [
    ['ტიპი', TYPE_LABELS[product.type]],
    product.pages && ['გვერდები', product.pages],
    product.age && ['ასაკი', product.age],
    product.has_pdf && ['ფორმატი', 'PDF'],
  ].filter(Boolean)

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="ნავიგაცია">
        <Link to="/">მთავარი</Link>
        {path.map((c) => <span key={c.id}>/ <Link to={catLink(c.id)}>{c.name}</Link></span>)}
        <span>/ {product.title}</span>
      </nav>

      <article className="product">
        <div className="product-cover"><Cover product={product} /></div>
        <div className="product-info">
          {product.featured && <span className="chip" style={{ marginBottom: 10 }}>★ რჩეული</span>}
          <h1>{product.title}</h1>
          <div className="product-price">{formatPrice(product.price)}</div>
          <div className="product-facts">
            {facts.map(([label, value]) => (
              <div className="fact" key={label}><small>{label}</small><strong>{value}</strong></div>
            ))}
          </div>
          {product.description && <p className="product-desc">{product.description}</p>}
          <div className="product-actions">
            <BuyButton product={product} />
            <Link className="btn ghost" to={`/?type=${product.type}#products`}>
              სხვა {product.type === 'poem' ? 'ლექსები' : 'ზღაპრები'}
            </Link>
          </div>
          {!isFree && product.has_pdf && (
            <p className="note">📄 შეძენის შემდეგ PDF ვერსიას WhatsApp-ზე გამოგიგზავნით.</p>
          )}
        </div>
      </article>

      {product.type === 'poem' && product.content && isFree && (
        <section id="poem" className="section">
          <div className="poem-text">{product.content}</div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section">
          <div className="section-head">
            <div><span className="eyebrow">მსგავსი</span><h2>შეიძლება მოგეწონოს</h2></div>
          </div>
          <div className="rail">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      <div className="buy-bar">
        <span className="product-price">{formatPrice(product.price)}</span>
        <BuyButton product={product} />
      </div>
    </div>
  )
}
