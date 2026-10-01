import { ArrowLeft, Check, MapPin, MessageCircle, PackageCheck, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import useCart from '../../hooks/useCart.js'
import { createWhatsAppOrderUrl } from '../../services/whatsappService.js'

const initialForm = {
  name: '',
  phone: '',
  fulfillment: 'pickup',
  cep: '',
  street: '',
  number: '',
  complement: '',
  district: '',
  city: '',
  reference: '',
  payment: 'Pix',
}

const paymentOptions = ['Pix', 'Dinheiro', 'Cartão na retirada ou entrega']

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function Checkout() {
  const { items, totalItems, subtotal } = useCart()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setSubmitError('')
  }

  function validateForm() {
    const nextErrors = {}
    const phoneDigits = form.phone.replace(/\D/g, '')
    const cepDigits = form.cep.replace(/\D/g, '')

    if (form.name.trim().split(/\s+/).filter(Boolean).length < 2) {
      nextErrors.name = 'Informe seu nome completo.'
    }
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      nextErrors.phone = 'Informe um telefone com DDD.'
    }

    if (form.fulfillment === 'delivery') {
      if (cepDigits.length !== 8) nextErrors.cep = 'Informe um CEP válido com 8 dígitos.'
      if (!form.street.trim()) nextErrors.street = 'Informe a rua.'
      if (!form.number.trim()) nextErrors.number = 'Informe o número.'
      if (!form.district.trim()) nextErrors.district = 'Informe o bairro.'
      if (!form.city.trim()) nextErrors.city = 'Informe a cidade.'
    }

    if (!paymentOptions.includes(form.payment)) {
      nextErrors.payment = 'Selecione uma forma de pagamento.'
    }
    if (!items.length) {
      setSubmitError('Sua sacola está vazia. Adicione produtos antes de solicitar o pedido.')
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0 && items.length > 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')
    if (!validateForm()) return

    const order = {
      customer: { name: form.name.trim(), phone: form.phone.trim() },
      fulfillment: form.fulfillment,
      address: {
        cep: form.cep.trim(),
        street: form.street.trim(),
        number: form.number.trim(),
        complement: form.complement.trim(),
        district: form.district.trim(),
        city: form.city.trim(),
        reference: form.reference.trim(),
      },
      payment: form.payment,
      items,
      total: subtotal,
    }
    const url = createWhatsAppOrderUrl(order)

    if (!url) {
      setSubmitError('O WhatsApp da farmácia ainda não está configurado. Configure o número em src/services/whatsappService.js para habilitar o envio do pedido.')
      return
    }

    const whatsappWindow = window.open(url, '_blank')
    if (!whatsappWindow) {
      setSubmitError('Não foi possível abrir o WhatsApp. Verifique se o navegador bloqueou a nova janela e tente novamente.')
      return
    }
    whatsappWindow.opener = null
  }

  const fieldError = (name) => errors[name]

  function renderField({ name, label, type = 'text', placeholder, required = true, wide = false, autoComplete, inputMode }) {
    const error = fieldError(name)
    const id = `checkout-${name}`
    return (
      <div className={`form-field checkout-field${wide ? ' checkout-field--wide' : ''}`} key={name}>
        <label htmlFor={id}>{label}{required && <span> *</span>}</label>
        <input
          id={id}
          name={name}
          type={type}
          value={form[name]}
          onChange={updateField}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {error && <span className="form-field__error" id={`${id}-error`}>{error}</span>}
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-heading">
        <span className="eyebrow">SÓ MAIS UM PASSO</span>
        <h1>Solicitar pedido</h1>
        <p>Confira seus dados e envie sua solicitação para a farmácia pelo WhatsApp.</p>
      </div>

      {!items.length ? (
        <section className="checkout-empty card">
          <span className="checkout-empty__icon"><ShoppingBag size={23} /></span>
          <h2>Sua sacola está vazia</h2>
          <p>Adicione os produtos que deseja solicitar e volte para continuar.</p>
          <Link className="button button--green" to="/catalogo">Explorar catálogo</Link>
        </section>
      ) : (
        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <section className="checkout-section card">
              <div className="checkout-section__heading">
                <span className="checkout-section__icon"><MessageCircle size={17} /></span>
                <div><h2>Dados do cliente</h2><p>Para a farmácia entrar em contato com você.</p></div>
              </div>
              <div className="checkout-fields">
                {renderField({ name: 'name', label: 'Nome completo', placeholder: 'Ex.: Maria da Silva', autoComplete: 'name', wide: true })}
                {renderField({ name: 'phone', label: 'Telefone com DDD', type: 'tel', placeholder: '(11) 99999-9999', autoComplete: 'tel', inputMode: 'tel' })}
              </div>
            </section>

            <section className="checkout-section card">
              <div className="checkout-section__heading">
                <span className="checkout-section__icon"><MapPin size={17} /></span>
                <div><h2>Como deseja receber?</h2><p>Escolha retirada ou entrega.</p></div>
              </div>
              <div className="checkout-choice-grid">
                <label className={`checkout-choice${form.fulfillment === 'pickup' ? ' checkout-choice--selected' : ''}`}>
                  <input type="radio" name="fulfillment" value="pickup" checked={form.fulfillment === 'pickup'} onChange={updateField} />
                  <span className="checkout-choice__indicator"><Check size={12} /></span>
                  <span><strong>Retirada na farmácia</strong><small>Combine os detalhes pelo WhatsApp.</small></span>
                </label>
                <label className={`checkout-choice${form.fulfillment === 'delivery' ? ' checkout-choice--selected' : ''}`}>
                  <input type="radio" name="fulfillment" value="delivery" checked={form.fulfillment === 'delivery'} onChange={updateField} />
                  <span className="checkout-choice__indicator"><Check size={12} /></span>
                  <span><strong>Entrega</strong><small>Informe o endereço para consulta.</small></span>
                </label>
              </div>
              {form.fulfillment === 'delivery' && (
                <div className="checkout-fields checkout-fields--address">
                  {renderField({ name: 'cep', label: 'CEP', placeholder: '00000-000', autoComplete: 'postal-code', inputMode: 'numeric' })}
                  {renderField({ name: 'street', label: 'Rua', placeholder: 'Nome da rua', autoComplete: 'street-address', wide: true })}
                  {renderField({ name: 'number', label: 'Número', placeholder: 'Nº', autoComplete: 'address-line2' })}
                  {renderField({ name: 'complement', label: 'Complemento', placeholder: 'Apto, bloco...', required: false, autoComplete: 'address-line2' })}
                  {renderField({ name: 'district', label: 'Bairro', placeholder: 'Seu bairro', autoComplete: 'address-level3' })}
                  {renderField({ name: 'city', label: 'Cidade', placeholder: 'Sua cidade', autoComplete: 'address-level2' })}
                  {renderField({ name: 'reference', label: 'Referência', placeholder: 'Ponto de referência', required: false, wide: true })}
                </div>
              )}
            </section>

            <section className="checkout-section card">
              <div className="checkout-section__heading">
                <span className="checkout-section__icon"><PackageCheck size={17} /></span>
                <div><h2>Forma de pagamento</h2><p>Nenhuma cobrança é realizada nesta etapa.</p></div>
              </div>
              <div className="checkout-payment-options">
                {paymentOptions.map((option) => (
                  <label className={`checkout-payment-option${form.payment === option ? ' checkout-payment-option--selected' : ''}`} key={option}>
                    <input type="radio" name="payment" value={option} checked={form.payment === option} onChange={updateField} />
                    <span className="checkout-payment-option__radio" />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {errors.payment && <span className="form-field__error">{errors.payment}</span>}
            </section>

            {submitError && <div className="checkout-submit-error" role="alert">{submitError}</div>}
            <p className="checkout-disclaimer">Enviar a solicitação pelo WhatsApp não confirma o pedido. A disponibilidade, os valores finais e o atendimento serão confirmados pela farmácia. Nenhum pagamento será processado aqui.</p>
            <div className="checkout-form__actions">
              <Link className="button button--outline" to="/carrinho"><ArrowLeft size={15} /> Voltar à sacola</Link>
              <button className="button button--green" type="submit"><MessageCircle size={16} /> Solicitar pelo WhatsApp</button>
            </div>
          </form>

          <aside className="checkout-summary card" aria-label="Resumo do pedido">
            <span className="eyebrow">RESUMO DO PEDIDO</span>
            <h2>Sua solicitação</h2>
            <div className="checkout-summary__items">
              {items.map(({ product, quantity }) => (
                <div className="checkout-summary__item" key={product.id}>
                  <div><strong>{product.name}</strong><span>{quantity} {quantity === 1 ? 'unidade' : 'unidades'} × {formatCurrency(product.price)}</span></div>
                  <strong>{formatCurrency(product.price * quantity)}</strong>
                </div>
              ))}
            </div>
            <div className="checkout-summary__row"><span>Quantidade de itens</span><span>{totalItems}</span></div>
            <div className="checkout-summary__total"><span>Total solicitado</span><strong>{formatCurrency(subtotal)}</strong></div>
            <div className="checkout-summary__details">
              <span>Recebimento</span>
              <strong>{form.fulfillment === 'delivery' ? 'Entrega' : 'Retirada na farmácia'}</strong>
              {form.fulfillment === 'delivery' && form.street && (
                <p>
                  {form.street}{form.number ? `, ${form.number}` : ''}
                  {form.complement ? ` · ${form.complement}` : ''}
                  {form.district ? ` · ${form.district}` : ''}
                  {form.city ? ` · ${form.city}` : ''}
                  {form.cep ? ` · CEP ${form.cep}` : ''}
                  {form.reference ? ` · Referência: ${form.reference}` : ''}
                </p>
              )}
              <span>Pagamento</span>
              <strong>{form.payment}</strong>
            </div>
            <p className="checkout-summary__note">A entrega e a confirmação do pedido serão combinadas diretamente com a farmácia.</p>
          </aside>
        </div>
      )}

      <div className="checkout-assurance"><MessageCircle size={15} /> Você continuará a conversa no WhatsApp <span>·</span> <Link to="/catalogo">Continuar comprando</Link></div>
    </div>
  )
}

export default Checkout
