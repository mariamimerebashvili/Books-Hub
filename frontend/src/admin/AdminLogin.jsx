import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi, auth } from '../api.js'
import Logo from '../components/Logo.jsx'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      auth.token = (await adminApi.login(password)).token
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login">
      <form className="admin-card" onSubmit={submit}>
        <div className="brand" style={{ marginBottom: 18 }}>
          <Logo />
          <span className="brand-name">ადმინ პანელი</span>
        </div>
        {error && <p className="notice error">{error}</p>}
        <label className="field">
          <span>პაროლი</span>
          <input type="password" autoComplete="current-password" required autoFocus value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button className="btn" style={{ width: '100%' }} disabled={busy}>{busy ? 'შესვლა…' : 'შესვლა'}</button>
      </form>
    </div>
  )
}
