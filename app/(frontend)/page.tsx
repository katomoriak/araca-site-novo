import { HomePage } from '@/components/home/HomePage'
import { getProjetosCached } from '@/lib/projetos-server'

export const revalidate = 60

export default async function Page() {
  const initialProjects = await getProjetosCached()
  return <HomePage initialProjects={initialProjects} />
}
