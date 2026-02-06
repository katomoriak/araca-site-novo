'use client'

import { useState, useMemo } from 'react'
import {
  Home,
  Menu,
  X,
  Search,
  User,
  Settings,
  Bell,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  MousePointerClick,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Mail,
  FileText,
  Calendar,
  Clock,
  Tag,
  Bookmark,
  Heart,
  Star,
  Eye,
  Share2,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Loader,
  Play,
  Pause,
  Image,
  Video,
  Music,
  File,
  Folder,
  Download,
  Upload,
  ShoppingCart,
  CreditCard,
  Package,
  Code,
  Terminal,
  Bug,
  Copy,
  Trash2,
  Edit,
  Save,
  Send,
  Link,
  ExternalLink,
  Zap,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Lock,
  Unlock,
  Filter,
  MoreHorizontal,
  Grid,
  List,
  MapPin,
  Phone,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type CategoryId = 'all' | 'navigation' | 'arrows' | 'social' | 'content' | 'ui' | 'media' | 'files' | 'commerce' | 'code'

interface IconItem {
  name: string
  Icon: LucideIcon
  category: CategoryId
}

const iconList: IconItem[] = [
  { name: 'Home', Icon: Home, category: 'navigation' },
  { name: 'Menu', Icon: Menu, category: 'navigation' },
  { name: 'X', Icon: X, category: 'navigation' },
  { name: 'Search', Icon: Search, category: 'navigation' },
  { name: 'User', Icon: User, category: 'navigation' },
  { name: 'Settings', Icon: Settings, category: 'navigation' },
  { name: 'Bell', Icon: Bell, category: 'navigation' },
  { name: 'ChevronDown', Icon: ChevronDown, category: 'arrows' },
  { name: 'ChevronUp', Icon: ChevronUp, category: 'arrows' },
  { name: 'ChevronLeft', Icon: ChevronLeft, category: 'arrows' },
  { name: 'ChevronRight', Icon: ChevronRight, category: 'arrows' },
  { name: 'ChevronsDown', Icon: ChevronsDown, category: 'arrows' },
  { name: 'ArrowDown', Icon: ArrowDown, category: 'arrows' },
  { name: 'ArrowUp', Icon: ArrowUp, category: 'arrows' },
  { name: 'ArrowLeft', Icon: ArrowLeft, category: 'arrows' },
  { name: 'ArrowRight', Icon: ArrowRight, category: 'arrows' },
  { name: 'MousePointerClick', Icon: MousePointerClick, category: 'arrows' },
  { name: 'Github', Icon: Github, category: 'social' },
  { name: 'Linkedin', Icon: Linkedin, category: 'social' },
  { name: 'Twitter', Icon: Twitter, category: 'social' },
  { name: 'Instagram', Icon: Instagram, category: 'social' },
  { name: 'Facebook', Icon: Facebook, category: 'social' },
  { name: 'Youtube', Icon: Youtube, category: 'social' },
  { name: 'Mail', Icon: Mail, category: 'social' },
  { name: 'FileText', Icon: FileText, category: 'content' },
  { name: 'Calendar', Icon: Calendar, category: 'content' },
  { name: 'Clock', Icon: Clock, category: 'content' },
  { name: 'Tag', Icon: Tag, category: 'content' },
  { name: 'Bookmark', Icon: Bookmark, category: 'content' },
  { name: 'Heart', Icon: Heart, category: 'content' },
  { name: 'Star', Icon: Star, category: 'content' },
  { name: 'Eye', Icon: Eye, category: 'content' },
  { name: 'Share2', Icon: Share2, category: 'content' },
  { name: 'Plus', Icon: Plus, category: 'ui' },
  { name: 'Minus', Icon: Minus, category: 'ui' },
  { name: 'Check', Icon: Check, category: 'ui' },
  { name: 'AlertCircle', Icon: AlertCircle, category: 'ui' },
  { name: 'Info', Icon: Info, category: 'ui' },
  { name: 'HelpCircle', Icon: HelpCircle, category: 'ui' },
  { name: 'XCircle', Icon: XCircle, category: 'ui' },
  { name: 'CheckCircle', Icon: CheckCircle, category: 'ui' },
  { name: 'AlertTriangle', Icon: AlertTriangle, category: 'ui' },
  { name: 'Loader', Icon: Loader, category: 'ui' },
  { name: 'Play', Icon: Play, category: 'media' },
  { name: 'Pause', Icon: Pause, category: 'media' },
  { name: 'Image', Icon: Image, category: 'media' },
  { name: 'Video', Icon: Video, category: 'media' },
  { name: 'Music', Icon: Music, category: 'media' },
  { name: 'File', Icon: File, category: 'files' },
  { name: 'Folder', Icon: Folder, category: 'files' },
  { name: 'Download', Icon: Download, category: 'files' },
  { name: 'Upload', Icon: Upload, category: 'files' },
  { name: 'ShoppingCart', Icon: ShoppingCart, category: 'commerce' },
  { name: 'CreditCard', Icon: CreditCard, category: 'commerce' },
  { name: 'Package', Icon: Package, category: 'commerce' },
  { name: 'Code', Icon: Code, category: 'code' },
  { name: 'Terminal', Icon: Terminal, category: 'code' },
  { name: 'Bug', Icon: Bug, category: 'code' },
  { name: 'Copy', Icon: Copy, category: 'code' },
  { name: 'Trash2', Icon: Trash2, category: 'ui' },
  { name: 'Edit', Icon: Edit, category: 'ui' },
  { name: 'Save', Icon: Save, category: 'ui' },
  { name: 'Send', Icon: Send, category: 'ui' },
  { name: 'Link', Icon: Link, category: 'content' },
  { name: 'ExternalLink', Icon: ExternalLink, category: 'content' },
  { name: 'Zap', Icon: Zap, category: 'ui' },
  { name: 'Sun', Icon: Sun, category: 'media' },
  { name: 'Moon', Icon: Moon, category: 'media' },
  { name: 'Cloud', Icon: Cloud, category: 'media' },
  { name: 'CloudRain', Icon: CloudRain, category: 'media' },
  { name: 'Lock', Icon: Lock, category: 'ui' },
  { name: 'Unlock', Icon: Unlock, category: 'ui' },
  { name: 'Filter', Icon: Filter, category: 'ui' },
  { name: 'MoreHorizontal', Icon: MoreHorizontal, category: 'ui' },
  { name: 'Grid', Icon: Grid, category: 'ui' },
  { name: 'List', Icon: List, category: 'ui' },
  { name: 'MapPin', Icon: MapPin, category: 'content' },
  { name: 'Phone', Icon: Phone, category: 'social' },
  { name: 'MessageCircle', Icon: MessageCircle, category: 'social' },
]

const categories: { id: CategoryId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'arrows', label: 'Arrows' },
  { id: 'social', label: 'Social' },
  { id: 'content', label: 'Content' },
  { id: 'ui', label: 'UI' },
  { id: 'media', label: 'Media' },
  { id: 'files', label: 'Files' },
  { id: 'commerce', label: 'Commerce' },
  { id: 'code', label: 'Code' },
]

const iconSizes = [16, 20, 24, 32, 48] as const

export function DSIconGallery() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<CategoryId>('all')

  const filtered = useMemo(() => {
    let list = category === 'all' ? iconList : iconList.filter((i) => i.category === category)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((i) => i.name.toLowerCase().includes(q))
    }
    return list
  }, [search, category])

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name)
  }

  return (
    <section id="icon-gallery" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold text-neutral-900">Icon Gallery</h2>
      <p className="mt-1 text-neutral-600">
        80+ ícones Lucide por categoria. Busca e filtros funcionais. Clique no ícone para copiar o nome.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            placeholder="Buscar ícone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                category === c.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Icon sizes (16, 20, 24, 32, 48px)</h3>
        <div className="mt-3 flex flex-wrap items-end gap-6 border-b border-neutral-200 pb-6">
          {iconSizes.map((size) => (
            <div key={size} className="flex flex-col items-center gap-1">
              <Search className="text-neutral-700" size={size} />
              <span className="text-xs text-neutral-500">{size}px</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
        {filtered.map(({ name, Icon }) => (
          <button
            key={name}
            type="button"
            onClick={() => copyName(name)}
            className="flex flex-col items-center gap-2 rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
            title={`Copiar: ${name}`}
          >
            <Icon className="h-6 w-6 text-neutral-700" />
            <span className="text-xs font-medium text-neutral-600 truncate w-full text-center">{name}</span>
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-8 text-center text-neutral-500">Nenhum ícone encontrado.</p>
      )}
    </section>
  )
}
