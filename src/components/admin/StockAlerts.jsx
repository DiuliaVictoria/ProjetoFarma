import { ArrowRight, CircleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getProductStockStatus } from '../../data/mockData.js'

function StockAlerts({ products, lowStockThreshold }) {
  const alerts = products
    .filter((product) => getProductStockStatus({
      ...product,
      minStock: product.minStock ?? product.lowStockThreshold ?? lowStockThreshold,
    }) !== 'available')
    .sort((first, second) => first.quantity - second.quantity)

  return (
    <section className="stock-alerts card">
      <header className="dashboard-panel__header">
        <div>
          <h2>Alertas de estoque</h2>
          <p>Produtos que merecem atenção</p>
        </div>
        <span className="stock-alerts__count">{alerts.length}</span>
      </header>

      {alerts.length ? (
        <ul className="stock-alerts__list">
          {alerts.map((product) => {
            const outOfStock = getProductStockStatus(product) === 'empty'

            return (
              <li className={`stock-alert${outOfStock ? ' stock-alert--empty' : ''}`} key={product.id}>
                <span className="stock-alert__icon"><CircleAlert size={17} /></span>
                <span className="stock-alert__content">
                  <strong>{product.name}</strong>
                  <small>{outOfStock ? 'Este produto está indisponível' : `Apenas ${product.quantity} unidades disponíveis`}</small>
                </span>
                <span className="stock-alert__quantity">{product.quantity}</span>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="stock-alerts__empty">Nenhum produto com alerta de estoque no momento.</p>
      )}

      <Link className="stock-alerts__link" to="/admin/estoque">Visualizar estoque <ArrowRight size={14} /></Link>
    </section>
  )
}

export default StockAlerts
