import { CategoryForm } from '../CategoryForm'

export default function NovaCategoriaPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <h1 className="text-2xl font-semibold">Nova categoria</h1>
      <CategoryForm isNew={true} />
    </div>
  )
}
