import { useState } from 'react'
import { whatsappLink } from '../api.js'
import { ChatIcon } from './Icons.jsx'

const AGES = ['0–2 წელი', '2–4 წელი', '4–6 წელი', '6+ წელი']
const SIZES = [
  { id: 'one', label: 'ერთი კუპლეტი', price: 5 },
  { id: 'two', label: 'ორი კუპლეტი', price: 10 },
]
const STYLES = ['🎈 მხიარული', '🌙 ძილისპირული', '🎂 დაბადების დღისთვის']

export default function PoemOrderForm() {
  const [form, setForm] = useState({ topic: '', name: '', age: '', size: 'one', style: STYLES[0], wishes: '' })
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const size = SIZES.find((s) => s.id === form.size)

  function submit(e) {
    e.preventDefault()
    const lines = [
      'გამარჯობა! მინდა შევუკვეთო ლექსი ✨',
      `თემა: ${form.topic}`,
      form.name && `ბავშვის სახელი: ${form.name}`,
      `ასაკი: ${form.age}`,
      `მოცულობა: ${size.label} (${size.price} ₾)`,
      `სტილი: ${form.style}`,
      form.wishes && `დამატებითი სურვილები: ${form.wishes}`,
    ].filter(Boolean)
    window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener')
  }

  return (
    <form className="panel order" onSubmit={submit}>
      <p className="muted full" style={{ marginTop: 0 }}>
        მოგვიყევი, რაზე გინდა ლექსი და ჩვენ მას შენი პატარასთვის მოვარგებთ.
      </p>
      <label className="field full">
        <span>რაზე გინდა ლექსი? *</span>
        <textarea required value={form.topic} onChange={set('topic')} placeholder="მაგალითად: ლექსი პატარა ანაზე, რომელსაც უყვარს პეპლები…" />
      </label>
      <label className="field">
        <span>ბავშვის სახელი</span>
        <input value={form.name} onChange={set('name')} />
      </label>
      <label className="field">
        <span>ბავშვის ასაკი *</span>
        <select required value={form.age} onChange={set('age')}>
          <option value="">აირჩიე ასაკი</option>
          {AGES.map((a) => <option key={a}>{a}</option>)}
        </select>
      </label>
      <fieldset className="field full">
        <span>ლექსის მოცულობა *</span>
        <div className="options">
          {SIZES.map((s) => (
            <label key={s.id} className="option">
              <input type="radio" name="size" value={s.id} checked={form.size === s.id} onChange={set('size')} />
              <span>{s.label} · <strong>{s.price} ₾</strong></span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="field full">
        <span>ლექსის სტილი</span>
        <div className="options">
          {STYLES.map((s) => (
            <label key={s} className="option">
              <input type="radio" name="style" value={s} checked={form.style === s} onChange={set('style')} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="field full">
        <span>დამატებითი სურვილები</span>
        <textarea value={form.wishes} onChange={set('wishes')} style={{ minHeight: 80 }} />
      </label>
      <div className="full">
        <div className="order-note">
          <span>⏰ ლექსს მიიღებ შეკვეთის დადასტურებიდან 2 საათში.</span>
          <span>💌 დეტალები WhatsApp-ზე გამოგეგზავნება.</span>
        </div>
        <button className="btn block" type="submit"><ChatIcon /> შეუკვეთე WhatsApp-ზე · {size.price} ₾</button>
      </div>
    </form>
  )
}
