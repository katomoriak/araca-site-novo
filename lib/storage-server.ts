/**
 * Storage unificado: R2 (prioridade) ou Supabase.
 * Quando NEXT_PUBLIC_R2_PUBLIC_URL e S3_* estão configurados, usa R2.
 * Caso contrário, usa Supabase.
 */
import {
  isR2Configured,
  getR2PublicUrl,
  createSignedUploadUrlForBlog as r2CreateSignedUploadUrlForBlog,
  createSignedUploadUrl as r2CreateSignedUploadUrl,
  createSignedUploadUrlProjetosMedia as r2CreateSignedUploadUrlProjetosMedia,
  listBlogMediaFromStorage as r2ListBlogMediaFromStorage,
  listProjetosMediaFromStorage as r2ListProjetosMediaFromStorage,
  deleteBlogMediaFromStorage as r2DeleteBlogMediaFromStorage,
  deleteProjetosMediaFromStorage as r2DeleteProjetosMediaFromStorage,
  moveProjetosMediaInStorage as r2MoveProjetosMediaInStorage,
  uploadBlogFile as r2UploadBlogFile,
  PROJETOS_MIDIAS_PREFIX as R2_PROJETOS_MIDIAS_PREFIX,
} from './storage-r2'
import {
  createSignedUploadUrlForBlog as supabaseCreateSignedUploadUrlForBlog,
  createSignedUploadUrl as supabaseCreateSignedUploadUrl,
  createSignedUploadUrlProjetosMedia as supabaseCreateSignedUploadUrlProjetosMedia,
  listBlogMediaFromStorage as supabaseListBlogMediaFromStorage,
  listProjetosMediaFromStorage as supabaseListProjetosMediaFromStorage,
  deleteBlogMediaFromStorage as supabaseDeleteBlogMediaFromStorage,
  deleteProjetosMediaFromStorage as supabaseDeleteProjetosMediaFromStorage,
  moveProjetosMediaInStorage as supabaseMoveProjetosMediaInStorage,
  PROJETOS_MIDIAS_PREFIX as SUPABASE_PROJETOS_MIDIAS_PREFIX,
} from './supabase-server'

const useR2 = isR2Configured()
export { isR2Configured }

export const PROJETOS_MIDIAS_PREFIX = useR2
  ? R2_PROJETOS_MIDIAS_PREFIX
  : SUPABASE_PROJETOS_MIDIAS_PREFIX

export async function createSignedUploadUrlForBlog(filename: string) {
  return useR2
    ? r2CreateSignedUploadUrlForBlog(filename)
    : supabaseCreateSignedUploadUrlForBlog(filename)
}

export async function createSignedUploadUrl(slug: string, filename: string) {
  return useR2 ? r2CreateSignedUploadUrl(slug, filename) : supabaseCreateSignedUploadUrl(slug, filename)
}

export async function createSignedUploadUrlProjetosMedia(filename: string, subfolder?: string) {
  return useR2
    ? r2CreateSignedUploadUrlProjetosMedia(filename, subfolder)
    : supabaseCreateSignedUploadUrlProjetosMedia(filename, subfolder)
}

export async function listBlogMediaFromStorage(options: {
  limit?: number
  offset?: number
  search?: string
}) {
  return useR2 ? r2ListBlogMediaFromStorage(options) : supabaseListBlogMediaFromStorage(options)
}

export async function listProjetosMediaFromStorage(options: {
  prefixes: string[]
  limit?: number
  offset?: number
  search?: string
}) {
  return useR2
    ? r2ListProjetosMediaFromStorage(options)
    : supabaseListProjetosMediaFromStorage(options)
}

export async function deleteBlogMediaFromStorage(path: string) {
  return useR2 ? r2DeleteBlogMediaFromStorage(path) : supabaseDeleteBlogMediaFromStorage(path)
}

export async function deleteProjetosMediaFromStorage(path: string) {
  return useR2
    ? r2DeleteProjetosMediaFromStorage(path)
    : supabaseDeleteProjetosMediaFromStorage(path)
}

export async function moveProjetosMediaInStorage(fromPath: string, toPath: string) {
  return useR2
    ? r2MoveProjetosMediaInStorage(fromPath, toPath)
    : supabaseMoveProjetosMediaInStorage(fromPath, toPath)
}

export async function uploadBlogFile(path: string, buffer: Buffer, contentType: string) {
  if (useR2) return r2UploadBlogFile(path, buffer, contentType)
  return null
}

/** URL pública de um arquivo (path relativo ao bucket). */
export function getStoragePublicUrl(path: string): string {
  if (useR2) return getR2PublicUrl(path)
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') ?? ''
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_PROJETOS_BUCKET ?? 'a_public'
  return `${base}/storage/v1/object/public/${bucket}/${path}`
}
