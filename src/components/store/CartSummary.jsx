import { ArrowRight, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from '../products/ConfirmDialog.jsx'

function CartSummary({ totalItems, subtotal, onClear }) {
  const [showClearDialog, setShowClearDialog] = useState(false)
  const formattedSubtotal = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  function handleClear() {
    onClear()
    setShowClearDialog(false)
  }

  return (
    <>
      <aside className="store-cart-summary card" aria-label="Resumo da sacola">
        <span className="eyebrow">RESUMO</span>
        <h2>Sua escolha</h2>
        <div className="store-cart-summary__row">
          <span>Itens ({totalItems})</span>
          <span>{formattedSubtotal}</span>
        </div>
        <div className="store-cart-summary__row">
          <span>Entrega</span>
          <span className="store-cart-summary__pending">A combinar</span>
        </div>
        <div className="store-cart-summary__total">
          <span>Subtotal</span>
          <strong>{formattedSubtotal}</strong>
        </div>
        <p>O valor de entrega será informado em uma próxima etapa.</p>
        <Link className="button button--green store-cart-summary__checkout" to="/checkout">
          Ir para checkout <ArrowRight size={15} />
        </Link>
        <span className="store-cart-summary__note">A finalização do pedido ainda não está habilitada.</span>
        <button
          className="store-cart-summary__clear"
          type="button"
          onClick={() => setShowClearDialog(true)}
        >
          <Trash2 size={14} /> Limpar carrinho
        </button>
      </aside>
      <ConfirmDialog
        open={showClearDialog}
        title="Limpar sua sacola?"
        description="Todos os produtos serão removidos da sacola. Esta ação não pode ser desfeita."
        confirmLabel="Limpar sacola"
        onConfirm={handleClear}
        onCancel={() => setShowClearDialog(false)}
      />
    </>
  )
}

export default CartSummary
