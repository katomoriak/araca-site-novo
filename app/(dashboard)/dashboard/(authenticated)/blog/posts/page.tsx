import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DeletePostButton } from '@/components/dashboard/DeletePostButton'
import { Plus, Edit } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export default async function PostsPage() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    limit: 100,
    pagination: false,
    sort: '-publishedAt',
    depth: 2,
    overrideAccess: true,
  })
  
  const posts = (result.docs ?? []) as Array<{
    id: string
    title: string
    slug: string
    excerpt?: string | null
    status: 'draft' | 'published'
    publishedAt?: string | null
    author?: { name?: string; email?: string } | string | null
    category?: { name?: string; slug?: string } | string | null
    coverImage?: { url?: string; alt?: string } | string | null
  }>

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Posts do Blog</h1>
          <p className="text-muted-foreground">
            Gerencie os posts do blog. Crie, edite e publique conteúdo.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/blog/posts/novo">
            <Plus className="size-4" />
            Novo post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum post</CardTitle>
            <CardDescription>
              Crie seu primeiro post para começar a publicar conteúdo no blog.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => {
            const authorName = typeof post.author === 'object' && post.author?.name 
              ? post.author.name 
              : typeof post.author === 'object' && post.author?.email
              ? post.author.email
              : 'Sem autor'
            
            const categoryName = typeof post.category === 'object' && post.category?.name
              ? post.category.name
              : null

            const coverUrl = typeof post.coverImage === 'object' && post.coverImage?.url
              ? post.coverImage.url
              : null

            return (
              <Card key={post.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {coverUrl && (
                    <div className="relative aspect-video w-full sm:w-48 bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverUrl}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="line-clamp-1">{post.title}</CardTitle>
                          <CardDescription className="mt-1 line-clamp-2">
                            {post.excerpt}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/blog/posts/${post.slug}`} title="Editar">
                              <Edit className="size-4" />
                            </Link>
                          </Button>
                          <DeletePostButton slug={post.slug} title={post.title} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </Badge>
                      {categoryName && (
                        <Badge variant="outline">{categoryName}</Badge>
                      )}
                      <span>•</span>
                      <span>{authorName}</span>
                      {post.publishedAt && (
                        <>
                          <span>•</span>
                          <span>{new Date(post.publishedAt).toLocaleDateString('pt-BR')}</span>
                        </>
                      )}
                    </CardContent>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
