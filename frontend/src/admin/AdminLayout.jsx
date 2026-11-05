import { useEffect, useState } from 'react'
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { adminApi, auth } from '../api.js'

export default function AdminLayout() {
  const navigate = useNavigate()
  const [status, setStatus] = useState(auth.token ? 'checking' : 'out')

  useEffect(() => {
    if (!auth.token) return
    adminApi.me().then(() => setStatus('in')).catch(() => setStatus('out'))
    const onLogout = () => setStatus('out')
    window.addEventListener('bh:logout', onLogout)
    return () => window.removeEventListener('bh:logout', onLogout)
  }, [])

  if (status === 'out') return <Navigate to="/admin/login" replace />
  if (status === 'checking') return <div className="login muted">იტვირთება…</div>

  function logout() {
    auth.token = null
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="brand-name">ბუმბული · ადმინი</div>
        <NavLink to="/admin" end>პროდუქტები</NavLink>
        <NavLink to="/admin/categories">კატეგორიები</NavLink>
        <NavLink to="/admin/banners">ბანერები</NavLink>
        <div className="spacer" />
        <a href="/" target="_blank" rel="noreferrer">საიტის ნახვა ↗</a>
        <button type="button" onClick={logout}>გასვლა</button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
