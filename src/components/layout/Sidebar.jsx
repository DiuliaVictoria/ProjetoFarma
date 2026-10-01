import { ClipboardList, LayoutDashboard, Package, Pill, Store } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import Brand from '../common/Brand.jsx'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/produtos', label: 'Produtos', icon: Pill },
  { to: '/admin/estoque', label: 'Estoque', icon: Package },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ClipboardList },
]

function Sidebar({ open = false, onNavigate }) {
  return (
    <>
      {open && <button className="sidebar-backdrop" onClick={onNavigate} aria-label="Fechar menu" />}
      <aside className={`sidebar${open ? ' sidebar--open' : ''}`} id="admin-sidebar">
        <div className="sidebar__brand"><Brand /><span className="sidebar__tag">ADMIN</span></div>
        <div className="sidebar__section-label">MENU PRINCIPAL</div>
        <nav className="sidebar__nav" aria-label="Menu administrativo">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={onNavigate} className={({ isActive }) => `sidebar__link${isActive ? ' is-active' : ''}`}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
              {label === 'Estoque' && <span className="sidebar__dot" />}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__bottom">
          <div className="sidebar__help">
            <span className="sidebar__help-icon"><Store size={17} /></span>
            <div><strong>Sua farmácia</strong><span>Unidade principal</span></div>
          </div>
          <Link className="sidebar__store-link" to="/"><span>Visualizar loja</span><Store size={15} /></Link>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
