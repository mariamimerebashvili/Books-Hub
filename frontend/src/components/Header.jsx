import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { whatsappLink } from '../api.js'
import { useCatalog } from '../catalog.jsx'
import Logo from './Logo.jsx'
import SearchBox from './SearchBox.jsx'
import { CloseIcon, MenuIcon, SearchIcon } from './Icons.jsx'

export const NAV = [
  { to: '/', label: 'მთავარი' },
  { to: '/#categories', label: 'კატეგორიები' },
  { to: '/#about', label: 'ჩვენს შესახებ' },
  { to: '/#contact', label: 'კონტაქტი' },
]

export const catLink = (id) => `/?cat=${id}#products`

const Chevron = () => (
  <svg className="sub-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

function SubItem({ node, activeCat, nested = false }) {
  const hasChildren = node.children.length > 0
  return (
    <li>
      <Link to={catLink(node.id)} className={activeCat === node.id ? 'active' : ''}>
        {node.name}
        {hasChildren && !nested && <Chevron />}
      </Link>
      {hasChildren && (
        <ul className="sub-dropdown">
          {node.children.map((child) => <SubItem key={child.id} node={child} activeCat={activeCat} nested />)}
        </ul>
      )}
    </li>
  )
}

/** Red category bar under the header: "ყველა" + top-level categories with dropdowns. */
function SubHeader() {
  const { tree } = useCatalog()
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  if (!tree.length) return null
  const activeCat = pathname === '/' ? params.get('cat') : null

  return (
    <nav className="sub-header" aria-label="კატეგორიები">
      <div className="wrap sub-inner">
        <ul className="sub-list">
          <li><Link to="/#products" className={pathname === '/' && !activeCat ? 'active' : ''}>ყველა</Link></li>
          {tree.map((node) => <SubItem key={node.id} node={node} activeCat={activeCat} />)}
        </ul>
        <Link to="/#order" className="sub-promo">✨ ინდივიდუალური ლექსი 2 საათში</Link>
      </div>
    </nav>
  )
}

export default function Header() {
  const [drawer, setDrawer] = useState(false)
  const [search, setSearch] = useState(false)
  const { pathname, search: qs, hash } = useLocation()
  const current = `${pathname}${qs}${hash}`
  const close = () => setDrawer(false)

  useEffect(() => {
    document.body.classList.toggle('lock', drawer)
    if (!drawer) return
    const onKey = (e) => e.key === 'Escape' && setDrawer(false)
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.classList.remove('lock') }
  }, [drawer])

  return (
    <header className="site-header">
      <div className="wrap header-bar">
        <Link to="/" className="brand">
          <Logo />
          <span>
            <span className="brand-name">ჯადოსნური ბუმბული</span>
            <span className="brand-tag">ზღაპრები და ლექსები პატარა მკითხველებისთვის</span>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="მთავარი მენიუ">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className={current === item.to ? 'active' : ''}>{item.label}</Link>
          ))}
        </nav>
        <div className="header-search"><SearchBox /></div>
        <button className="icon-btn mobile-only" aria-label="ძებნა" aria-expanded={search} onClick={() => setSearch(!search)}>
          {search ? <CloseIcon /> : <SearchIcon />}
        </button>
        <button className="icon-btn mobile-only" aria-label="მენიუ" aria-expanded={drawer} onClick={() => setDrawer(true)}>
          <MenuIcon />
        </button>
      </div>

      {search && (
        <div className="wrap mobile-search mobile-only">
          <SearchBox autoFocus onDone={() => setSearch(false)} />
        </div>
      )}

      <SubHeader />

      {/* Portal: the header's backdrop-filter would otherwise trap position:fixed children. */}
      {drawer && createPortal(
        <>
          <div className="backdrop" onClick={close} />
          <aside className="drawer" role="dialog" aria-modal="true" aria-label="მენიუ">
            <div className="drawer-head">
              <span className="brand-name">მენიუ</span>
              <button className="icon-btn" aria-label="დახურვა" onClick={close}><CloseIcon /></button>
            </div>
            <nav className="drawer-nav">
              {NAV.map((item) => (
                <Link key={item.to} to={item.to} className={current === item.to ? 'active' : ''} onClick={close}>{item.label}</Link>
              ))}
            </nav>
            <a className="btn gold" href={whatsappLink()} target="_blank" rel="noreferrer" style={{ marginTop: 'auto' }}>
              მოგვწერე WhatsApp-ზე
            </a>
          </aside>
        </>,
        document.body,
      )}
    </header>
  )
}
