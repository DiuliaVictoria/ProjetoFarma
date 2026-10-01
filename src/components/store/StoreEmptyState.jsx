import { ArrowLeft, PackageSearch, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

function StoreEmptyState({ title, description, actionLabel = 'Explorar catálogo', to = '/catalogo', search = false }) {
  const Icon = search ? Search : PackageSearch

  return (
    <section className="store-empty card">
      <span className="store-empty__icon"><Icon size={23} strokeWidth={1.7} /></span>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link className="button button--green" to={to}>
        {search ? <Search size={15} /> : <ArrowLeft size={15} />}
        {actionLabel}
      </Link>
    </section>
  )
}

export default StoreEmptyState
