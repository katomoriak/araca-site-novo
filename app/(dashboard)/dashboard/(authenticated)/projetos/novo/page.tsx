import { ProjetoForm } from '../ProjetoForm'

export default function NovoProjetoPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <h1 className="text-2xl font-semibold">Novo projeto</h1>
      <ProjetoForm isNew={true} />
    </div>
  )
}
