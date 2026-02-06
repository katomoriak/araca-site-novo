/* Payload CMS 3 - layout para /admin e /api */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => {
  if (!config) {
    throw new Error(
      'Payload config não carregou. Verifique DATABASE_URL e PAYLOAD_SECRET no .env.local e se o payload.config.ts está correto.',
    )
  }
  return (
    <RootLayout
      config={Promise.resolve(config)}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  )
}

export default Layout
