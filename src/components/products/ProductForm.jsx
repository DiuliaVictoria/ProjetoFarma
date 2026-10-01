import { ArrowLeft, ImagePlus, LoaderCircle, Save, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PRODUCT_CATEGORIES } from '../../data/mockData.js'
import { useProducts } from '../../context/ProductContext.jsx'
import { compressImageForStorage } from '../../utils/imageStorage.js'
import PageHeading from '../common/PageHeading.jsx'
import ProductImage from './ProductImage.jsx'

function makeInitialValues(product) {
  return {
    name: product?.name ?? '',
    category: product?.category ?? '',
    description: product?.description ?? '',
    price: product?.price == null ? '' : String(product.price),
    quantity: product?.quantity == null ? '0' : String(product.quantity),
    minStock: product?.minStock == null ? '10' : String(product.minStock),
    active: product?.active ?? true,
  }
}

function validate(values) {
  const errors = {}
  const name = values.name.trim()
  const price = Number(values.price)
  const quantity = Number(values.quantity)
  const minStock = Number(values.minStock)

  if (!name) errors.name = 'Informe o nome do produto.'
  if (!values.category) errors.category = 'Selecione uma categoria.'
  if (values.price === '' || !Number.isFinite(price) || price <= 0) errors.price = 'Informe um preço maior que zero.'
  if (values.quantity === '' || !Number.isInteger(quantity) || quantity < 0) errors.quantity = 'Informe uma quantidade inteira igual ou maior que zero.'
  if (values.minStock === '' || !Number.isInteger(minStock) || minStock < 0) errors.minStock = 'Informe um estoque mínimo inteiro igual ou maior que zero.'

  return errors
}

function ProductForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { products, addProduct, updateProduct } = useProducts()
  const product = isEditing ? products.find((item) => item.id === id) : null
  const [values, setValues] = useState(() => makeInitialValues(product))
  const [image, setImage] = useState(product?.image ?? '')
  const [imageError, setImageError] = useState('')
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isPreparingImage, setIsPreparingImage] = useState(false)
  const fileInputRef = useRef(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => { isMounted.current = false }
  }, [])

  useEffect(() => {
    setValues(makeInitialValues(product))
    setImage(product?.image ?? '')
    setFieldErrors({})
    setFormError('')
    setImageError('')
  }, [id, product?.id])

  async function handleImageChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setIsPreparingImage(true)
    setImageError('')
    setFormError('')

    try {
      const compressedImage = await compressImageForStorage(file)
      if (isMounted.current) setImage(compressedImage)
    } catch (error) {
      if (isMounted.current) setImageError(error.message)
    } finally {
      if (isMounted.current) setIsPreparingImage(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    const errors = validate(values)
    setFieldErrors(errors)
    setFormError('')

    if (Object.keys(errors).length) {
      setFormError('Revise os campos destacados antes de continuar.')
      return
    }

    const normalizedProduct = {
      name: values.name.trim(),
      category: values.category,
      description: values.description.trim(),
      price: Number(values.price),
      quantity: Number(values.quantity),
      minStock: Number(values.minStock),
      image,
      active: values.active,
    }

    if (isEditing) {
      updateProduct(product.id, normalizedProduct)
    } else {
      addProduct(normalizedProduct)
    }

    navigate('/admin/produtos', { replace: true })
  }

  if (isEditing && !product) {
    return (
      <div className="product-form-page">
        <PageHeading eyebrow="CATÁLOGO" title="Produto não encontrado" description="Este produto não está disponível no catálogo salvo neste navegador." />
        <div className="product-form__error" role="alert">Confira se o produto ainda existe ou volte para a lista.</div>
        <Link className="button button--outline product-form__back" to="/admin/produtos"><ArrowLeft size={15} /> Voltar para produtos</Link>
      </div>
    )
  }

  function handleChange(event) {
    const { name, value, checked, type } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setFieldErrors((current) => ({ ...current, [name]: '' }))
    setFormError('')
  }

  return (
    <div className="product-form-page">
      <PageHeading
        eyebrow="CATÁLOGO"
        title={isEditing ? 'Editar produto' : 'Novo produto'}
        description={isEditing ? 'Atualize as informações deste item do catálogo.' : 'Adicione as informações para organizar o novo item no seu catálogo.'}
      />

      <form className="product-form card" onSubmit={handleSubmit} noValidate>
        <div className="product-form__section">
          <div className="product-form__section-heading">
            <span className="product-form__step">01</span>
            <div><h2>Informações do produto</h2><p>Os dados principais que identificam este item.</p></div>
          </div>

          <div className="product-form__grid">
            <div className="form-field form-field--wide">
              <label htmlFor="product-name">Nome do produto <span>*</span></label>
              <input id="product-name" name="name" value={values.name} onChange={handleChange} placeholder="Ex.: Vitamina C 500 mg" autoComplete="off" aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'product-name-error' : undefined} />
              {fieldErrors.name && <span className="form-field__error" id="product-name-error">{fieldErrors.name}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="product-category">Categoria <span>*</span></label>
              <select id="product-category" name="category" value={values.category} onChange={handleChange} aria-invalid={Boolean(fieldErrors.category)} aria-describedby={fieldErrors.category ? 'product-category-error' : undefined}>
                <option value="">Selecione uma categoria</option>
                {PRODUCT_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              {fieldErrors.category && <span className="form-field__error" id="product-category-error">{fieldErrors.category}</span>}
            </div>

            <div className="form-field form-field--wide">
              <label htmlFor="product-description">Descrição <span className="form-field__optional">Opcional</span></label>
              <textarea id="product-description" name="description" value={values.description} onChange={handleChange} placeholder="Adicione detalhes para identificar melhor o produto." rows="3" maxLength="400" />
              <span className="form-field__hint">{values.description.length}/400 caracteres</span>
            </div>
          </div>
        </div>

        <div className="product-form__section">
          <div className="product-form__section-heading">
            <span className="product-form__step">02</span>
            <div><h2>Preço e estoque</h2><p>Defina o preço e acompanhe a disponibilidade do item.</p></div>
          </div>

          <div className="product-form__grid product-form__grid--three">
            <div className="form-field">
              <label htmlFor="product-price">Preço <span>*</span></label>
              <div className="form-input-prefix"><span>R$</span><input id="product-price" name="price" type="number" inputMode="decimal" min="0.01" step="0.01" value={values.price} onChange={handleChange} placeholder="0,00" aria-invalid={Boolean(fieldErrors.price)} aria-describedby={fieldErrors.price ? 'product-price-error' : undefined} /></div>
              {fieldErrors.price && <span className="form-field__error" id="product-price-error">{fieldErrors.price}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="product-quantity">Quantidade em estoque <span>*</span></label>
              <input id="product-quantity" name="quantity" type="number" inputMode="numeric" min="0" step="1" value={values.quantity} onChange={handleChange} aria-invalid={Boolean(fieldErrors.quantity)} aria-describedby={fieldErrors.quantity ? 'product-quantity-error' : undefined} />
              {fieldErrors.quantity && <span className="form-field__error" id="product-quantity-error">{fieldErrors.quantity}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="product-min-stock">Estoque mínimo <span>*</span></label>
              <input id="product-min-stock" name="minStock" type="number" inputMode="numeric" min="0" step="1" value={values.minStock} onChange={handleChange} aria-invalid={Boolean(fieldErrors.minStock)} aria-describedby={fieldErrors.minStock ? 'product-min-stock-error' : undefined} />
              {fieldErrors.minStock && <span className="form-field__error" id="product-min-stock-error">{fieldErrors.minStock}</span>}
            </div>
          </div>
        </div>

        <div className="product-form__section">
          <div className="product-form__section-heading">
            <span className="product-form__step">03</span>
            <div><h2>Imagem e visibilidade</h2><p>Escolha uma imagem e defina se o produto está ativo no catálogo.</p></div>
          </div>

          <div className="product-form__media">
            <ProductImage src={image} alt={values.name || 'Prévia do produto'} className="product-form__preview" />
            <div className="product-form__media-content">
              <strong>Imagem do produto</strong>
              <p>A imagem é redimensionada e compactada localmente antes de ser salva neste navegador.</p>
              <input ref={fileInputRef} className="visually-hidden" type="file" accept="image/*" onChange={handleImageChange} aria-label="Escolher imagem do produto" />
              <div className="product-form__media-actions">
                <button className="button button--outline" type="button" disabled={isPreparingImage} onClick={() => fileInputRef.current?.click()}>
                  {isPreparingImage ? <LoaderCircle size={15} className="spin" /> : <ImagePlus size={15} />}
                  {isPreparingImage ? 'Preparando imagem...' : image ? 'Trocar imagem' : 'Escolher imagem'}
                </button>
                {image && <button className="product-form__remove-image" type="button" onClick={() => { setImage(''); setImageError('') }}><X size={15} /> Remover</button>}
              </div>
              {imageError && <span className="form-field__error" role="alert">{imageError}</span>}
              <span className="form-field__hint">Até 10 MB antes da compactação. Formatos de imagem.</span>
            </div>
          </div>

          <label className="product-active-toggle">
            <input type="checkbox" name="active" checked={values.active} onChange={handleChange} />
            <span className="product-active-toggle__switch" />
            <span className="product-active-toggle__copy"><strong>Produto ativo</strong><small>Disponível para aparecer como ativo no catálogo.</small></span>
            <span className={`product-status${values.active ? ' product-status--active' : ' product-status--inactive'}`}><i />{values.active ? 'Ativo' : 'Inativo'}</span>
          </label>
        </div>

        {formError && <p className="product-form__error" role="alert">{formError}</p>}

        <footer className="product-form__footer">
          <Link className="product-form__back" to="/admin/produtos"><ArrowLeft size={15} /> Cancelar</Link>
          <button className="button button--green" type="submit" disabled={isPreparingImage}><Save size={16} /> {isEditing ? 'Salvar alterações' : 'Cadastrar produto'}</button>
        </footer>
      </form>
    </div>
  )
}

export default ProductForm
