import { useEffect, useState } from 'react'
import { adminApi, fileUrl } from '../api.js'

const EMPTY = { id: null, title: '', subtitle: '', button_text: '', link: '', sort: 0, active: true, image_url: null }

export default function AdminBanners() {
  const [banners, setBanners] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [image, setImage] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = () => adminApi.banners().then(setBanners).catch((e) => setError(e.message))
  useEffect(() => { load() }, [])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const preview = image ? URL.createObjectURL(image) : !removeImage && form.image_url ? fileUrl(form.image_url) : ''

  function reset() {
    setForm(EMPTY)
    setImage(null)
    setRemoveImage(false)
  }

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const data = new FormData()
    for (const k of ['title', 'subtitle', 'button_text', 'link', 'sort', 'active']) data.append(k, String(form[k]))
    if (image) data.append('image', image)
    else if (removeImage) data.append('remove_image', 'true')
    try {
      if (form.id) await adminApi.updateBanner(form.id, data)
      else await adminApi.createBanner(data)
      reset()
      e.target.reset()
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function remove(b) {
    if (!confirm(`წავშალო ბანერი „${b.title || 'უსათაურო'}“?`)) return
    try {
      await adminApi.deleteBanner(b.id)
      if (form.id === b.id) reset()
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <div className="admin-head"><h1 style={{ margin: 0 }}>ბანერები</h1></div>
      <p className="muted">აქტიური ბანერები ჩანს მთავარ გვერდზე ჰედერის ქვეშ. რამდენიმე ბანერი ავტომატურად იცვლება.</p>
      {error && <p className="notice error">{error}</p>}

      <form className="admin-card form-grid" onSubmit={submit} style={{ marginBottom: 24 }}>
        <h3 className="full">{form.id ? 'ბანერის რედაქტირება' : 'ახალი ბანერი'}</h3>
        <label className="field full">
          <span>სათაური</span>
          <input value={form.title} onChange={set('title')} />
        </label>
        <label className="field full">
          <span>ტექსტი</span>
          <textarea style={{ minHeight: 70 }} value={form.subtitle} onChange={set('subtitle')} />
        </label>
        <label className="field">
          <span>ღილაკის ტექსტი</span>
          <input value={form.button_text} onChange={set('button_text')} placeholder="მაგ: აღმოაჩინე ზღაპრები" />
        </label>
        <label className="field">
          <span>ბმული</span>
          <input value={form.link} onChange={set('link')} placeholder="/product/... ან https://..." />
        </label>
        <label className="field">
          <span>რიგითობა</span>
          <input type="number" value={form.sort} onChange={set('sort')} />
        </label>
        <div className="field" style={{ alignContent: 'end' }}>
          <label className="check"><input type="checkbox" checked={form.active} onChange={set('active')} /> აქტიური</label>
        </div>
        <div className="field full">
          <span>სურათი</span>
          <div className="file-box">
            {preview && <img src={preview} alt="" />}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => { setImage(e.target.files[0] || null); setRemoveImage(false) }} />
            {!image && form.image_url && (
              <label className="check"><input type="checkbox" checked={removeImage} onChange={(e) => setRemoveImage(e.target.checked)} /> წაშლა</label>
            )}
          </div>
        </div>
        <div className="full" style={{ display: 'flex', gap: 10 }}>
          <button className="btn" disabled={busy}>{busy ? 'ინახება…' : form.id ? 'შენახვა' : 'დამატება'}</button>
          {form.id && <button type="button" className="btn ghost" onClick={reset}>გაუქმება</button>}
        </div>
      </form>

      <div className="table-wrap">
        <table>
          <thead><tr><th></th><th>სათაური</th><th>ბმული</th><th>რიგი</th><th>სტატუსი</th><th></th></tr></thead>
          <tbody>
            {banners.length === 0 && <tr><td colSpan={6} className="muted center">ბანერები ჯერ არ არის</td></tr>}
            {banners.map((b) => (
              <tr key={b.id}>
                <td>{b.image_url ? <img className="thumb" src={fileUrl(b.image_url)} alt="" /> : <div className="thumb" />}</td>
                <td><strong>{b.title || 'უსათაურო'}</strong></td>
                <td className="muted">{b.link || '—'}</td>
                <td>{b.sort}</td>
                <td>{b.active ? <span className="chip free">აქტიური</span> : <span className="chip muted">გამორთული</span>}</td>
                <td>
                  <div className="row-actions">
                    <button className="btn ghost sm" onClick={() => { setForm({ ...EMPTY, ...b }); setImage(null); setRemoveImage(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>რედაქტირება</button>
                    <button className="btn danger sm" onClick={() => remove(b)}>წაშლა</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
