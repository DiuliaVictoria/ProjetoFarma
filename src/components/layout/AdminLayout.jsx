import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminNotifications from './AdminNotifications.jsx'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'

function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="admin-layout">
      <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      <div className="admin-layout__main">
        <Header admin menuOpen={menuOpen} onMenuClick={() => setMenuOpen((open) => !open)} />
        <main className="admin-content"><AdminNotifications /><Outlet /></main>
      </div>
    </div>
  )
}

export default AdminLayout
