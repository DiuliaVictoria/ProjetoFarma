import { ArrowLeft, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StoreEmptyState from '../../components/store/StoreEmptyState.jsx'
import ProductImage from '../../components/products/ProductImage.jsx'
import { useProducts } from '../../context/ProductContext.jsx'
import useCart from '../../hooks/useCart.js'
import { getProductStockStatus } from '../../data/mockData.js'

function ProductDetail() {
  const { id } = useParams()
  const { products } = useProducts()
  const { addToCart } = useCart()
  const product = products.find((item) => item.id === id && item.active)
  const [quantity, setQuantity] = useState(1)
  const isAvailable = Boolean(product && getProductStockStatus(product) !== 'empty')
  const maxQuantity = product ? Math.min(product.quantity, 99) : 1

  useEffect(() => {
    setQuantity(1)
  }, [id])

  if (!product) {
    return (
      <div className="store-product-detail store-product-detail--empty">
        <StoreEmptyState
          title="Produto não encontrado"
          description="Este produto não está disponível na loja."
          actionLabel="Voltar ao catálogo"
        />
      </div>
    )
  }

  function handleQuantityChange(event) {
    const parsed = Number(event.target.value)
    if (Number.isInteger(parsed)) setQuantity(Math.max(1, Math.min(parsed, maxQuantity)))
  }

  return (
    <div className="store-product-detail">
      <Link className="store-detail-back" to="/catalogo"><ArrowLeft size={15} /> Voltar ao catálogo</Link>
      <section className="store-detail-card">
        <ProductImage src={product.image} alt={product.name} className="store-detail-image" />
        <div className="store-detail-copy">
          <span className="store-detail-category">{product.category}</span>
          <h1>{product.name}</h1>
          <span className={`store-detail-availability${isAvailable ? '' : ' store-detail-availability--empty'}`}>
            <i />{isAvailable ? `${product.quantity} ${product.quantity === 1 ? 'unidade disponível' : 'unidades disponíveis'}` : 'Sem estoque no momento'}
          </span>
          <p className="store-detail-description">{product.description || 'Um cuidado pensado para o seu dia a dia.'}</p>
          <strong className="store-detail-price">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>

          {isAvailable ? (
            <>
              <div className="store-detail-purchase">
                <div className="store-quantity-control" aria-label="Quantidade do produto">
                  <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} disabled={quantity <= 1} aria-label="Diminuir quantidade"><Minus size={15} /></button>
                  <input type="number" min="1" max={maxQuantity} step="1" value={quantity} onChange={handleQuantityChange} aria-label="Quantidade" />
                  <button type="button" onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))} disabled={quantity >= maxQuantity} aria-label="Aumentar quantidade"><Plus size={15} /></button>
                </div>
                <button className="button button--green store-detail-add" type="button" onClick={() => addToCart(product.id, quantity)}><ShoppingBag size={16} /> Adicionar à sacola</button>
              </div>
              <span className="store-detail-stock-note">Disponibilidade limitada a {product.quantity} {product.quantity === 1 ? 'unidade' : 'unidades'}.</span>
            </>
          ) : (
            <button className="button store-detail-add store-detail-add--disabled" type="button" disabled><ShoppingBag size={16} /> Indisponível no momento</button>
          )}

          <div className="store-detail-assurances">
            <span><ShieldCheck size={16} /> Compra segura</span>
            <span><Truck size={16} /> Cuidado em cada entrega</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductDetail
