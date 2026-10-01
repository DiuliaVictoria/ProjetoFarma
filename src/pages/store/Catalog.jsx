import { ArrowDownWideNarrow, Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeading from '../../components/common/PageHeading.jsx'
import StoreEmptyState from '../../components/store/StoreEmptyState.jsx'
import StoreProductGrid from '../../components/store/StoreProductGrid.jsx'
import { useProducts } from '../../context/ProductContext.jsx'
import { getProductStockStatus } from '../../data/mockData.js'

function Catalog() {
  const { products } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''
  const category = searchParams.get('categoria') ?? ''
  const [sort, setSort] = useState('newest')
  const [availability, setAvailability] = useState('')
  const publicProducts = products.filter((product) => product.active)
  const categories = [...new Set(publicProducts.map((product) => product.category))]
    .sort((first, second) => first.localeCompare(second, 'pt-BR', { sensitivity: 'base' }))

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')

    return publicProducts
      .filter((product) => product.name.toLocaleLowerCase('pt-BR').includes(normalizedSearch))
      .filter((product) => !category || product.category === category)
      .filter((product) => {
        if (!availability) return true
        return availability === 'available'
          ? getProductStockStatus(product) !== 'empty'
          : getProductStockStatus(product) === 'empty'
      })
      .sort((first, second) => {
        switch (sort) {
          case 'price-asc':
            return first.price - second.price
          case 'price-desc':
            return second.price - first.price
          case 'name':
            return first.name.localeCompare(second.name, 'pt-BR', { sensitivity: 'base' })
          default:
            return second.createdAt.localeCompare(first.createdAt)
        }
      })
  }, [publicProducts, search, category, availability, sort])

  function updateSearchParams(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  const hasFilters = Boolean(search.trim() || category || availability)

  return (
    <div className="store-catalog-page">
      <div className="store-catalog-intro">
        <PageHeading eyebrow="CUIDADO DO SEU JEITO" title="Nosso catálogo" description="Encontre o que você precisa para cuidar bem de você e de quem você ama." />
        <span className="store-catalog-intro__note">Produtos selecionados para você.</span>
      </div>

      <section className="catalog-toolbar" aria-label="Buscar, filtrar e ordenar produtos">
        <label className="catalog-search">
          <Search size={17} />
          <input
            type="search"
            value={search}
            onChange={(event) => updateSearchParams('q', event.target.value)}
            placeholder="O que você está procurando?"
            aria-label="Buscar por nome do produto"
          />
          {search && <button type="button" onClick={() => updateSearchParams('q', '')} aria-label="Limpar busca">×</button>}
        </label>
        <label className="catalog-filter">
          <SlidersHorizontal size={15} />
          <select value={category} onChange={(event) => updateSearchParams('categoria', event.target.value)} aria-label="Filtrar por categoria">
            <option value="">Todas as categorias</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="catalog-filter">
          <Search size={15} />
          <select value={availability} onChange={(event) => setAvailability(event.target.value)} aria-label="Filtrar por disponibilidade">
            <option value="">Todos os produtos</option>
            <option value="available">Disponíveis</option>
            <option value="empty">Sem estoque</option>
          </select>
        </label>
        <label className="catalog-filter catalog-filter--sort">
          <ArrowDownWideNarrow size={15} />
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar produtos">
            <option value="newest">Mais recentes</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="name">Nome: A a Z</option>
          </select>
        </label>
      </section>

      <div className="catalog-results">
        <p><strong>{visibleProducts.length}</strong> {visibleProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}</p>
        {hasFilters && <button type="button" onClick={() => { setSearchParams({}, { replace: true }); setAvailability('') }}>Limpar filtros</button>}
      </div>

      {visibleProducts.length ? (
        <StoreProductGrid products={visibleProducts} />
      ) : (
        <StoreEmptyState
          search
          title={publicProducts.length ? 'Nenhum produto encontrado' : 'Estamos preparando nosso catálogo'}
          description={publicProducts.length
            ? 'Experimente mudar o termo buscado ou ajustar os filtros.'
            : 'Em breve, você poderá encontrar aqui nossos produtos disponíveis.'}
          actionLabel={hasFilters ? 'Limpar busca e filtros' : 'Voltar ao início'}
          to={hasFilters ? '/catalogo' : '/'}
        />
      )}
    </div>
  )
}

export default Catalog
