/**
 * 404 do admin Payload – usa a view oficial para manter layout e navegação.
 * Doc: https://payloadcms.com/docs/admin/overview#project-structure
 */
import config from '@payload-config'
import { NotFoundPage } from '@payloadcms/next/views'
import { importMap } from '../importMap.js'

export default async function AdminNotFound() {
  return NotFoundPage({
    config: Promise.resolve(config),
    importMap,
    params: Promise.resolve({ segments: [] }),
    searchParams: Promise.resolve({}),
  })
}
