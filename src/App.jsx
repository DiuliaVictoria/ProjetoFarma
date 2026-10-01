import { BrowserRouter } from 'react-router-dom'
import { ProductProvider } from './context/ProductContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ProductProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </ProductProvider>
    </BrowserRouter>
  )
}

export default App
