import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { mockProducts } from '../data/mockData.js'

const ProductContext = createContext(null)
const STORAGE_KEY = 'projetofarma.products.v1'

function loadStoredProducts() {
  try {
    const storedProducts = localStorage.getItem(STORAGE_KEY)

    if (storedProducts === null) {
      return { products: mockProducts, notification: null }
    }

    const products = JSON.parse(storedProducts)

    const isValidProduct = (product) => (
      product
      && typeof product.id === 'string'
      && typeof product.name === 'string'
      && typeof product.category === 'string'
      && typeof product.description === 'string'
      && Number.isFinite(product.price)
      && product.price > 0
      && Number.isInteger(product.quantity)
      && product.quantity >= 0
      && Number.isInteger(product.minStock)
      && product.minStock >= 0
      && typeof product.active === 'boolean'
      && typeof product.image === 'string'
      && (product.image === '' || /^data:image\/(?:webp|png|jpeg);base64,/i.test(product.image))
      && product.image.length <= 350_000
      && typeof product.createdAt === 'string'
    )

    if (!Array.isArray(products) || !products.every(isValidProduct)) {
      return {
        products: mockProducts,
        notification: {
          type: 'error',
          message: 'Os dados de produtos armazenados são inválidos. Eles não foram substituídos.',
        },
      }
    }

    return { products, notification: null }
  } catch {
    return {
      products: mockProducts,
      notification: {
        type: 'error',
        message: 'Não foi possível ler os produtos salvos neste navegador. Os dados locais não foram substituídos.',
      },
    }
  }
}

function createProductId() {
  return globalThis.crypto?.randomUUID?.() ?? `produto-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function ProductProvider({ children }) {
  const [initialState] = useState(loadStoredProducts)
  const [products, setProducts] = useState(initialState.products)
  const [notification, setNotification] = useState(initialState.notification)
  const hasChanges = useRef(false)

  useEffect(() => {
    if (!hasChanges.current) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    } catch {
      setNotification({
        type: 'error',
        message: 'Não foi possível salvar no armazenamento do navegador. Libere espaço e tente novamente.',
      })
    }
  }, [products])

  const notify = useCallback((message, type = 'success') => {
    setNotification({ message, type })
  }, [])

  const dismissNotification = useCallback(() => setNotification(null), [])

  const addProduct = useCallback((product) => {
    hasChanges.current = true
    const id = createProductId()
    const code = id.replace(/[^a-z0-9]/gi, '').slice(-8).toUpperCase()
    const createdAt = new Date().toISOString()

    setProducts((currentProducts) => [
      {
        ...product,
        id,
        sku: `PF-${code}`,
        createdAt,
        updatedAt: createdAt,
        unitCost: product.price,
        lowStockThreshold: product.minStock,
      },
      ...currentProducts,
    ])
    notify('Produto cadastrado com sucesso.')

    return id
  }, [notify])

  const updateProduct = useCallback((id, updates) => {
    hasChanges.current = true
    setProducts((currentProducts) => currentProducts.map((product) => (
      product.id === id
        ? {
            ...product,
            ...updates,
            updatedAt: new Date().toISOString(),
            unitCost: updates.price,
            lowStockThreshold: updates.minStock,
          }
        : product
    )))
    notify('Produto atualizado com sucesso.')
  }, [notify])

  const updateProductQuantity = useCallback((id, quantity) => {
    if (!Number.isInteger(quantity) || quantity < 0) {
      notify('Informe uma quantidade inteira igual ou maior que zero.', 'error')
      return false
    }

    if (!products.some((product) => product.id === id)) {
      notify('O produto não foi encontrado no catálogo.', 'error')
      return false
    }

    hasChanges.current = true
    setProducts((currentProducts) => currentProducts.map((product) => (
      product.id === id
        ? {
            ...product,
            quantity,
            updatedAt: new Date().toISOString(),
          }
        : product
    )))
    notify('Quantidade em estoque atualizada com sucesso.')
    return true
  }, [notify, products])

  const deleteProduct = useCallback((id) => {
    hasChanges.current = true
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== id))
    notify('Produto excluído com sucesso.')
  }, [notify])

  const value = {
    products,
    notification,
    notify,
    dismissNotification,
    addProduct,
    updateProduct,
    updateProductQuantity,
    deleteProduct,
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductContext)

  if (!context) {
    throw new Error('useProducts deve ser utilizado dentro de ProductProvider.')
  }

  return context
}
