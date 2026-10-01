import { Minus, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductImage from '../products/ProductImage.jsx'

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const { product, quantity } = item
  const formatPrice = (price) => price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <article className="store-cart-item">
      <Link to={`/produto/${encodeURIComponent(product.id)}`} className="store-cart-item__image-link">
        <ProductImage src={product.image} alt={product.name} className="store-cart-item__image" />
      </Link>
      <div className="store-cart-item__details">
        <span className="store-cart-item__category">{product.category}</span>
        <Link className="store-cart-item__name" to={`/produto/${encodeURIComponent(product.id)}`}>{product.name}</Link>
        <span className="store-cart-item__availability">
          {product.quantity} {product.quantity === 1 ? 'unidade disponível' : 'unidades disponíveis'}
        </span>
        <span className="store-cart-item__unit-price">Unitário: {formatPrice(product.price)}</span>
      </div>
      <div className="store-cart-item__controls">
        <strong>{formatPrice(product.price * quantity)}</strong>
        <div className="store-quantity-control store-quantity-control--small" aria-label={`Quantidade de ${product.name}`}>
          <button
            type="button"
            onClick={() => onDecrease(product.id)}
            disabled={quantity <= 1}
            aria-label={`Diminuir quantidade de ${product.name}`}
          >
            <Minus size={13} />
          </button>
          <span aria-label={`${quantity} unidades`}>{quantity}</span>
          <button
            type="button"
            onClick={() => onIncrease(product.id)}
            disabled={quantity >= product.quantity}
            aria-label={`Aumentar quantidade de ${product.name}`}
          >
            <Plus size={13} />
          </button>
        </div>
        <button
          className="store-cart-item__remove"
          type="button"
          onClick={() => onRemove(product.id)}
          aria-label={`Remover ${product.name} da sacola`}
        >
          <Trash2 size={13} /> Remover
        </button>
      </div>
    </article>
  )
}

export default CartItem
