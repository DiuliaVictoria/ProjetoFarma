import { ArrowRight, PackageSearch } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getProductStockStatus } from '../../data/mockData.js'

function RecentProducts({ products }) {
  return (
    <section className="recent-products card">
      <header className="dashboard-panel__header">
        <div>
          <h2>Produtos recentes</h2>
          <p>Produtos cadastrados recentemente</p>
        </div>
        <Link className="dashboard-panel__link" to="/admin/produtos">Ver produtos <ArrowRight size={14} /></Link>
      </header>
      <div className="recent-products__scroll">
        <table className="recent-products__table">
          <thead>
            <tr>
              <th scope="col">Produto</th>
              <th scope="col">Código</th>
              <th scope="col">Preço</th>
              <th scope="col">Disponível</th>
              <th scope="col">Situação</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 5).map((product) => {
              const status = getProductStockStatus(product)

              return (
                <tr key={product.id}>
                  <td>
                    <span className="recent-products__product">
                      <span className="recent-products__product-icon"><PackageSearch size={15} /></span>
                      <span><strong>{product.name}</strong><small>{product.description}</small></span>
                    </span>
                  </td>
                  <td className="recent-products__sku">{product.sku}</td>
                  <td>{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td><strong className="recent-products__quantity">{product.quantity} un.</strong></td>
                  <td>
                    <span className={`stock-status stock-status--${status}`}>
                      <i />
                      {status === 'empty' ? 'Sem estoque' : status === 'low' ? 'Estoque baixo' : 'Disponível'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <footer className="recent-products__footer">Exibindo {Math.min(products.length, 5)} de {products.length} produtos</footer>
    </section>
  )
}

export default RecentProducts
