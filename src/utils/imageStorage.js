const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const MAX_STORED_IMAGE_BYTES = 220 * 1024

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Não foi possível processar esta imagem. Tente outro arquivo.'))
        return
      }

      resolve(blob)
    }, type, quality)
  })
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Não foi possível preparar a imagem para salvar no navegador.'))
    reader.readAsDataURL(blob)
  })
}

export async function compressImageForStorage(file) {
  if (!(file instanceof File) || !file.type.startsWith('image/')) {
    throw new Error('Selecione um arquivo de imagem válido.')
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('A imagem deve ter no máximo 10 MB antes da compactação.')
  }

  if (typeof createImageBitmap !== 'function') {
    throw new Error('Este navegador não oferece suporte à preparação local de imagens. Atualize o navegador e tente novamente.')
  }

  let bitmap

  try {
    bitmap = await createImageBitmap(file)

    if (bitmap.width * bitmap.height > 40_000_000) {
      throw new Error('A resolução da imagem é muito alta. Escolha uma imagem menor.')
    }

    const scale = Math.min(1, 800 / Math.max(bitmap.width, bitmap.height))
    let width = Math.max(1, Math.round(bitmap.width * scale))
    let height = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('Não foi possível preparar a imagem. Tente outro arquivo.')
    }

    let blob

    for (let attempt = 0; attempt < 4; attempt += 1) {
      canvas.width = width
      canvas.height = height
      context.clearRect(0, 0, width, height)
      context.drawImage(bitmap, 0, 0, width, height)

      for (const quality of [0.72, 0.55, 0.4]) {
        blob = await canvasToBlob(canvas, 'image/webp', quality)
        if (blob.size <= MAX_STORED_IMAGE_BYTES) break
      }

      if (blob.size <= MAX_STORED_IMAGE_BYTES) break
      width = Math.max(1, Math.round(width * 0.72))
      height = Math.max(1, Math.round(height * 0.72))
    }

    if (!blob || blob.size > MAX_STORED_IMAGE_BYTES) {
      throw new Error('Não foi possível compactar a imagem o suficiente para salvá-la com segurança no navegador.')
    }

    return await blobToDataUrl(blob)
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error('Ocorreu um erro ao preparar a imagem. Verifique o arquivo e tente novamente.')
  } finally {
    bitmap?.close()
  }
}
