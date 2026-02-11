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
import { Plus, Edit } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export default async function CategoriesPage() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'categories',
    limit: 100,
    pagination: false,
    sort: 'name',
    overrideAccess: true,
  })
  
  const categories = (result.docs ?? []) as Array<{
    id: string
    name: string
    slug: string
    description?: string | null
    color?: string | null
  }>

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categorias do Blog</h1>
          <p className="text-muted-foreground">
            Gerencie as categorias dos posts do blog.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/blog/categories/novo">
            <Plus className="size-4" />
            Nova categoria
          </Link>
        </Button>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma categoria</CardTitle>
            <CardDescription>
              Crie sua primeira categoria para organizar os posts do blog.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {category.color && (
                        <div
                          className="size-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                      <CardTitle className="line-clamp-1 text-base">{category.name}</CardTitle>
                    </div>
                    <CardDescription className="mt-1">
                      <code className="text-xs">{category.slug}</code>
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/blog/categories/${category.slug}`}>
                      <Edit className="size-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              {category.description && (
                <CardContent className="text-sm text-muted-foreground">
                  <p className="line-clamp-2">{category.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
