import { AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

function ConfirmDialog({ open, title, description, confirmLabel = 'Excluir produto', onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') onCancel()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="confirm-dialog-backdrop" onMouseDown={onCancel}>
      <section
        className="confirm-dialog card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span className="confirm-dialog__icon"><AlertTriangle size={21} /></span>
        <h2 id="confirm-dialog-title">{title}</h2>
        <p id="confirm-dialog-description">{description}</p>
        <div className="confirm-dialog__actions">
          <button className="button button--outline" type="button" onClick={onCancel}>Cancelar</button>
          <button className="button button--danger" type="button" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmDialog
