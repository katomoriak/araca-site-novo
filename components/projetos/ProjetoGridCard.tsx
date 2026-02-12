'use client'

import Link from 'next/link'
import { ProgressiveImage } from '@/components/ui'
import { Images } from 'lucide-react'
import { getBlurPlaceholderUrl } from '@/lib/transform-content-images'
import type { ProjectGalleryItem } from '@/components/home/ProjectGallery'

interface ProjetoGridCardProps {
  project: ProjectGalleryItem
  /** Ao clicar em "Ver galeria", abre o modal da galeria em vez de navegar. */
  onOpenGallery?: (project: ProjectGalleryItem) => void
}

export function ProjetoGridCard({ project, onOpenGallery }: ProjetoGridCardProps) {
  const handleVerGaleriaClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (project.media?.length) onOpenGallery?.(project)
  }

  return (
    <Link
      href={`/projetos/${project.id}`}
      className="projeto-card-link group absolute inset-0 left-0 top-0 z-0 grid origin-center grid-cols-[1fr_0] overflow-hidden rounded-2xl bg-muted outline-none hover:z-10 hover:w-[calc(100%+14rem)] hover:grid-cols-[1fr_14rem] hover:shadow-xl hover:ring-2 hover:ring-araca-laranja-queimado/40 focus-visible:ring-2 focus-visible:ring-araca-laranja-queimado/40 focus:outline-none"
    >
      {/* Saída: botão→textos→(card mantém width e imagem)→painel fecha→scale. Largura explícita para transição manter área da imagem. */}
      <style dangerouslySetInnerHTML={{ __html: `
        .projeto-card-link, .projeto-card-link:hover { outline: none !important; }
        .projeto-card-link:focus { outline: none !important; box-shadow: none !important; }
        .projeto-card-link:focus-visible { outline: none !important; }
        .projeto-card-link:hover { box-shadow: 0 0 0 2px rgba(148, 75, 32, 0.4), 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important; }
        .projeto-card-link *:focus, .projeto-card-link *:focus-visible { outline: none !important; box-shadow: none !important; }
        .projeto-card-gallery-trigger:focus, .projeto-card-gallery-trigger:focus-visible { outline: none !important; box-shadow: none !important; }
        .projeto-card-link { width: 100%; transition: grid-template-columns 0.38s cubic-bezier(0.22,1,0.36,1) 0.5s, width 0.38s cubic-bezier(0.22,1,0.36,1) 0.5s, box-shadow 0.28s 0.5s; }
        .projeto-card-link:hover { width: calc(100% + 14rem); transition: grid-template-columns 0.38s cubic-bezier(0.22,1,0.36,1) 0.28s, width 0.38s cubic-bezier(0.22,1,0.36,1) 0.28s, box-shadow 0.28s 0.28s; }
        .projeto-card-overlay { transition: opacity 0.2s ease-out 0.5s; }
        .projeto-card-link:hover .projeto-card-overlay { opacity: 0; pointer-events: none; transition: opacity 0.2s ease-out 0s; }
      `}} />
      {/* Coluna da imagem: scale da imagem em sync com a abertura da aba para não dar “menor depois maior” */}
      <div className="relative min-h-0 min-w-0 overflow-hidden rounded-2xl transition-[border-radius] duration-300 ease-out group-hover:rounded-l-2xl">
        {/* Patch bege no canto direito: mesmo tom da aba, fica atrás da imagem; no hover perde o rounded para alinhar à aba */}
        <div
          className="absolute right-0 top-0 z-0 h-full w-4 rounded-r-2xl bg-araca-bege-claro transition-[border-radius] duration-300 ease-out group-hover:rounded-r-none"
          aria-hidden
        />
        <div
          className="relative z-10 h-full w-full overflow-hidden rounded-2xl transition-[border-radius] duration-300 ease-out group-hover:rounded-l-2xl group-hover:scale-105 group-hover:delay-150 group-hover:duration-300"
          style={{ transitionDelay: '0.45s' }}
        >
          <ProgressiveImage
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover h-full w-full"
            blurPlaceholderUrl={getBlurPlaceholderUrl(project.coverImage)}
          />
          {/* Overlay (texto na imagem): some primeiro ao hover, sem delay; na saída volta depois (delay no CSS) */}
          <div className="projeto-card-overlay absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6">
            {project.tag && (
              <span className="mb-2 inline-block w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {project.tag}
              </span>
            )}
            <h3 className="font-display text-xl font-bold text-white drop-shadow-lg sm:text-2xl">
              {project.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-white/90 drop-shadow">
              {project.description}
            </p>
          </div>
          {/* Botão: entrada por último; saída primeiro. Sem outline azul. */}
          <div
            className="projeto-card-gallery-trigger absolute inset-0 flex flex-col items-center justify-center bg-black/0 opacity-0 outline-none transition-all duration-220 ease-out group-hover:bg-black/20 group-hover:opacity-100 group-hover:delay-1000 focus:outline-none focus-visible:outline-none focus:shadow-none focus-visible:shadow-none"
            style={{ transitionDelay: '0s' }}
            onClick={handleVerGaleriaClick}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && onOpenGallery && project.media?.length) {
                e.preventDefault()
                e.stopPropagation()
                onOpenGallery(project)
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Ver galeria de imagens de ${project.title}`}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-medium text-araca-cafe-escuro shadow-lg pointer-events-none">
              <Images className="h-4 w-4" />
              Ver galeria
            </span>
          </div>
        </div>
      </div>

      {/* Aba: aparece quando o card começa a crescer; textos só depois que a aba terminou de abrir. Sem -ml: o patch bege na coluna da imagem cobre o canto. */}
      <div
        className="flex min-w-0 flex-col overflow-hidden rounded-r-2xl bg-araca-bege-claro opacity-0 transition-opacity duration-280 ease-out group-hover:opacity-100 group-hover:delay-300"
        style={{ transitionDelay: '0.28s' }}
      >
        <div className="flex h-full min-h-0 flex-col justify-center p-5">
          {project.tag && (
            <span
              className="mb-2 inline-block w-fit rounded-full bg-araca-cafe-escuro/10 px-3 py-1 text-xs font-medium text-araca-cafe-escuro opacity-0 transition-opacity duration-220 ease-out group-hover:opacity-100 group-hover:delay-1000"
              style={{ transitionDelay: '0.2s' }}
            >
              {project.tag}
            </span>
          )}
          <h3
            className="font-display text-lg font-bold text-araca-cafe-escuro opacity-0 transition-opacity duration-220 ease-out group-hover:opacity-100 group-hover:delay-700"
            style={{ transitionDelay: '0.18s' }}
          >
            {project.title}
          </h3>
          <p
            className="mt-2 overflow-y-auto text-sm leading-relaxed text-araca-cafe-escuro/90 opacity-0 transition-opacity duration-220 ease-out group-hover:opacity-100 group-hover:delay-1000"
            style={{ transitionDelay: '0.22s' }}
          >
            {project.description}
          </p>
        </div>
      </div>
    </Link>
  )
}
