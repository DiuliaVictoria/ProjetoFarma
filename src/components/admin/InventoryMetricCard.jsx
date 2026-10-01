import { Boxes, CircleDollarSign, CircleOff, Package, TriangleAlert } from 'lucide-react'

const icons = {
  products: Package,
  stock: Boxes,
  low: TriangleAlert,
  empty: CircleOff,
  value: CircleDollarSign,
}

function InventoryMetricCard({ label, value, detail, icon, tone = 'green' }) {
  const Icon = icons[icon]

  return (
    <article className={`inventory-metric card inventory-metric--${tone}`}>
      <div className="inventory-metric__top">
        <span className="inventory-metric__label">{label}</span>
        <span className="inventory-metric__icon"><Icon size={18} strokeWidth={1.8} /></span>
      </div>
      <strong className="inventory-metric__value">{value}</strong>
      <span className="inventory-metric__detail">{detail}</span>
    </article>
  )
}

export default InventoryMetricCard
