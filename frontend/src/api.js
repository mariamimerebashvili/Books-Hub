const BASE = import.meta.env.VITE_API_URL || ''
const TOKEN_KEY = 'bh_admin_token'

export const WHATSAPP = import.meta.env.VITE_WHATSAPP || '995591754877'

export function whatsappLink(text) {
  return `https://wa.me/${WHATSAPP}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

/** Resolves backend-relative URLs (local uploads) against the API host. */
export function fileUrl(url) {
  if (!url) return ''
  return url.startsWith('/') ? `${BASE}${url}` : url
}

export const pdfUrl = (id) => `${BASE}/api/products/${id}/pdf`

export function formatPrice(price) {
  return price > 0 ? `${Number(price).toLocaleString('ka-GE', { maximumFractionDigits: 2 })} ₾` : 'უფასო'
}

export const auth = {
  get token() {
    try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
  },
  set token(v) {
    try { v ? localStorage.setItem(TOKEN_KEY, v) : localStorage.removeItem(TOKEN_KEY) } catch { /* storage unavailable */ }
  },
}

async function request(path, { method = 'GET', body, admin = false } = {}) {
  const headers = {}
  if (admin && auth.token) headers.Authorization = `Bearer ${auth.token}`
  if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json'
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401 && admin) {
      auth.token = null
      window.dispatchEvent(new Event('bh:logout'))
    }
    throw new Error(data.error || 'რაღაც შეცდომა მოხდა')
  }
  return data
}

export const api = {
  categories: () => request('/categories'),
  banners: () => request('/banners'),
  products: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null)).toString()
    return request(`/products${qs ? `?${qs}` : ''}`)
  },
  product: (id) => request(`/products/${id}`),
}

export const adminApi = {
  login: (password) => request('/admin/login', { method: 'POST', body: { password } }),
  me: () => request('/admin/me', { admin: true }),

  categories: () => request('/admin/categories', { admin: true }),
  createCategory: (body) => request('/admin/categories', { method: 'POST', body, admin: true }),
  updateCategory: (id, body) => request(`/admin/categories/${id}`, { method: 'PUT', body, admin: true }),
  deleteCategory: (id) => request(`/admin/categories/${id}`, { method: 'DELETE', admin: true }),

  products: () => request('/admin/products', { admin: true }),
  product: (id) => request(`/admin/products/${id}`, { admin: true }),
  createProduct: (form) => request('/admin/products', { method: 'POST', body: form, admin: true }),
  updateProduct: (id, form) => request(`/admin/products/${id}`, { method: 'PUT', body: form, admin: true }),
  deleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE', admin: true }),

  banners: () => request('/admin/banners', { admin: true }),
  createBanner: (form) => request('/admin/banners', { method: 'POST', body: form, admin: true }),
  updateBanner: (id, form) => request(`/admin/banners/${id}`, { method: 'PUT', body: form, admin: true }),
  deleteBanner: (id) => request(`/admin/banners/${id}`, { method: 'DELETE', admin: true }),

  /** Admin PDF download needs the auth header, so fetch it as a blob. */
  async downloadPdf(product) {
    const res = await fetch(`${BASE}/api/admin/products/${product.id}/pdf`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (!res.ok) throw new Error('ფაილი ვერ ჩამოიტვირთა')
    const url = URL.createObjectURL(await res.blob())
    window.open(url, '_blank', 'noopener')
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  },
}

/** Builds a { parentId: children[] } map and returns top-level nodes. */
export function buildTree(categories) {
  const byParent = new Map()
  for (const c of categories) {
    const key = c.parent_id || null
    if (!byParent.has(key)) byParent.set(key, [])
    byParent.get(key).push(c)
  }
  const attach = (node) => ({ ...node, children: (byParent.get(node.id) || []).map(attach) })
  return (byParent.get(null) || []).map(attach)
}
