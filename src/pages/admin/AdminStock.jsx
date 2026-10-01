import { useCallback, useMemo, useState } from 'react'
import { AlertTriangle, Boxes, PackageCheck, Search, SlidersHorizontal, TriangleAlert, Warehouse } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProducts } from '../../context/ProductContext.jsx'
import { PRODUCT_CATEGORIES, getInventorySummary, getProductStockStatus } from '../../data/mockData.js'
import ProductImage from '../../components/products/ProductImage.jsx'
import StockAdjustmentDialog from '../../components/admin/StockAdjustmentDialog.jsx'
import InventoryMetricCard from '../../components/admin/InventoryMetricCard.jsx'
import PageHeading from '../../components/common/PageHeading.jsx'

const stockStatuses = [
  { value: 'available', label: 'Disponível' },
  { value: 'low', label: 'Estoque baixo' },
  { value: 'empty', label: 'Sem estoque' },
]

function getStatusLabel(status) {
  return stockStatuses.find((item) => item.value === status)?.label ?? 'Status desconhecido'
}

function AdminStock() {
  const { products, updateProductQuantity } = useProducts()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const summary = getInventorySummary(products)

  const inventory = useMemo(() => (
    products.map((product) => ({ ...product, stockStatus: getProductStockStatus(product) }))
  ), [products])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')

    return inventory
      .filter((product) => product.name.toLocaleLowerCase('pt-BR').includes(normalizedSearch))
      .filter((product) => !category || product.category === category)
      .filter((product) => !status || product.stockStatus === status)
      .sort((first, second) => first.name.localeCompare(second.name, 'pt-BR', { sensitivity: 'base' }))
  }, [inventory, search, category, status])

  const lowStockCount = inventory.filter((product) => product.stockStatus === 'low').length
  const outOfStockCount = inventory.filter((product) => product.stockStatus === 'empty').length
  const hasFilters = Boolean(search.trim() || category || status)

  const closeAdjustmentDialog = useCallback(() => setSelectedProduct(null), [])

  function handleSaveQuantity(quantity) {
    const didUpdate = updateProductQuantity(selectedProduct.id, quantity)
    if (didUpdate) setSelectedProduct(null)
  }

  function clearFilters() {
    setSearch('')
    setCategory('')
    setStatus('')
  }

  return (
    <div className="stock-management">
      <PageHeading
        eyebrow="OPERAÇÃO"
        title="Estoque"
        description="Acompanhe a disponibilidade e mantenha as quantidades atualizadas."
        action={<span className="stock-header-badge"><Warehouse size={15} /> Controle de estoque</span>}
      />

      <section className="stock-metrics" aria-label="Indicadores do estoque">
        <InventoryMetricCard label="Produtos acompanhados" value={summary.totalProducts} detail="Itens no catálogo" icon="products" />
        <InventoryMetricCard label="Unidades em estoque" value={summary.stockItems} detail="Quantidade disponível" icon="stock" />
        <InventoryMetricCard label="Estoque baixo" value={lowStockCount} detail="Acima de zero, até o mínimo" icon="low" tone="warning" />
        <InventoryMetricCard label="Sem estoque" value={outOfStockCount} detail="Produtos sem unidades" icon="empty" tone="danger" />
      </section>

      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <section className="stock-alert-banner" aria-label="Alertas de estoque">
          <span className="stock-alert-banner__icon"><AlertTriangle size={19} /></span>
          <div className="stock-alert-banner__copy">
            <strong>Itens precisam de atenção</strong>
            <span>
              {[
                lowStockCount > 0 && `${lowStockCount} ${lowStockCount === 1 ? 'produto com estoque baixo' : 'produtos com estoque baixo'}`,
                outOfStockCount > 0 && `${outOfStockCount} ${outOfStockCount === 1 ? 'produto sem estoque' : 'produtos sem estoque'}`,
              ].filter(Boolean).join(' · ')}
            </span>
          </div>
          <span className="stock-alert-banner__total">{lowStockCount + outOfStockCount}</span>
        </section>
      )}

      <section className="stock-panel card" aria-label="Lista de estoque">
        <header className="stock-panel__header">
          <div>
            <h2>Disponibilidade dos produtos</h2>
            <p>Pesquise o catálogo e ajuste a quantidade de cada item.</p>
          </div>
          <span className="stock-panel__count">{filteredProducts.length} <span>/ {products.length}</span></span>
        </header>

        <div className="stock-toolbar" aria-label="Buscar e filtrar estoque">
          <label className="products-search stock-search">
            <Search size={16} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar produto pelo nome..."
              aria-label="Buscar produto pelo nome"
            />
            {search && <button type="button" onClick={() => setSearch('')} aria-label="Limpar busca">×</button>}
          </label>

          <label className="products-toolbar__select stock-filter">
            <SlidersHorizontal size={15} />
            <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filtrar estoque por categoria">
              <option value="">Todas as categorias</option>
              {PRODUCT_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <label className="products-toolbar__select stock-filter">
            <PackageCheck size={15} />
            <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filtrar estoque por status">
              <option value="">Todos os status</option>
              {stockStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
        </div>

        {!filteredProducts.length ? (
          <div className="stock-empty-state">
            <span className="stock-empty-state__icon"><Boxes size={21} /></span>
            <strong>{products.length ? 'Nenhum produto encontrado' : 'Nenhum produto no catálogo'}</strong>
            <p>{products.length ? 'Tente ajustar os filtros para encontrar produtos.' : 'Cadastre um produto para começar a acompanhar o estoque.'}</p>
            {hasFilters && <button className="stock-empty-state__clear" type="button" onClick={clearFilters}>Limpar filtros</button>}
            {!products.length && <Link className="stock-empty-state__clear" to="/admin/produtos/novo">Cadastrar produto</Link>}
          </div>
        ) : (
          <>
            <div className="stock-table-scroll">
              <table className="stock-table">
                <thead>
                  <tr>
                    <th scope="col">Produto</th>
                    <th scope="col">Categoria</th>
                    <th scope="col">Quantidade atual</th>
                    <th scope="col">Estoque mínimo</th>
                    <th scope="col">Status</th>
                    <th scope="col" aria-label="Ações" />
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className={`stock-table__row stock-table__row--${product.stockStatus}`}>
                      <td>
                        <div className="stock-product">
                          <ProductImage src={product.image} alt={product.name} className="stock-product__image" />
                          <span className="stock-product__copy">
                            <strong>{product.name}</strong>
                            <small>{product.sku || 'Produto do catálogo'}</small>
                          </span>
                        </div>
                      </td>
                      <td className="stock-table__category">{product.category}</td>
                      <td><strong className={`stock-table__quantity stock-table__quantity--${product.stockStatus}`}>{product.quantity}<small> un.</small></strong></td>
                      <td className="stock-table__minimum">{product.minStock} un.</td>
                      <td>
                        <span className={`stock-status stock-status--${product.stockStatus}`}>
                          <i />{getStatusLabel(product.stockStatus)}
                        </span>
                      </td>
                      <td>
                        <button
                          className="stock-adjust-button"
                          type="button"
                          onClick={() => setSelectedProduct(product)}
                          aria-label={`Ajustar estoque de ${product.name}`}
                        >
                          <Boxes size={14} /><span>Ajustar</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <footer className="stock-panel__footer">
              <span><TriangleAlert size={13} /> O status é determinado pela quantidade atual e pelo estoque mínimo de cada produto.</span>
              {hasFilters && <button type="button" onClick={clearFilters}>Limpar filtros</button>}
            </footer>
          </>
        )}
      </section>

      <StockAdjustmentDialog
        key={selectedProduct?.id ?? 'closed'}
        product={selectedProduct}
        onCancel={closeAdjustmentDialog}
        onSave={handleSaveQuantity}
      />
    </div>
  )
}

export default AdminStock
