import { Link } from 'react-router-dom'
import { fileUrl, formatPrice } from '../api.js'
import { TYPE_LABELS } from '../catalog.jsx'
import { ArrowIcon } from './Icons.jsx'

export function Cover({ product }) {
  return (
    <div className="cover">
      {product.cover_url ? (
        <img src={fileUrl(product.cover_url)} alt={product.title} loading="lazy" />
      ) : (
        <div className={`cover-placeholder ${product.type}`}>
          <span className="icon" aria-hidden="true">{product.type === 'poem' ? '🪶' : '📖'}</span>
          {product.title}
        </div>
      )}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="card skeleton" aria-hidden="true">
      <div className="cover" />
      <div className="card-body">
        <div className="sk-line" style={{ width: '80%' }} />
        <div className="sk-line" style={{ width: '50%', marginTop: 6 }} />
      </div>
    </div>
  )
}

export default function ProductCard({ product, index = 0 }) {
  const meta = [product.pages && `${product.pages} გვერდი`, product.age].filter(Boolean).join(' • ')
  return (
    <Link to={`/product/${product.id}`} className="card" style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}>
      <div className="card-badges">
        <span className="chip cream">{TYPE_LABELS[product.type]}</span>
        {product.featured && <span className="chip star" title="რჩეული" aria-label="რჩეული">★</span>}
      </div>
      <Cover product={product} />
      <div className="card-body">
        <h3 className="card-title">{product.title}</h3>
        {meta && <div className="card-meta">{meta}</div>}
        <div className="card-foot">
          <span className="price">{formatPrice(product.price)}</span>
          <span className="card-go" aria-hidden="true"><ArrowIcon /></span>
        </div>
      </div>
    </Link>
  )
}
