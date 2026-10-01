import { Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getProductStockStatus } from '../../data/mockData.js'
import ProductImage from './ProductImage.jsx'

function ProductCard({ product, onDelete }) {
  const stockStatus = getProductStockStatus(product)

  return (
    <article className="product-card card">
      <ProductImage src={product.image} alt={product.name} className="product-card__image" />
      <div className="product-card__body">
        <div className="product-card__eyebrow">
          <span className="product-card__category">{product.category}</span>
          <span className={`product-status${product.active ? ' product-status--active' : ' product-status--inactive'}`}>
            <i />{product.active ? 'Ativo' : 'Inativo'}
          </span>
        </div>
        <h2 className="product-card__name">{product.name}</h2>
        <p className="product-card__description">{product.description || 'Sem descrição cadastrada.'}</p>
        <div className="product-card__details">
          <strong>{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
          <span className={`product-card__stock${stockStatus === 'empty' ? ' product-card__stock--empty' : stockStatus === 'low' ? ' product-card__stock--low' : ''}`}>
            {stockStatus === 'empty' ? 'Sem estoque' : stockStatus === 'low' ? 'Estoque baixo' : `${product.quantity} un. em estoque`}
          </span>
        </div>
        <div className="product-card__actions">
          <Link className="product-card__edit" to={`/admin/produtos/editar/${encodeURIComponent(product.id)}`}><Pencil size={14} /> Editar</Link>
          <button className="product-card__delete" type="button" onClick={() => onDelete(product)} aria-label={`Excluir ${product.name}`}><Trash2 size={15} /> Excluir</button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
