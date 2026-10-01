import { ArrowUpRight, PackagePlus, Store, Warehouse } from 'lucide-react'
import { Link } from 'react-router-dom'
import InventoryMetricCard from '../../components/admin/InventoryMetricCard.jsx'
import RecentProducts from '../../components/admin/RecentProducts.jsx'
import StockAlerts from '../../components/admin/StockAlerts.jsx'
import { useProducts } from '../../context/ProductContext.jsx'
import { getInventorySummary, getRecentProducts } from '../../data/mockData.js'
import PageHeading from '../../components/common/PageHeading.jsx'

function AdminDashboard() {
  const { products } = useProducts()
  const summary = getInventorySummary(products)

  return (
    <div className="dashboard">
      <PageHeading
        eyebrow="RESUMO DA OPERAÇÃO"
        title="Dashboard"
        description="Acompanhe o catálogo e a disponibilidade do estoque da sua farmácia."
        action={(
          <Link className="button button--green admin-add-button" to="/admin/produtos/novo">
            <PackagePlus size={17} /> Cadastrar produto
          </Link>
        )}
      />

      <div className="dashboard__demo-note">
        <span className="dashboard__demo-dot" />
        <span>Dados do catálogo</span>
        <span className="dashboard__demo-separator">·</span>
        <span>Indicadores atualizados a partir do estoque cadastrado</span>
      </div>

      <section className="dashboard-metrics" aria-label="Indicadores de produtos e estoque">
        <InventoryMetricCard label="Total de produtos" value={summary.totalProducts} detail="Produtos cadastrados" icon="products" />
        <InventoryMetricCard label="Itens em estoque" value={summary.stockItems} detail="Unidades disponíveis" icon="stock" />
        <InventoryMetricCard label="Estoque baixo" value={summary.lowStockProducts} detail={`Até ${summary.lowStockThreshold} unidades`} icon="low" tone="warning" />
        <InventoryMetricCard label="Sem estoque" value={summary.outOfStockProducts} detail="Produtos indisponíveis" icon="empty" tone="danger" />
        <InventoryMetricCard label="Valor estimado" value={summary.estimatedStockValue} detail="Baseado nos dados de exemplo" icon="value" />
      </section>

      <section className="dashboard-inventory-grid" aria-label="Visão do catálogo e alertas">
        <RecentProducts products={getRecentProducts(products)} />
        <StockAlerts products={products} lowStockThreshold={summary.lowStockThreshold} />
      </section>

      <section className="dashboard-shortcuts" aria-label="Atalhos">
        <div className="dashboard-shortcuts__heading">
          <div>
            <span className="eyebrow">ACESSO RÁPIDO</span>
            <h2>Atalhos</h2>
          </div>
          <p>Continue de onde você precisa.</p>
        </div>
        <div className="dashboard-shortcuts__grid">
          <Link className="dashboard-shortcut card" to="/admin/produtos/novo">
            <span className="dashboard-shortcut__icon"><PackagePlus size={19} /></span>
            <span className="dashboard-shortcut__copy"><strong>Cadastrar produto</strong><small>Adicione um produto ao catálogo</small></span>
            <ArrowUpRight className="dashboard-shortcut__arrow" size={15} />
          </Link>
          <Link className="dashboard-shortcut card" to="/admin/estoque">
            <span className="dashboard-shortcut__icon dashboard-shortcut__icon--sage"><Warehouse size={19} /></span>
            <span className="dashboard-shortcut__copy"><strong>Visualizar estoque</strong><small>Acompanhe a disponibilidade</small></span>
            <ArrowUpRight className="dashboard-shortcut__arrow" size={15} />
          </Link>
          <Link className="dashboard-shortcut card" to="/">
            <span className="dashboard-shortcut__icon dashboard-shortcut__icon--sand"><Store size={19} /></span>
            <span className="dashboard-shortcut__copy"><strong>Visualizar loja</strong><small>Veja a experiência da loja</small></span>
            <ArrowUpRight className="dashboard-shortcut__arrow" size={15} />
          </Link>
        </div>
      </section>

      <p className="dashboard__disclaimer">Indicadores do catálogo salvo neste navegador. O valor estimado considera o preço cadastrado de cada item e a quantidade disponível.</p>
    </div>
  )
}

export default AdminDashboard
