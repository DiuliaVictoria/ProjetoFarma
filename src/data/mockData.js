export const PRODUCT_CATEGORIES = [
  'Medicamentos',
  'Vitaminas e suplementos',
  'Cuidados pessoais',
  'Dermocosméticos',
  'Primeiros socorros',
  'Higiene',
  'Outros',
]

export const LOW_STOCK_THRESHOLD = 10

export const mockProducts = [
  {
    id: 'demo-001',
    name: 'Vitamina C 500 mg',
    category: 'Vitaminas e suplementos',
    description: 'Embalagem com 30 comprimidos.',
    price: 18.9,
    quantity: 8,
    minStock: LOW_STOCK_THRESHOLD,
    unitCost: 18.9,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    sku: 'PF-VC-014',
    createdAt: '2026-09-30T12:00:00.000Z',
    image: '',
    active: true,
  },
  {
    id: 'demo-002',
    name: 'Protetor solar FPS 50',
    category: 'Dermocosméticos',
    description: 'Loção 200 ml.',
    price: 42.5,
    quantity: 4,
    minStock: LOW_STOCK_THRESHOLD,
    unitCost: 42.5,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    sku: 'PF-PS-032',
    createdAt: '2026-09-29T12:00:00.000Z',
    image: '',
    active: true,
  },
  {
    id: 'demo-003',
    name: 'Soro fisiológico 0,9%',
    category: 'Medicamentos',
    description: 'Frasco 500 ml.',
    price: 9.9,
    quantity: 0,
    minStock: LOW_STOCK_THRESHOLD,
    unitCost: 9.9,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    sku: 'PF-SF-008',
    createdAt: '2026-09-28T12:00:00.000Z',
    image: '',
    active: true,
  },
  {
    id: 'demo-004',
    name: 'Curativos adesivos',
    category: 'Primeiros socorros',
    description: 'Embalagem com 40 unidades.',
    price: 12.9,
    quantity: 0,
    minStock: LOW_STOCK_THRESHOLD,
    unitCost: 12.9,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    sku: 'PF-CA-021',
    createdAt: '2026-09-27T12:00:00.000Z',
    image: '',
    active: false,
  },
  {
    id: 'demo-005',
    name: 'Hidratante corporal',
    category: 'Cuidados pessoais',
    description: 'Frasco 200 ml.',
    price: 29.9,
    quantity: 26,
    minStock: LOW_STOCK_THRESHOLD,
    unitCost: 29.9,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    sku: 'PF-HC-017',
    createdAt: '2026-09-26T12:00:00.000Z',
    image: '',
    active: true,
  },
  {
    id: 'demo-006',
    name: 'Paracetamol 750 mg',
    category: 'Medicamentos',
    description: 'Embalagem com 20 comprimidos.',
    price: 14.5,
    quantity: 20,
    minStock: LOW_STOCK_THRESHOLD,
    unitCost: 14.5,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    sku: 'PF-PA-011',
    createdAt: '2026-09-25T12:00:00.000Z',
    image: '',
    active: true,
  },
  {
    id: 'demo-007',
    name: 'Sabonete glicerinado',
    category: 'Higiene',
    description: 'Barra 90 g.',
    price: 7.9,
    quantity: 34,
    minStock: LOW_STOCK_THRESHOLD,
    unitCost: 7.9,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    sku: 'PF-SG-005',
    createdAt: '2026-09-24T12:00:00.000Z',
    image: '',
    active: true,
  },
]

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function getRecentProducts(products, limit = 5) {
  return [...products]
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
    .slice(0, limit)
}

export function getProductStockStatus(product) {
  if (product.quantity === 0) return 'empty'
  return product.quantity <= (product.minStock ?? product.lowStockThreshold ?? LOW_STOCK_THRESHOLD)
    ? 'low'
    : 'available'
}

export function getInventorySummary(products) {
  const summary = products.reduce((totals, product) => {
    totals.stockItems += product.quantity
    totals.estimatedStockValue += product.quantity * (product.unitCost ?? product.price)

    if (getProductStockStatus(product) === 'empty') {
      totals.outOfStockProducts += 1
    } else if (getProductStockStatus(product) === 'low') {
      totals.lowStockProducts += 1
    }

    return totals
  }, {
    stockItems: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    estimatedStockValue: 0,
  })

  return {
    ...summary,
    totalProducts: products.length,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    estimatedStockValue: currencyFormatter.format(summary.estimatedStockValue),
  }
}
