'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Home,
  ChevronDown,
  Plus,
  FileText,
  Image,
  Code,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function DSMenuVariations() {
  const [megaOpen, setMegaOpen] = useState(false)
  const [fabOpen, setFabOpen] = useState(false)

  return (
    <section id="menu-variations" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold text-neutral-900">Menu Variations</h2>
      <p className="mt-1 text-neutral-600">
        Cinco exemplos funcionais: Liquid Glass Navbar, Minimal Clean, Sidebar, Floating Action Menu, Mega Menu.
      </p>

      <div className="mt-8 space-y-12">
        {/* 1. Liquid Glass Navbar */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">1. Liquid Glass Navbar</h3>
          <div className="mt-3 rounded-2xl bg-gradient-to-r from-primary-500/80 to-secondary-500/80 p-6">
            <nav className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-xl">
              <span className="font-display font-semibold text-white">Brand</span>
              <div className="flex gap-6">
                <Link href="#" className="text-sm text-white/90 hover:text-white">Link 1</Link>
                <Link href="#" className="text-sm text-white/90 hover:text-white">Link 2</Link>
                <Link href="#" className="text-sm text-white/90 hover:text-white">Link 3</Link>
              </div>
            </nav>
          </div>
        </div>

        {/* 2. Minimal Clean */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">2. Minimal Clean</h3>
          <nav className="mt-3 flex gap-8 border-b border-neutral-200 pb-2">
            <Link href="#" className="border-b-2 border-primary-600 pb-2 text-sm font-medium text-primary-600">Home</Link>
            <Link href="#" className="pb-2 text-sm font-medium text-neutral-600 transition hover:border-b-2 hover:border-neutral-400 hover:text-neutral-900">Blog</Link>
            <Link href="#" className="pb-2 text-sm font-medium text-neutral-600 transition hover:border-b-2 hover:border-neutral-400 hover:text-neutral-900">Sobre</Link>
            <Link href="#" className="pb-2 text-sm font-medium text-neutral-600 transition hover:border-b-2 hover:border-neutral-400 hover:text-neutral-900">Contato</Link>
          </nav>
        </div>

        {/* 3. Sidebar Navigation */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">3. Sidebar Navigation</h3>
          <div className="mt-3 flex w-full max-w-xs flex-col gap-1 rounded-xl border border-neutral-200 bg-neutral-50 p-2">
            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-white">
              <Home className="h-5 w-5" /> Início
            </Link>
            <Link href="#" className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 text-sm font-medium text-primary-600 shadow-sm">
              <FileText className="h-5 w-5" /> Posts
            </Link>
            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-white">
              <Image className="h-5 w-5" /> Mídia
            </Link>
            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-white">
              <Code className="h-5 w-5" /> Código
            </Link>
          </div>
        </div>

        {/* 4. Floating Action Menu */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">4. Floating Action Menu</h3>
          <div className="relative mt-3 h-48 rounded-2xl bg-neutral-800">
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <div className="relative flex flex-col items-center gap-2">
                {fabOpen && (
                  <>
                    <button type="button" className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-neutral-900 shadow-lg">Ação A</button>
                    <button type="button" className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-neutral-900 shadow-lg">Ação B</button>
                    <button type="button" className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-neutral-900 shadow-lg">Ação C</button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setFabOpen((o) => !o)}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition hover:bg-primary-600"
                  aria-label={fabOpen ? 'Fechar menu' : 'Abrir menu'}
                >
                  <Plus className={cn('h-6 w-6 transition-transform', fabOpen && 'rotate-45')} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Mega Menu Dropdown */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">5. Mega Menu Dropdown</h3>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setMegaOpen((o) => !o)}
              className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Categorias <ChevronDown className={cn('h-4 w-4 transition-transform', megaOpen && 'rotate-180')} />
            </button>
            {megaOpen && (
              <div className="mt-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase text-neutral-500">Design</p>
                    <Link href="#" className="mt-2 block text-sm text-neutral-700 hover:text-primary-600">UI</Link>
                    <Link href="#" className="block text-sm text-neutral-700 hover:text-primary-600">UX</Link>
                    <Link href="#" className="block text-sm text-neutral-700 hover:text-primary-600">Tokens</Link>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-neutral-500">Dev</p>
                    <Link href="#" className="mt-2 block text-sm text-neutral-700 hover:text-primary-600">Frontend</Link>
                    <Link href="#" className="block text-sm text-neutral-700 hover:text-primary-600">Backend</Link>
                    <Link href="#" className="block text-sm text-neutral-700 hover:text-primary-600">API</Link>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-neutral-500">Recursos</p>
                    <Link href="#" className="mt-2 block text-sm text-neutral-700 hover:text-primary-600">Blog</Link>
                    <Link href="#" className="block text-sm text-neutral-700 hover:text-primary-600">Docs</Link>
                    <Link href="#" className="block text-sm text-neutral-700 hover:text-primary-600">Suporte</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
