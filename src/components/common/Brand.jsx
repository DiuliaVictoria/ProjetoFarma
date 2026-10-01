import { Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

function Brand({ compact = false }) {
  return (
    <Link className={`brand${compact ? ' brand--compact' : ''}`} to="/" aria-label="ProjetoFarma — início">
      <span className="brand__mark"><Leaf size={19} strokeWidth={2.2} /></span>
      {!compact && (
        <span className="brand__name">projeto<span>farma</span></span>
      )}
    </Link>
  )
}

export default Brand
