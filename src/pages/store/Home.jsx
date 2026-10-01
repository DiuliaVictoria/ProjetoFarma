import { ArrowRight, BadgeCheck, Heart, Leaf, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProducts } from '../../context/ProductContext.jsx'
import StoreEmptyState from '../../components/store/StoreEmptyState.jsx'
import StoreProductGrid from '../../components/store/StoreProductGrid.jsx'
import { getProductStockStatus } from '../../data/mockData.js'

function Home() {
  const { products } = useProducts()
  const availableProducts = products.filter((product) => (
    product.active && getProductStockStatus(product) !== 'empty'
  ))
  const categories = [...new Set(products.filter((product) => product.active).map((product) => product.category))]
    .sort((first, second) => first.localeCompare(second, 'pt-BR', { sensitivity: 'base' }))
  const featuredProducts = [...availableProducts]
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
    .slice(0, 3)
  const featuredIds = new Set(featuredProducts.map((product) => product.id))
  const otherAvailableProducts = availableProducts.filter((product) => !featuredIds.has(product.id))

  return (
    <div className="store-home">
      <section className="hero">
        <div className="hero__content">
          <span className="hero__eyebrow"><span /> SAÚDE COM MAIS PROXIMIDADE</span>
          <h1>O cuidado que<br />faz bem <em>de verdade.</em></h1>
          <p>Encontre o que você precisa para cuidar de si — com a atenção e a confiança de quem está sempre por perto.</p>
          <Link className="button button--light" to="/catalogo">Conheça nosso catálogo <ArrowRight size={17} /></Link>
          <div className="hero__trust"><ShieldCheck size={16} /><span>Confiança para cuidar de você em cada detalhe</span></div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__orbit hero__orbit--outer" />
          <div className="hero__orbit hero__orbit--inner" />
          <div className="hero__leaf"><Leaf size={118} strokeWidth={0.8} /></div>
          <div className="hero__floating-card"><span><Heart size={16} /></span><div><strong>Seu bem-estar</strong><small>vem sempre primeiro</small></div><BadgeCheck size={17} /></div>
          <div className="hero__decor hero__decor--one" />
          <div className="hero__decor hero__decor--two" />
        </div>
        <span className="hero__index">01 <i /> 03</span>
      </section>

      <section className="store-categories" aria-labelledby="store-categories-title">
        <div className="store-section-heading">
          <div><span className="eyebrow">ENCONTRE COM FACILIDADE</span><h2 id="store-categories-title">Explore por categoria</h2></div>
          <Link to="/catalogo" className="text-link">Ver catálogo <ArrowRight size={15} /></Link>
        </div>
        {categories.length ? (
          <div className="store-categories__list">
            {categories.map((category, index) => (
              <Link className="store-category" to={`/catalogo?categoria=${encodeURIComponent(category)}`} key={category}>
                <span className={`store-category__icon store-category__icon--${index % 4}`}><Sparkles size={17} /></span>
                <span>{category}</span>
                <ArrowRight className="store-category__arrow" size={14} />
              </Link>
            ))}
          </div>
        ) : (
          <StoreEmptyState title="Estamos preparando as categorias" description="Em breve, teremos novidades para compartilhar com você." />
        )}
      </section>

      <section className="store-featured" aria-labelledby="store-featured-title">
        <div className="store-section-heading">
          <div>
            <span className="eyebrow">CUIDADOS ESCOLHIDOS PARA VOCÊ</span>
            <h2 id="store-featured-title">Destaques da farmácia</h2>
            <p>Uma seleção de produtos que fazem parte do seu dia a dia.</p>
          </div>
          {availableProducts.length > featuredProducts.length && <Link to="/catalogo" className="text-link">Ver todos <ArrowRight size={15} /></Link>}
        </div>
        <StoreProductGrid
          products={featuredProducts}
          emptyTitle="Novidades chegando em breve"
          emptyDescription="Neste momento, não há produtos ativos e disponíveis para mostrar. Volte em breve."
        />
      </section>

      <section className="store-available" aria-labelledby="store-available-title">
        <div className="store-section-heading">
          <div>
            <span className="eyebrow">SELEÇÃO ATUALIZADA</span>
            <h2 id="store-available-title">Produtos disponíveis</h2>
            <p>Confira outras opções disponíveis no momento.</p>
          </div>
          <Link to="/catalogo" className="text-link">Explorar catálogo <ArrowRight size={15} /></Link>
        </div>
        <StoreProductGrid
          products={otherAvailableProducts}
          emptyTitle={availableProducts.length ? 'Você já viu todos os itens disponíveis' : 'Nenhum produto disponível no momento'}
          emptyDescription={availableProducts.length
            ? 'Explore o catálogo para ver também os destaques apresentados acima.'
            : 'Volte em breve para conhecer os produtos da nossa farmácia.'}
        />
      </section>

      <section className="store-values">
        <div className="store-values__intro"><span>FEITA PARA VOCÊ</span><h2>Mais que uma farmácia.<br /><em>Um jeito melhor de cuidar.</em></h2></div>
        <article><span className="value-icon"><Heart size={20} /></span><h3>Cuidado próximo</h3><p>Um atendimento que escuta e entende o que importa para você.</p></article>
        <article><span className="value-icon"><ShieldCheck size={20} /></span><h3>Confiança sempre</h3><p>Qualidade e responsabilidade em cada escolha de cuidado.</p></article>
      </section>
    </div>
  )
}

export default Home
