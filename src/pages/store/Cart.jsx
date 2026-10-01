import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import CartItem from '../../components/store/CartItem.jsx'
import CartSummary from '../../components/store/CartSummary.jsx'
import EmptyCart from '../../components/store/EmptyCart.jsx'
import useCart from '../../hooks/useCart.js'

function Cart() {
  const {
    items,
    totalItems,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  if (!items.length) {
    return (
      <div className="store-cart-page">
        <div className="store-cart-heading">
          <span className="eyebrow">SEU CUIDADO, NO SEU TEMPO</span>
          <h1>Minha sacola</h1>
          <p>Confira com calma os itens que você escolheu.</p>
        </div>
        <EmptyCart />
      </div>
    )
  }

  return (
    <div className="store-cart-page">
      <div className="store-cart-heading">
        <span className="eyebrow">SEU CUIDADO, NO SEU TEMPO</span>
        <h1>Minha sacola</h1>
        <p>{totalItems} {totalItems === 1 ? 'item escolhido' : 'itens escolhidos'} para o seu cuidado.</p>
      </div>

      <div className="store-cart-layout">
        <section className="store-cart-items card" aria-label="Produtos na sacola">
          {items.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeFromCart}
            />
          ))}
          <Link className="store-cart-continue" to="/catalogo">
            <ArrowRight size={14} /> Continuar comprando
          </Link>
        </section>
        <CartSummary totalItems={totalItems} subtotal={subtotal} onClear={clearCart} />
      </div>
    </div>
  )
}

export default Cart
