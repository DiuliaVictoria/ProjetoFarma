import StoreEmptyState from './StoreEmptyState.jsx'
import StoreProductCard from './StoreProductCard.jsx'

function StoreProductGrid({ products, emptyTitle = 'Nenhum produto disponível', emptyDescription = 'Volte em breve para conhecer nossos produtos.' }) {
  if (!products.length) {
    return <StoreEmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="store-product-grid">
      {products.map((product) => <StoreProductCard key={product.id} product={product} />)}
    </div>
  )
}

export default StoreProductGrid
