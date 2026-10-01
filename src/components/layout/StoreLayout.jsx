import { Outlet } from 'react-router-dom'
import StoreFeedback from '../store/StoreFeedback.jsx'
import Header from './Header.jsx'

function StoreLayout() {
  return (
    <div className="store-layout">
      <div className="announcement"><span>Um cuidado a mais, todos os dias.</span><span className="announcement__detail">A sua saúde é o que nos move</span></div>
      <Header />
      <main><StoreFeedback /><Outlet /></main>
      <footer className="store-footer" id="sobre">
        <div><span className="store-footer__brand">projeto<span>farma</span></span><p>Cuidado próximo, todos os dias.</p></div>
        <span>Uma nova forma de cuidar de você.</span>
      </footer>
    </div>
  )
}

export default StoreLayout
