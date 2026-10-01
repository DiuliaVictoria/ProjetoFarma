import StoreEmptyState from './StoreEmptyState.jsx'

function EmptyCart() {
  return (
    <StoreEmptyState
      title="Sua sacola está esperando por você"
      description="Quando encontrar algo para o seu cuidado, ele aparecerá aqui."
      actionLabel="Continuar comprando"
      to="/catalogo"
    />
  )
}

export default EmptyCart
