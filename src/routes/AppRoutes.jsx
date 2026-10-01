import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import StoreLayout from '../components/layout/StoreLayout.jsx'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import AdminOrders from '../pages/admin/AdminOrders.jsx'
import AdminProducts from '../pages/admin/AdminProducts.jsx'
import AdminStock from '../pages/admin/AdminStock.jsx'
import AdminProductForm from '../pages/admin/AdminProductForm.jsx'
import ProductDetail from '../pages/store/ProductDetail.jsx'
import Cart from '../pages/store/Cart.jsx'
import Catalog from '../pages/store/Catalog.jsx'
import Checkout from '../pages/store/Checkout.jsx'
import Home from '../pages/store/Home.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/produto/:id" element={<ProductDetail />} />
        <Route path="/carrinho" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="produtos">
          <Route index element={<AdminProducts />} />
          <Route path="novo" element={<AdminProductForm />} />
          <Route path="editar/:id" element={<AdminProductForm />} />
        </Route>
        <Route path="estoque" element={<AdminStock />} />
        <Route path="pedidos" element={<AdminOrders />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
