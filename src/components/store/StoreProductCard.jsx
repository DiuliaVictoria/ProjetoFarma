import { ArrowUpRight, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import useCart from '../../hooks/useCart.js'
import { getProductStockStatus } from '../../data/mockData.js'
import ProductImage from '../products/ProductImage.jsx'

function StoreProductCard({ product }) {
  const { addToCart } = useCart()
  const isAvailable = getProductStockStatus(product) !== 'empty'

  return (
    <article className="store-product-card">
      <Link className="store-product-card__visual" to={`/produto/${encodeURIComponent(product.id)}`} aria-label={`Ver ${product.name}`}>
        <ProductImage src={product.image} alt={product.name} className="store-product-card__image" />
        <span className={`store-product-card__availability${isAvailable ? '' : ' store-product-card__availability--empty'}`}>
          <i />{isAvailable ? 'Disponível' : 'Indisponível'}
        </span>
        <span className="store-product-card__open"><ArrowUpRight size={16} /></span>
      </Link>
      <div className="store-product-card__body">
        <span className="store-product-card__category">{product.category}</span>
        <Link className="store-product-card__name" to={`/produto/${encodeURIComponent(product.id)}`}>{product.name}</Link>
        <p className="store-product-card__description">{product.description || 'Um cuidado pensado para o seu dia a dia.'}</p>
        <div className="store-product-card__purchase">
          <div>
            <strong className="store-product-card__price">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
            <span className={`store-product-card__stock${isAvailable ? '' : ' store-product-card__stock--empty'}`}>
              {isAvailable ? `${product.quantity} ${product.quantity === 1 ? 'unidade disponível' : 'unidades disponíveis'}` : 'Sem estoque no momento'}
            </span>
          </div>
          <button
            className="store-product-card__add"
            type="button"
            onClick={() => addToCart(product.id)}
            disabled={!isAvailable}
            aria-label={isAvailable ? `Adicionar ${product.name} à sacola` : `${product.name} está sem estoque`}
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default StoreProductCard
