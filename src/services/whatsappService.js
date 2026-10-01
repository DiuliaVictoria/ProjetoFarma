// Configure the pharmacy's country code and number using digits only; keep empty until provided.
export const WHATSAPP_PHONE = ''

const formatCurrency = (value) => value.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function createWhatsAppOrderMessage(order) {
  const productLines = order.items.map(({ product, quantity }) => (
    `• ${product.name} — ${quantity} un. x ${formatCurrency(product.price)} = ${formatCurrency(product.price * quantity)}`
  ))
  const fulfillmentLabel = order.fulfillment === 'delivery'
    ? 'Entrega'
    : 'Retirada na farmácia'
  const addressLines = order.fulfillment === 'delivery'
    ? [
        `CEP: ${order.address.cep}`,
        `Endereço: ${order.address.street}, ${order.address.number}`,
        order.address.complement ? `Complemento: ${order.address.complement}` : null,
        `Bairro: ${order.address.district}`,
        `Cidade: ${order.address.city}`,
        order.address.reference ? `Referência: ${order.address.reference}` : null,
      ].filter(Boolean)
    : []

  return [
    'Olá! Gostaria de solicitar este pedido:',
    '',
    'DADOS DO CLIENTE',
    `Nome: ${order.customer.name}`,
    `Telefone: ${order.customer.phone}`,
    '',
    'PRODUTOS',
    ...productLines,
    '',
    `Total: ${formatCurrency(order.total)}`,
    `Recebimento: ${fulfillmentLabel}`,
    ...(addressLines.length ? ['', 'ENDEREÇO', ...addressLines] : []),
    `Pagamento: ${order.payment}`,
    '',
    'Se possível, confirme a disponibilidade, o valor final e os próximos passos. Sei que o pedido só estará confirmado após o retorno da farmácia.',
  ].join('\n')
}

export function createWhatsAppOrderUrl(order) {
  const phone = WHATSAPP_PHONE.replace(/\D/g, '')
  if (!phone) return null

  const message = createWhatsAppOrderMessage(order)
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
