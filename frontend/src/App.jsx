import { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { CatalogProvider } from './catalog.jsx'
import SiteLayout from './components/SiteLayout.jsx'
import Home from './pages/Home.jsx'
import ProductPage from './pages/ProductPage.jsx'
import NotFound from './pages/NotFound.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import AdminLogin from './admin/AdminLogin.jsx'
import AdminProducts from './admin/AdminProducts.jsx'
import AdminProductForm from './admin/AdminProductForm.jsx'
import AdminCategories from './admin/AdminCategories.jsx'
import AdminBanners from './admin/AdminBanners.jsx'

// Scrolls to #hash targets on every navigation that has one, and to the top only
// when the page itself changes (filter updates on the same page keep the position).
function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  const lastPath = useRef(pathname)
  useEffect(() => {
    if (hash) {
      // Wait a frame so the target section exists after route changes.
      const id = decodeURIComponent(hash.slice(1))
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }))
    } else if (lastPath.current !== pathname) {
      window.scrollTo(0, 0)
    }
    lastPath.current = pathname
  }, [pathname, hash, key])
  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id" element={<AdminProductForm />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="banners" element={<AdminBanners />} />
        </Route>
        <Route element={<CatalogProvider><SiteLayout /></CatalogProvider>}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
