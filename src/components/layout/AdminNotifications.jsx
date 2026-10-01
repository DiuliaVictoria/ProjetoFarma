import { CircleCheck, CircleX, X } from 'lucide-react'
import { useEffect } from 'react'
import { useProducts } from '../../context/ProductContext.jsx'

function AdminNotifications() {
  const { notification, dismissNotification } = useProducts()

  useEffect(() => {
    if (!notification || notification.type === 'error') return undefined

    const timeout = window.setTimeout(dismissNotification, 4500)
    return () => window.clearTimeout(timeout)
  }, [notification, dismissNotification])

  if (!notification) return null

  const Icon = notification.type === 'error' ? CircleX : CircleCheck

  return (
    <div className={`admin-notification admin-notification--${notification.type}`} role={notification.type === 'error' ? 'alert' : 'status'} aria-live={notification.type === 'error' ? 'assertive' : 'polite'}>
      <Icon size={18} />
      <span>{notification.message}</span>
      <button type="button" onClick={dismissNotification} aria-label="Fechar mensagem"><X size={16} /></button>
    </div>
  )
}

export default AdminNotifications
