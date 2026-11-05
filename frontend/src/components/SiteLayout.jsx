import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import DinoBackdrop from './DinoBackdrop.jsx'

export default function SiteLayout() {
  return (
    <div className="site">
      <DinoBackdrop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
