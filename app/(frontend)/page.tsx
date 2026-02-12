import { HomePage } from '@/components/home/HomePage'
import { getProjetosCachedForHome } from '@/lib/projetos-server'

export const revalidate = 60

export default async function Page() {
  const initialProjects = await getProjetosCachedForHome()
  return <HomePage initialProjects={initialProjects} />
}
