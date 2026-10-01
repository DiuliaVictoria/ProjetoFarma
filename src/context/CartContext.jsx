import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useProducts } from './ProductContext.jsx'

const CartContext = createContext(null)
const STORAGE_KEY = 'projetofarma.cart.v1'

function loadStoredCart() {
  try {
    const storedCart = localStorage.getItem(STORAGE_KEY)
    if (storedCart === null) return { items: [], notification: null }

    const items = JSON.parse(storedCart)
    if (!Array.isArray(items) || !items.every((item) => (
      item
      && typeof item.productId === 'string'
      && Number.isInteger(item.quantity)
      && item.quantity > 0
    ))) {
      return {
        items: [],
        notification: {
          type: 'error',
          message: 'Não foi possível ler os itens salvos na sacola. Os dados do navegador foram preservados.',
        },
      }
    }

    return { items, notification: null }
  } catch {
    return {
      items: [],
      notification: {
        type: 'error',
        message: 'O armazenamento da sacola está indisponível. Verifique as configurações deste navegador.',
      },
    }
  }
}

export function CartProvider({ children }) {
  const { products } = useProducts()
  const [initialState] = useState(loadStoredCart)
  const [cartItems, setCartItems] = useState(initialState.items)
  const [cartNotification, setCartNotification] = useState(initialState.notification)
  const cartItemsRef = useRef(initialState.items)
  const hasChanges = useRef(false)

  const commitItems = useCallback((nextItems) => {
    cartItemsRef.current = nextItems
    hasChanges.current = true
    setCartItems(nextItems)
  }, [])

  useEffect(() => {
    const syncedItems = cartItemsRef.current.flatMap((item) => {
      const product = products.find((candidate) => candidate.id === item.productId)
      if (!product?.active || product.quantity < 1) return []

      return [{ ...item, quantity: Math.min(item.quantity, product.quantity) }]
    })
    const hasDifference = syncedItems.length !== cartItemsRef.current.length
      || syncedItems.some((item, index) => (
        item.quantity !== cartItemsRef.current[index]?.quantity
        || item.productId !== cartItemsRef.current[index]?.productId
      ))

    if (hasDifference) {
      commitItems(syncedItems)
      setCartNotification({
        type: 'error',
        message: 'A sacola foi atualizada porque alguns produtos ou quantidades mudaram no estoque.',
      })
    }
  }, [products, commitItems])

  useEffect(() => {
    if (!hasChanges.current) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
    } catch {
      setCartNotification({
        type: 'error',
        message: 'Não foi possível salvar a sacola neste navegador. Tente remover alguns itens e salvar novamente.',
      })
    }
  }, [cartItems])

  const addToCart = useCallback((productId, quantity = 1) => {
    const product = products.find((item) => item.id === productId)
    const currentItems = cartItemsRef.current

    if (!Number.isInteger(quantity) || quantity < 1) {
      setCartNotification({ type: 'error', message: 'Selecione uma quantidade válida.' })
      return false
    }

    if (!product || !product.active) {
      setCartNotification({ type: 'error', message: 'Este produto não está disponível na loja.' })
      return false
    }

    if (product.quantity < 1) {
      setCartNotification({ type: 'error', message: 'Este produto está sem estoque no momento.' })
      return false
    }

    const existing = currentItems.find((item) => item.productId === productId)
    const alreadyInCart = existing?.quantity ?? 0

    if (alreadyInCart + quantity > product.quantity) {
      setCartNotification({
        type: 'error',
        message: `Há apenas ${Math.max(0, product.quantity - alreadyInCart)} unidade(s) disponível(is) para adicionar.`,
      })
      return false
    }

    commitItems(existing
      ? currentItems.map((item) => item.productId === productId
        ? { ...item, quantity: item.quantity + quantity }
        : item)
      : [...currentItems, { productId, quantity }])
    setCartNotification({ type: 'success', message: `${product.name} adicionado à sua sacola.` })
    return true
  }, [commitItems, products])

  const setItemQuantity = useCallback((productId, quantity) => {
    const product = products.find((item) => item.id === productId)
    const currentItems = cartItemsRef.current

    if (!Number.isInteger(quantity) || quantity < 1) {
      setCartNotification({ type: 'error', message: 'A quantidade deve ser maior que zero.' })
      return false
    }

    if (!product || !product.active || product.quantity < 1) {
      setCartNotification({ type: 'error', message: 'Este produto não está disponível na loja.' })
      return false
    }

    if (quantity > product.quantity) {
      setCartNotification({ type: 'error', message: `Há apenas ${product.quantity} unidade(s) disponível(is).` })
      return false
    }

    if (!currentItems.some((item) => item.productId === productId)) return false

    commitItems(currentItems.map((item) => item.productId === productId
      ? { ...item, quantity }
      : item))
    setCartNotification({ type: 'success', message: 'Quantidade atualizada na sua sacola.' })
    return true
  }, [commitItems, products])

  const increaseQuantity = useCallback((productId) => {
    const item = cartItemsRef.current.find((cartItem) => cartItem.productId === productId)
    return item ? setItemQuantity(productId, item.quantity + 1) : false
  }, [setItemQuantity])

  const decreaseQuantity = useCallback((productId) => {
    const item = cartItemsRef.current.find((cartItem) => cartItem.productId === productId)
    if (!item) return false
    if (item.quantity === 1) {
      setCartNotification({ type: 'error', message: 'A quantidade mínima é uma unidade. Remova o item para excluí-lo.' })
      return false
    }
    return setItemQuantity(productId, item.quantity - 1)
  }, [setItemQuantity])

  const removeFromCart = useCallback((productId) => {
    const productName = products.find((product) => product.id === productId)?.name
    commitItems(cartItemsRef.current.filter((item) => item.productId !== productId))
    setCartNotification({ type: 'success', message: `${productName ?? 'Produto'} removido da sua sacola.` })
  }, [commitItems, products])

  const clearCart = useCallback(() => {
    commitItems([])
    setCartNotification({ type: 'success', message: 'Sua sacola foi limpa.' })
  }, [commitItems])

  const dismissCartNotification = useCallback(() => setCartNotification(null), [])

  const items = useMemo(() => cartItems.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId && candidate.active)
    return product ? [{ ...item, product }] : []
  }), [cartItems, products])
  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  )
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [items],
  )

  const value = {
    cartItems,
    items,
    totalItems,
    subtotal,
    cartNotification,
    addToCart,
    setItemQuantity,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    dismissCartNotification,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartContext
