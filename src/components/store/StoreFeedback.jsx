import { Check, CircleX, X } from 'lucide-react'
import { useEffect } from 'react'
import useCart from '../../hooks/useCart.js'

function StoreFeedback() {
  const { cartNotification, dismissCartNotification } = useCart()

  useEffect(() => {
    if (!cartNotification || cartNotification.type === 'error') return undefined

    const timeout = window.setTimeout(dismissCartNotification, 3600)
    return () => window.clearTimeout(timeout)
  }, [cartNotification, dismissCartNotification])

  if (!cartNotification) return null

  const isError = cartNotification.type === 'error'
  const Icon = isError ? CircleX : Check

  return (
    <div className={`store-feedback store-feedback--${isError ? 'error' : 'success'}`} role={isError ? 'alert' : 'status'} aria-live={isError ? 'assertive' : 'polite'}>
      <Icon size={17} />
      <span>{cartNotification.message}</span>
      <button type="button" onClick={dismissCartNotification} aria-label="Fechar aviso"><X size={15} /></button>
    </div>
  )
}

export default StoreFeedback
