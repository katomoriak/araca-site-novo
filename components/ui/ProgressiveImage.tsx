'use client'

import { useState, useRef } from 'react'
import Image, { type ImageProps } from 'next/image'
import { BLUR_DATA_URL } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { getPreviewImageUrl } from '@/lib/transform-content-images'

export interface ProgressiveImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL'> {
  /** URL da versão em baixa resolução (blur). Quando definida, exibe primeiro e depois prévia e alta qualidade. */
  blurPlaceholderUrl?: string | null
  /** URL da prévia (proxy, tamanho médio). Se não passada, derivada de src quando for URL do proxy/Supabase. */
  previewUrl?: string | null
  /** Exibe etiqueta "HQ" no canto quando a imagem em alta qualidade terminar de carregar. */
  showHqBadge?: boolean
  /**
   * Enquanto a prévia está visível e a alta qualidade carrega: 'full' = etiqueta "Prévia" + "Carregando alta qualidade" + ícone;
   * 'icon' = só o ícone de loading. Omitir = não exibe indicador.
   */
  previewLoadingVariant?: 'full' | 'icon'
}

function getLayerClass(className?: string) {
  const objectFit = className?.includes('object-contain') ? 'object-contain' : 'object-cover'
  return `absolute inset-0 h-full w-full ${objectFit}`
}

/**
 * Imagem com carregamento progressivo em 3 estágios: blur → prévia (proxy) → alta qualidade.
 * Animação de loading entre blur e prévia; alta qualidade só carrega após a prévia.
 * O wrapper respeita o tamanho final (min-w-0 min-h-0 overflow-hidden) para layouts justificados.
 */
export function ProgressiveImage({
  src,
  alt,
  blurPlaceholderUrl,
  previewUrl: previewUrlProp,
  showHqBadge = false,
  previewLoadingVariant,
  className,
  onLoad,
  ...rest
}: ProgressiveImageProps) {
  const [previewLoaded, setPreviewLoaded] = useState(false)
  const [fullLoaded, setFullLoaded] = useState(false)
  const [badgePosition, setBadgePosition] = useState<{ bottom: number; right: number } | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const derivedPreviewUrl = previewUrlProp ?? (typeof src === 'string' ? getPreviewImageUrl(src) : null)
  const previewUrl = derivedPreviewUrl ?? null
  const hasThreeStages = Boolean(blurPlaceholderUrl || previewUrl)

  const handlePreviewLoad = () => setPreviewLoaded(true)
  const handlePreviewError = () => setPreviewLoaded(true) // não travar: segue para carregar a imagem final

  const handleFullLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setFullLoaded(true)
    if (showHqBadge && wrapperRef.current) {
      const img = e.currentTarget
      const nw = img.naturalWidth
      const nh = img.naturalHeight
      const cw = wrapperRef.current.clientWidth
      const ch = wrapperRef.current.clientHeight
      const isContain = className?.includes('object-contain')
      if (!isContain || nw === 0 || nh === 0) {
        setBadgePosition({ bottom: 8, right: 8 })
      } else {
        const scale = Math.min(cw / nw, ch / nh)
        const rw = nw * scale
        const rh = nh * scale
        setBadgePosition({
          bottom: (ch - rh) / 2 + 8,
          right: (cw - rw) / 2 + 8,
        })
      }
    }
    onLoad?.(e)
  }

  if (!hasThreeStages) {
    return (
      <Image
        src={src}
        alt={alt}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className={className}
        onLoad={onLoad}
        {...rest}
      />
    )
  }

  const wrapperClassName = rest.fill ? 'absolute inset-0' : 'relative'
  const wrapperStyle =
    !rest.fill && rest.width != null && rest.height != null
      ? { width: rest.width, height: rest.height }
      : undefined

  const showLoading = Boolean(previewUrl && !previewLoaded)
  const showPreviewLoadingIndicator = Boolean(
    showHqBadge && previewLoadingVariant && previewLoaded && !fullLoaded,
  )
  const layerClass = getLayerClass(className)

  const loadingSpinnerIcon = (
    <span
      className="shrink-0 rounded-full border-2 border-current border-t-transparent animate-spin"
      style={{ width: 14, height: 14 }}
      aria-hidden
    />
  )

  return (
    <div
      ref={wrapperRef}
      className={cn(wrapperClassName, 'min-w-0 min-h-0 overflow-hidden')}
      style={wrapperStyle}
    >
      {/* 1. Camada blur (fundo) */}
      {blurPlaceholderUrl ? (
        <img
          src={blurPlaceholderUrl}
          alt=""
          aria-hidden
          className={layerClass}
        />
      ) : (
        <div
          className={layerClass}
          style={{ backgroundImage: `url(${BLUR_DATA_URL})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          aria-hidden
        />
      )}

      {/* 2. Animação de loading (entre blur e prévia) */}
      {showLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none"
          aria-hidden
        >
          <div className="h-10 w-10 rounded-full border-2 border-white/40 border-t-transparent animate-spin" />
        </div>
      )}

      {/* 3. Prévia (proxy); visível quando carregou */}
      {previewUrl && (
        <img
          src={previewUrl}
          alt=""
          aria-hidden
          className={cn(layerClass, 'transition-opacity duration-200', previewLoaded ? 'opacity-100' : 'opacity-0')}
          onLoad={handlePreviewLoad}
          onError={handlePreviewError}
        />
      )}

      {/* 4. Alta qualidade: só monta quando prévia carregou; transição ao carregar */}
      {(!previewUrl || previewLoaded) && (
        <Image
          src={src}
          alt={alt}
          {...rest}
          className={cn(
            layerClass,
            'transition-opacity duration-300',
            fullLoaded ? 'opacity-100' : 'opacity-0',
            className,
          )}
          onLoad={handleFullLoad}
        />
      )}

      {/* Indicador "Prévia" / carregando HQ: etiqueta completa (grandes) ou só ícone (pequenas) */}
      {showPreviewLoadingIndicator && (
        <span
          className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded px-1.5 py-1 text-[10px] font-medium bg-neutral-600/90 text-white shadow-sm pointer-events-none"
          style={{ maxWidth: 'calc(100% - 16px)' }}
          aria-hidden
        >
          {previewLoadingVariant === 'full' ? (
            <>
              <span className="truncate">Prévia</span>
              <span className="truncate">· Carregando alta qualidade</span>
              {loadingSpinnerIcon}
            </>
          ) : (
            loadingSpinnerIcon
          )}
        </span>
      )}

      {/* Etiqueta HQ na borda da imagem (na borda do conteúdo, não da div) */}
      {showHqBadge && fullLoaded && (
        <span
          className="absolute rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-neutral-600/90 text-white shadow-sm pointer-events-none"
          style={{
            bottom: badgePosition?.bottom ?? 8,
            right: badgePosition?.right ?? 8,
          }}
          aria-hidden
        >
          HQ
        </span>
      )}
    </div>
  )
}
