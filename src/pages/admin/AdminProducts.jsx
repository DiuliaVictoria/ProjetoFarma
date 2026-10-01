import { useMemo, useState } from 'react'
import { ArrowDownWideNarrow, PackagePlus, Search, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import ConfirmDialog from '../../components/products/ConfirmDialog.jsx'
import EmptyState from '../../components/products/EmptyState.jsx'
import ProductCard from '../../components/products/ProductCard.jsx'
import { useProducts } from '../../context/ProductContext.jsx'
import { PRODUCT_CATEGORIES } from '../../data/mockData.js'
import PageHeading from '../../components/common/PageHeading.jsx'

function AdminProducts() {
  const { products, deleteProduct } = useProducts()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')
  const [productToDelete, setProductToDelete] = useState(null)

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')

    return products
      .filter((product) => product.name.toLocaleLowerCase('pt-BR').includes(normalizedSearch))
      .filter((product) => !category || product.category === category)
      .sort((first, second) => {
        switch (sort) {
          case 'name-asc':
            return first.name.localeCompare(second.name, 'pt-BR', { sensitivity: 'base' })
          case 'name-desc':
            return second.name.localeCompare(first.name, 'pt-BR', { sensitivity: 'base' })
          case 'price-asc':
            return first.price - second.price
          case 'price-desc':
            return second.price - first.price
          default:
            return second.createdAt.localeCompare(first.createdAt)
        }
      })
  }, [products, search, category, sort])

  function confirmDelete() {
    if (!productToDelete) return
    deleteProduct(productToDelete.id)
    setProductToDelete(null)
  }

  const hasFilters = Boolean(search.trim() || category)

  return (
    <div className="admin-products-page">
      <PageHeading
        eyebrow="CATÁLOGO"
        title="Produtos"
        description="Organize e acompanhe os produtos da sua farmácia."
        action={(
          <Link className="button button--green admin-add-button" to="/admin/produtos/novo">
            <PackagePlus size={17} /> Cadastrar produto
          </Link>
        )}
      />

      <section className="products-summary card" aria-label="Resumo do catálogo">
        <span className="products-summary__icon"><SlidersHorizontal size={18} /></span>
        <span className="products-summary__copy"><strong>{products.length}</strong> {products.length === 1 ? 'produto no catálogo' : 'produtos no catálogo'}</span>
        <span className="products-summary__separator" />
        <span className="products-summary__visible">{filteredProducts.length} {filteredProducts.length === 1 ? 'exibido' : 'exibidos'}</span>
        <span className="products-summary__demo"><i /> Dados demonstrativos e locais</span>
      </section>

      <section className="products-toolbar" aria-label="Buscar, filtrar e ordenar produtos">
        <label className="products-search">
          <Search size={17} />
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome do produto..." aria-label="Buscar produtos por nome" />
          {search && <button type="button" onClick={() => setSearch('')} aria-label="Limpar busca">×</button>}
        </label>
        <label className="products-toolbar__select">
          <span className="visually-hidden">Filtrar por categoria</span>
          <SlidersHorizontal size={15} />
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filtrar por categoria">
            <option value="">Todas as categorias</option>
            {PRODUCT_CATEGORIES.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
        <label className="products-toolbar__select products-toolbar__sort">
          <ArrowDownWideNarrow size={15} />
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar produtos">
            <option value="newest">Mais recentes</option>
            <option value="name-asc">Nome: A a Z</option>
            <option value="name-desc">Nome: Z a A</option>
            <option value="price-asc">Preço: menor primeiro</option>
            <option value="price-desc">Preço: maior primeiro</option>
          </select>
        </label>
      </section>

      {filteredProducts.length ? (
        <section className="products-grid" aria-label="Lista de produtos">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onDelete={setProductToDelete} />
          ))}
        </section>
      ) : (
        <EmptyState filtered={products.length > 0 || hasFilters} />
      )}

      <ConfirmDialog
        open={Boolean(productToDelete)}
        title="Excluir produto?"
        description={productToDelete ? `“${productToDelete.name}” será removido do catálogo salvo neste navegador. Esta ação não pode ser desfeita.` : ''}
        onCancel={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default AdminProducts
