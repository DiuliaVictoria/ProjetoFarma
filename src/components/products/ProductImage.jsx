import { Image as ImageIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

function ProductImage({ src, alt, className = '' }) {
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => setImageFailed(false), [src])

  return (
    <div className={`product-image ${className}`.trim()}>
      {src && !imageFailed ? (
        <img src={src} alt={alt} onError={() => setImageFailed(true)} />
      ) : (
        <span className="product-image__placeholder" aria-label="Sem imagem cadastrada">
          <ImageIcon size={22} strokeWidth={1.6} />
          <span>Sem imagem</span>
        </span>
      )}
    </div>
  )
}

export default ProductImage
