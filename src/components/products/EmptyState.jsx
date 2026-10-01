import { PackageSearch, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

function EmptyState({ filtered = false }) {
  return (
    <section className="products-empty-state card">
      <span className="products-empty-state__icon"><PackageSearch size={23} /></span>
      <h2>{filtered ? 'Nenhum produto encontrado' : 'Seu catálogo começa aqui'}</h2>
      <p>{filtered ? 'Tente ajustar a busca ou escolher outra categoria.' : 'Cadastre o primeiro produto para organizar o catálogo da sua farmácia.'}</p>
      {!filtered && <Link className="button button--green" to="/admin/produtos/novo"><Plus size={16} /> Cadastrar primeiro produto</Link>}
    </section>
  )
}

export default EmptyState
