/**
 * Storage de mídias: apenas R2 (Cloudflare).
 * Supabase Storage não é mais usado para mídias.
 * Configure S3_* e NEXT_PUBLIC_R2_PUBLIC_URL para listar/upload de blog e projetos.
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

export { isR2Configured }
export const PROJETOS_MIDIAS_PREFIX = R2_PROJETOS_MIDIAS_PREFIX

export async function createSignedUploadUrlForBlog(filename: string) {
  return isR2Configured() ? r2CreateSignedUploadUrlForBlog(filename) : null
}

export async function createSignedUploadUrl(slug: string, filename: string) {
  return isR2Configured() ? r2CreateSignedUploadUrl(slug, filename) : null
}

export async function createSignedUploadUrlProjetosMedia(filename: string, subfolder?: string) {
  return isR2Configured()
    ? r2CreateSignedUploadUrlProjetosMedia(filename, subfolder)
    : null
}

export async function listBlogMediaFromStorage(options: {
  limit?: number
  offset?: number
  search?: string
}) {
  return isR2Configured() ? r2ListBlogMediaFromStorage(options) : []
}

export async function listProjetosMediaFromStorage(options: {
  prefixes: string[]
  limit?: number
  offset?: number
  search?: string
}) {
  return isR2Configured() ? r2ListProjetosMediaFromStorage(options) : []
}

export async function deleteBlogMediaFromStorage(path: string) {
  return isR2Configured() ? r2DeleteBlogMediaFromStorage(path) : false
}

export async function deleteProjetosMediaFromStorage(path: string) {
  return isR2Configured() ? r2DeleteProjetosMediaFromStorage(path) : false
}

export async function moveProjetosMediaInStorage(fromPath: string, toPath: string) {
  return isR2Configured() ? r2MoveProjetosMediaInStorage(fromPath, toPath) : false
}

export async function uploadBlogFile(path: string, buffer: Buffer, contentType: string) {
  return isR2Configured() ? r2UploadBlogFile(path, buffer, contentType) : null
}

/** URL pública de um arquivo no bucket R2. Retorna '' se R2 não estiver configurado. */
export function getStoragePublicUrl(path: string): string {
  return isR2Configured() ? getR2PublicUrl(path) : ''
}
