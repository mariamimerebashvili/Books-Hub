import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminApi, fileUrl } from '../api.js'
import { categoryOptions } from './CategorySelect.jsx'

const EMPTY = {
  type: 'book', title: '', description: '', content: '', price: '', category_id: '',
  pages: '', age: '', featured: false, published: true,
}

export default function AdminProductForm() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [existing, setExisting] = useState(null)
  const [categories, setCategories] = useState([])
  const [cover, setCover] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [removeCover, setRemoveCover] = useState(false)
  const [removePdf, setRemovePdf] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(!isNew)

  useEffect(() => {
    adminApi.categories().then(setCategories).catch((e) => setError(e.message))
    if (isNew) return
    adminApi.product(id)
      .then((p) => {
        setExisting(p)
        setForm({
          ...EMPTY,
          ...Object.fromEntries(Object.keys(EMPTY).map((k) => [k, p[k] ?? EMPTY[k]])),
          price: String(p.price ?? ''),
          pages: p.pages == null ? '' : String(p.pages),
          category_id: p.category_id || '',
        })
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, isNew])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const coverPreview = cover ? URL.createObjectURL(cover) : !removeCover && existing?.cover_url ? fileUrl(existing.cover_url) : ''

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const data = new FormData()
    for (const [k, v] of Object.entries(form)) data.append(k, typeof v === 'boolean' ? String(v) : v)
    if (cover) data.append('cover', cover)
    else if (removeCover) data.append('remove_cover', 'true')
    if (pdf) data.append('pdf', pdf)
    else if (removePdf) data.append('remove_pdf', 'true')
    try {
      if (isNew) await adminApi.createProduct(data)
      else await adminApi.updateProduct(id, data)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  if (loading) return <p className="muted">იტვირთება…</p>

  return (
    <>
      <div className="admin-head">
        <h1 style={{ margin: 0 }}>{isNew ? 'ახალი პროდუქტი' : 'რედაქტირება'}</h1>
        <Link className="btn ghost sm" to="/admin">← უკან</Link>
      </div>
      {error && <p className="notice error">{error}</p>}
      <form className="admin-card form-grid" onSubmit={submit}>
        <label className="field">
          <span>ტიპი *</span>
          <select value={form.type} onChange={set('type')}>
            <option value="book">ზღაპარი / წიგნი</option>
            <option value="poem">ლექსი</option>
          </select>
        </label>
        <label className="field">
          <span>კატეგორია</span>
          <select value={form.category_id} onChange={set('category_id')}>
            <option value="">— კატეგორიის გარეშე —</option>
            {categoryOptions(categories)}
          </select>
        </label>
        <label className="field full">
          <span>სათაური *</span>
          <input required value={form.title} onChange={set('title')} />
        </label>
        <label className="field full">
          <span>აღწერა</span>
          <textarea value={form.description} onChange={set('description')} />
        </label>
        {form.type === 'poem' && (
          <label className="field full">
            <span>ლექსის ტექსტი</span>
            <textarea style={{ minHeight: 200, fontFamily: 'var(--serif)' }} value={form.content} onChange={set('content')} />
            <small className="muted">უფასო ლექსის ტექსტი საიტზე ყველასთვის გამოჩნდება.</small>
          </label>
        )}
        <label className="field">
          <span>ფასი (₾)</span>
          <input type="number" min="0" step="0.01" placeholder="0 = უფასო" value={form.price} onChange={set('price')} />
        </label>
        <label className="field">
          <span>ასაკი</span>
          <input placeholder="მაგ: 2–6 წელი" value={form.age} onChange={set('age')} />
        </label>
        {form.type === 'book' && (
          <label className="field">
            <span>გვერდების რაოდენობა</span>
            <input type="number" min="0" value={form.pages} onChange={set('pages')} />
          </label>
        )}

        <div className="field full">
          <span>ყდის სურათი</span>
          <div className="file-box">
            {coverPreview && <img src={coverPreview} alt="" />}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => { setCover(e.target.files[0] || null); setRemoveCover(false) }} />
            {!cover && existing?.cover_url && (
              <label className="check"><input type="checkbox" checked={removeCover} onChange={(e) => setRemoveCover(e.target.checked)} /> წაშლა</label>
            )}
          </div>
        </div>

        <div className="field full">
          <span>PDF ფაილი</span>
          <div className="file-box">
            {existing?.has_pdf && !pdf && !removePdf && (
              <button type="button" className="btn ghost sm" onClick={() => adminApi.downloadPdf(existing).catch((e) => setError(e.message))}>
                📄 {existing.pdf_name || 'მიმდინარე PDF'}
              </button>
            )}
            <input type="file" accept="application/pdf" onChange={(e) => { setPdf(e.target.files[0] || null); setRemovePdf(false) }} />
            {!pdf && existing?.has_pdf && (
              <label className="check"><input type="checkbox" checked={removePdf} onChange={(e) => setRemovePdf(e.target.checked)} /> წაშლა</label>
            )}
          </div>
          <small className="muted">უფასო პროდუქტის PDF საიტიდან ყველას შეუძლია ჩამოტვირთოს. ფასიანის — მხოლოდ შენ, ადმინ პანელიდან. მაქს. 50 MB.</small>
        </div>

        <div className="full" style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 18 }}>
          <label className="check"><input type="checkbox" checked={form.published} onChange={set('published')} /> გამოქვეყნებული</label>
          <label className="check"><input type="checkbox" checked={form.featured} onChange={set('featured')} /> რჩეული (პირველ რიგში ჩანს)</label>
        </div>

        <div className="full">
          <button className="btn" disabled={busy}>{busy ? 'ინახება…' : 'შენახვა'}</button>
        </div>
      </form>
    </>
  )
}
