import { useEffect, useState } from 'react'
import { adminApi, buildTree } from '../api.js'
import { categoryOptions } from './CategorySelect.jsx'

function CategoryRow({ node, onEdit, onAddChild, onDelete }) {
  return (
    <li>
      <div className="tree-row">
        <span className="name">{node.name}</span>
        <span className="muted" style={{ fontSize: 13 }}>რიგი: {node.sort}</span>
        <button className="btn ghost sm" onClick={() => onAddChild(node)}>+ ქვეკატეგორია</button>
        <button className="btn ghost sm" onClick={() => onEdit(node)}>რედაქტირება</button>
        <button className="btn danger sm" onClick={() => onDelete(node)}>წაშლა</button>
      </div>
      {node.children.length > 0 && (
        <ul className="tree">
          {node.children.map((c) => (
            <CategoryRow key={c.id} node={c} onEdit={onEdit} onAddChild={onAddChild} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </li>
  )
}

const EMPTY = { id: null, name: '', parent_id: '', sort: 0 }

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = () => adminApi.categories().then(setCategories).catch((e) => setError(e.message))
  useEffect(() => { load() }, [])

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const body = { name: form.name, parent_id: form.parent_id || null, sort: Number(form.sort) || 0 }
    try {
      if (form.id) await adminApi.updateCategory(form.id, body)
      else await adminApi.createCategory(body)
      setForm(EMPTY)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function remove(node) {
    if (!confirm(`წავშალო კატეგორია „${node.name}“? მისი პროდუქტები დარჩება კატეგორიის გარეშე.`)) return
    try {
      await adminApi.deleteCategory(node.id)
      if (form.id === node.id) setForm(EMPTY)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const tree = buildTree(categories)

  return (
    <>
      <div className="admin-head"><h1 style={{ margin: 0 }}>კატეგორიები</h1></div>
      <p className="muted">კატეგორიები ჩანს საიტის ჰედერში და ხისებრ ფილტრში. ქვეკატეგორიები ჩნდება მშობლის ქვეშ.</p>
      {error && <p className="notice error">{error}</p>}

      <form className="admin-card form-grid" onSubmit={submit} style={{ marginBottom: 24 }}>
        <h3 className="full">{form.id ? 'კატეგორიის რედაქტირება' : 'ახალი კატეგორია'}</h3>
        <label className="field">
          <span>სახელი *</span>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className="field">
          <span>მშობელი კატეგორია</span>
          <select value={form.parent_id} onChange={(e) => setForm({ ...form, parent_id: e.target.value })}>
            <option value="">— მთავარი დონე —</option>
            {categoryOptions(categories, form.id)}
          </select>
        </label>
        <label className="field">
          <span>რიგითობა</span>
          <input type="number" value={form.sort} onChange={(e) => setForm({ ...form, sort: e.target.value })} />
        </label>
        <div className="full" style={{ display: 'flex', gap: 10 }}>
          <button className="btn" disabled={busy}>{form.id ? 'შენახვა' : 'დამატება'}</button>
          {(form.id || form.parent_id) && <button type="button" className="btn ghost" onClick={() => setForm(EMPTY)}>გაუქმება</button>}
        </div>
      </form>

      <div className="admin-card cat-admin">
        {tree.length === 0 ? <p className="muted">კატეგორიები ჯერ არ არის.</p> : (
          <ul className="tree">
            {tree.map((n) => (
              <CategoryRow
                key={n.id}
                node={n}
                onEdit={(c) => setForm({ id: c.id, name: c.name, parent_id: c.parent_id || '', sort: c.sort ?? 0 })}
                onAddChild={(c) => setForm({ ...EMPTY, parent_id: c.id })}
                onDelete={remove}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
