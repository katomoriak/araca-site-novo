/**
 * Utilitário para upload de imagens no conteúdo do blog.
 * Tenta signed URL (R2 ou Supabase) primeiro — sem limite de tamanho.
 * Fallback: FormData em /api/upload — máximo 4 MB.
 */
export async function uploadBlogImage(file: File): Promise<{
  url: string
  alt: string
}> {
  const alt = file.name

  // 1. Tentar signed URL (upload direto ao Supabase — sem limite de tamanho)
  const signedRes = await fetch('/api/upload/signed-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name }),
    credentials: 'include',
  })
  const signedData = await signedRes.json()

  if (signedRes.ok && signedData?.signedUrl && signedData?.publicUrl) {
    const putRes = await fetch(signedData.signedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    })
    if (putRes.ok) {
      return { url: signedData.publicUrl, alt }
    }
    throw new Error('Falha ao enviar imagem ao storage')
  }

  // 2. Fallback: FormData (máx 4 MB — Supabase não configurado ou signed URL falhou)
  if (signedRes.status === 401) {
    throw new Error(signedData?.message ?? 'Não autenticado')
  }
  if (signedRes.status === 503) {
    // Supabase não configurado — tentar FormData (pode falhar se > 4 MB)
    if (file.size > 4 * 1024 * 1024) {
      throw new Error(
        'Imagem muito grande. Configure R2 (NEXT_PUBLIC_R2_PUBLIC_URL + S3_*) ou Supabase para enviar arquivos maiores.'
      )
    }
  }

  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.message ?? 'Falha no upload')
  }
  return {
    url: data?.url ?? '',
    alt: data?.alt ?? alt,
  }
}
