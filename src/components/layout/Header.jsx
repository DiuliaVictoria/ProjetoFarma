import { Menu, Search, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import useCart from '../../hooks/useCart.js'
import Brand from '../common/Brand.jsx'

function Header({ admin = false, menuOpen = false, onMenuClick }) {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const { totalItems: cartItemCount } = useCart()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!admin && pathname === '/catalogo') {
      setSearchTerm(new URLSearchParams(search).get('q') ?? '')
    }
  }, [admin, pathname, search])

  function handleStoreSearch(event) {
    event.preventDefault()
    const query = searchTerm.trim()
    navigate(query ? `/catalogo?q=${encodeURIComponent(query)}` : '/catalogo')
  }

  if (admin) {
    const pageTitles = {
      '/admin': 'Dashboard',
      '/admin/estoque': 'Estoque',
      '/admin/pedidos': 'Pedidos',
    }
    const currentPage = pathname.startsWith('/admin/produtos')
      ? 'Produtos'
      : pageTitles[pathname] ?? 'Painel'

    return (
      <header className="admin-header">
        <button className="icon-button admin-header__menu" onClick={onMenuClick} aria-label="Abrir menu" aria-expanded={menuOpen} aria-controls="admin-sidebar">
          <Menu size={20} />
        </button>
        <div className="admin-header__title">{currentPage}</div>
        <label className="admin-search">
          <Search size={16} />
          <input type="search" placeholder="Buscar no painel..." aria-label="Buscar no painel" />
        </label>
        <div className="admin-header__right">
          <span className="admin-header__status"><i /> Dados demonstrativos</span>
          <div className="admin-profile">
            <span className="avatar" aria-label="Administrador">PF</span>
            <span className="admin-profile__name">Administrador</span>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="store-header">
      <div className="store-header__inner">
        <Brand />
        <nav className="store-nav" aria-label="Navegação principal">
          <NavLink to="/" end>Início</NavLink>
          <NavLink to="/catalogo">Catálogo</NavLink>
          <a href="#sobre">Nossa farmácia</a>
        </nav>
        <form className="store-header__search" role="search" onSubmit={handleStoreSearch}>
          <Search size={17} />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar produtos..."
            aria-label="Buscar produtos na loja"
          />
          {searchTerm && <button type="button" onClick={() => setSearchTerm('')} aria-label="Limpar busca">×</button>}
        </form>
        <div className="store-header__actions">
          <Link className="cart-button" to="/carrinho" aria-label={`Minha sacola, ${cartItemCount} ${cartItemCount === 1 ? 'item' : 'itens'}`}><ShoppingBag size={17} /><span className="cart-button__text">Minha sacola</span><span className="cart-count" aria-live="polite">{cartItemCount > 99 ? '99+' : cartItemCount}</span></Link>
        </div>
      </div>
    </header>
  )
}

export default Header
