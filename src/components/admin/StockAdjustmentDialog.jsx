import { ArrowDown, ArrowUp, Boxes, Minus, Plus, Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'

function StockAdjustmentDialog({ product, onCancel, onSave }) {
  const [quantity, setQuantity] = useState(String(product?.quantity ?? 0))
  const [error, setError] = useState('')

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onCancel()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  function handleSubmit(event) {
    event.preventDefault()
    const nextQuantity = Number(quantity)

    if (quantity.trim() === '' || !Number.isInteger(nextQuantity) || nextQuantity < 0) {
      setError('Informe uma quantidade inteira igual ou maior que zero.')
      return
    }

    onSave(nextQuantity)
  }

  if (!product) return null

  return (
    <div className="confirm-dialog-backdrop stock-adjustment-backdrop" onMouseDown={onCancel}>
      <section
        className="stock-adjustment-dialog card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-adjustment-title"
        aria-describedby="stock-adjustment-description"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="stock-adjustment-dialog__header">
          <span className="stock-adjustment-dialog__icon"><Boxes size={20} /></span>
          <button className="stock-adjustment-dialog__close" type="button" onClick={onCancel} aria-label="Fechar ajuste de estoque"><X size={18} /></button>
        </header>
        <p className="eyebrow">MOVIMENTAÇÃO DE ESTOQUE</p>
        <h2 id="stock-adjustment-title">Ajustar quantidade</h2>
        <p className="stock-adjustment-dialog__description" id="stock-adjustment-description">{product.name} · {product.category}</p>

        <div className="stock-adjustment-current">
          <span className="stock-adjustment-current__icon"><ArrowDown size={15} /><ArrowUp size={15} /></span>
          <span><small>Quantidade atual</small><strong>{product.quantity} <span>unidades</span></strong></span>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label className="form-field stock-adjustment-dialog__field" htmlFor="stock-new-quantity">
            <span>Nova quantidade em estoque <span>*</span></span>
            <span className="stock-adjustment-input">
              <input
                id="stock-new-quantity"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                autoFocus
                value={quantity}
                onChange={(event) => {
                  setQuantity(event.target.value)
                  setError('')
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'stock-quantity-error' : 'stock-quantity-hint'}
              />
              <span>unidades</span>
            </span>
            {error
              ? <span className="form-field__error" id="stock-quantity-error" role="alert">{error}</span>
              : <span className="form-field__hint" id="stock-quantity-hint">Informe a nova quantidade total. O estoque não pode ficar negativo.</span>}
          </label>
          <footer className="stock-adjustment-dialog__actions">
            <button className="button button--outline" type="button" onClick={onCancel}><Minus size={14} /> Cancelar</button>
            <button className="button button--green" type="submit"><Save size={15} /> Salvar quantidade <Plus size={14} /></button>
          </footer>
        </form>
      </section>
    </div>
  )
}

export default StockAdjustmentDialog
