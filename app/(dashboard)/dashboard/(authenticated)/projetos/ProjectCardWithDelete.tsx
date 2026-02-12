'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Trash2 } from 'lucide-react'
import { ProjectCoverImage } from './ProjectCoverImage'
import { DeleteProjectDialog } from './DeleteProjectDialog'

interface ProjectCardWithDeleteProps {
  slug: string
  title: string
  tag?: string | null
  coverSrc: string
}

export function ProjectCardWithDelete({
  slug,
  title,
  tag,
  coverSrc,
}: ProjectCardWithDeleteProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <div className="group relative">
        <Link href={`/dashboard/projetos/${encodeURIComponent(slug)}`} className="block">
          <Card className="overflow-hidden transition-shadow hover:shadow-md">
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <ProjectCoverImage
                src={coverSrc}
                alt={title}
                className="h-full w-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setDeleteOpen(true)
                }}
                aria-label="Excluir galeria"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="line-clamp-1 text-base">{title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                {tag && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs">
                    {tag}
                  </span>
                )}
                <span className="text-xs">{slug}</span>
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
      <DeleteProjectDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        projectTitle={title}
        projectSlug={slug}
      />
    </>
  )
}
