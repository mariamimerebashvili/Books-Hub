import { Link } from 'react-router-dom'
import { whatsappLink } from '../api.js'
import { useCatalog } from '../catalog.jsx'
import { NAV, catLink } from './Header.jsx'
import { ChatIcon } from './Icons.jsx'

export default function Footer() {
  const { tree } = useCatalog()
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <div className="brand-name">ჯადოსნური ბუმბული</div>
          <p style={{ opacity: 0.8, maxWidth: '36ch' }}>
            ზღაპრები და ლექსები, შექმნილი სიყვარულით პატარა მკითხველებისთვის.
          </p>
          <p style={{ opacity: 0.8, margin: 0 }}>ავტორი და დამფუძნებელი — <strong>ლილი თამაზაშვილი</strong></p>
        </div>
        <div>
          <h4>ნავიგაცია</h4>
          <ul>{NAV.map((n) => <li key={n.to}><Link to={n.to}>{n.label}</Link></li>)}</ul>
        </div>
        {tree.length > 0 && (
          <div>
            <h4>კატეგორიები</h4>
            <ul>{tree.map((c) => <li key={c.id}><Link to={catLink(c.id)}>{c.name}</Link></li>)}</ul>
          </div>
        )}
        <div>
          <h4>კონტაქტი</h4>
          <a className="btn gold sm" href={whatsappLink()} target="_blank" rel="noreferrer"><ChatIcon /> WhatsApp</a>
        </div>
      </div>
      <div className="wrap footer-bottom">
        © {new Date().getFullYear()} ჯადოსნური ბუმბული. ყველა უფლება დაცულია.
      </div>
    </footer>
  )
}
