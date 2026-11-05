import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi, fileUrl, formatPrice } from '../api.js'
import { TYPE_LABELS } from '../catalog.jsx'

export default function AdminProducts() {
  const [products, setProducts] = useState(null)
  const [categories, setCategories] = useState([])
  const [filter, setFilter] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([adminApi.products(), adminApi.categories()])
      .then(([p, c]) => { setProducts(p); setCategories(c) })
      .catch((e) => setError(e.message))
  }, [])

  const catName = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories])
  const visible = (products || []).filter((p) => !filter || p.type === filter)

  async function remove(p) {
    if (!confirm(`წავშალო „${p.title}“? ეს მოქმედება შეუქცევადია.`)) return
    try {
      await adminApi.deleteProduct(p.id)
      setProducts((list) => list.filter((x) => x.id !== p.id))
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      <div className="admin-head">
        <h1 style={{ margin: 0 }}>პროდუქტები</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <select className="input" style={{ width: 'auto' }} value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="ტიპი">
            <option value="">ყველა ტიპი</option>
            <option value="book">ზღაპრები / წიგნები</option>
            <option value="poem">ლექსები</option>
          </select>
          <Link className="btn" to="/admin/products/new">+ დამატება</Link>
        </div>
      </div>
      {error && <p className="notice error">{error}</p>}
      {products === null ? <p className="muted">იტვირთება…</p> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th></th><th>სათაური</th><th>ტიპი</th><th>კატეგორია</th><th>ფასი</th><th>PDF</th><th>სტატუსი</th><th></th></tr>
            </thead>
            <tbody>
              {visible.length === 0 && <tr><td colSpan={8} className="muted center">ჯერ არაფერია დამატებული</td></tr>}
              {visible.map((p) => (
                <tr key={p.id}>
                  <td>{p.cover_url ? <img className="thumb" src={fileUrl(p.cover_url)} alt="" /> : <div className="thumb" />}</td>
                  <td><Link to={`/admin/products/${p.id}`}><strong>{p.title}</strong></Link></td>
                  <td>{TYPE_LABELS[p.type]}</td>
                  <td>{catName.get(p.category_id) || <span className="muted">—</span>}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>{p.has_pdf ? '✓' : <span className="muted">—</span>}</td>
                  <td>
                    {p.published ? <span className="chip free">გამოქვეყნებული</span> : <span className="chip muted">დამალული</span>}
                    {p.featured && <> <span className="chip">რჩეული</span></>}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link className="btn ghost sm" to={`/admin/products/${p.id}`}>რედაქტირება</Link>
                      <button className="btn danger sm" onClick={() => remove(p)}>წაშლა</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
