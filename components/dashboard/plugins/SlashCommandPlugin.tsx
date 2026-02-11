'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect, useState, useCallback, useRef, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
import {
  $getSelection,
  $isRangeSelection,
  $getNodeByKey,
  TextNode,
} from 'lexical'
import { $setBlocksType } from '@lexical/selection'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list'
import { useImageDialog } from '../ImageDialogContext'
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Image as ImageIcon,
  Quote,
} from 'lucide-react'

interface SlashCommand {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  keywords: string[]
  onSelect: () => void
}

export default function SlashCommandPlugin(): ReactElement | null {
  const [editor] = useLexicalComposerContext()
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [slashNodeKey, setSlashNodeKey] = useState<string | null>(null)
  const [slashOffset, setSlashOffset] = useState(0)
  const slashNodeRef = useRef<TextNode | null>(null) // ref para Escape (precisa do nó no listener)
  const selectedItemRef = useRef<HTMLButtonElement>(null)
  const openImageDialog = useImageDialog()

  const commands: SlashCommand[] = [
    {
      id: 'h1',
      label: 'Título 1',
      description: 'Título grande',
      keywords: ['titulo', 'titulo1', 'h1', 'heading'],
      icon: <Heading1 className="size-4" />,
      onSelect: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode('h1'))
          }
        })
      },
    },
    {
      id: 'h2',
      label: 'Título 2',
      description: 'Título médio',
      keywords: ['titulo', 'titulo2', 'h2', 'heading'],
      icon: <Heading2 className="size-4" />,
      onSelect: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode('h2'))
          }
        })
      },
    },
    {
      id: 'h3',
      label: 'Título 3',
      description: 'Título pequeno',
      keywords: ['titulo', 'titulo3', 'h3', 'heading'],
      icon: <Heading3 className="size-4" />,
      onSelect: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode('h3'))
          }
        })
      },
    },
    {
      id: 'ul',
      label: 'Lista',
      description: 'Lista com marcadores',
      keywords: ['lista', 'bullet', 'ul'],
      icon: <List className="size-4" />,
      onSelect: () => {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
      },
    },
    {
      id: 'ol',
      label: 'Lista Numerada',
      description: 'Lista numerada',
      keywords: ['lista', 'numerada', 'numero', 'ol'],
      icon: <ListOrdered className="size-4" />,
      onSelect: () => {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
      },
    },
    {
      id: 'quote',
      label: 'Citação',
      description: 'Bloco de citação',
      keywords: ['citacao', 'quote', 'blockquote'],
      icon: <Quote className="size-4" />,
      onSelect: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode())
          }
        })
      },
    },
    {
      id: 'image',
      label: 'Imagem',
      description: 'Inserir imagem',
      keywords: ['imagem', 'image', 'foto', 'picture'],
      icon: <ImageIcon className="size-4" />,
      onSelect: () => openImageDialog?.(),
    },
  ]

  const filteredCommands = searchQuery
    ? commands.filter((cmd) => {
        const query = searchQuery.toLowerCase()
        return (
          cmd.label.toLowerCase().includes(query) ||
          cmd.description.toLowerCase().includes(query) ||
          cmd.keywords.some((kw) => kw.includes(query))
        )
      })
    : commands

  // Manter índice válido e scroll do item selecionado
  const safeSelectedIndex = Math.min(Math.max(0, selectedIndex), Math.max(0, filteredCommands.length - 1))
  useEffect(() => {
    if (!showMenu || filteredCommands.length === 0) return
    setSelectedIndex((prev) => Math.min(prev, filteredCommands.length - 1))
  }, [showMenu, filteredCommands.length])

  useEffect(() => {
    selectedItemRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [safeSelectedIndex, showMenu])

  const selectCommand = useCallback(
    (command: SlashCommand) => {
      const key = slashNodeKey
      const offset = slashOffset
      const queryLen = searchQuery.length
      setShowMenu(false)
      setSearchQuery('')
      setSlashNodeKey(null)
      slashNodeRef.current = null

      // Remover o texto "/comando" num update; executar onSelect fora para evitar nested updates
      try {
        editor.update(() => {
          if (key) {
            const node = $getNodeByKey(key)
            if (node instanceof TextNode) {
              const text = node.getTextContent()
              const end = offset + 1 + queryLen
              node.setTextContent(text.slice(0, offset) + text.slice(end))
            }
          }
        })
      } catch (e) {
        console.error('[SlashCommand] Erro ao remover texto:', e)
      }

      // Executar a ação do comando fora do update (evita erro com dropdown/block type)
      queueMicrotask(() => {
        try {
          command.onSelect()
        } catch (e) {
          console.error('[SlashCommand] Erro ao executar comando:', e)
        }
      })
    },
    [editor, slashNodeKey, slashOffset, searchQuery.length]
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showMenu) return

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
      } else if (event.key === 'Enter') {
        event.preventDefault()
        const index = Math.min(selectedIndex, Math.max(0, filteredCommands.length - 1))
        const command = filteredCommands[index]
        if (command) {
          selectCommand(command)
        }
      } else if (event.key === 'Escape') {
        event.preventDefault()
        const node = slashNodeRef.current
        const offset = slashOffset
        const qLen = searchQuery.length
        try {
          editor.update(() => {
            if (node) {
              const text = node.getTextContent()
              const end = offset + 1 + qLen
              node.setTextContent(text.slice(0, offset) + text.slice(end))
            }
          })
        } catch {
          // ignorar
        }
        setShowMenu(false)
        setSearchQuery('')
        setSlashNodeKey(null)
        slashNodeRef.current = null
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showMenu, selectedIndex, filteredCommands, selectCommand, editor, slashOffset, searchQuery])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) {
          setShowMenu(false)
          setSlashNodeKey(null)
          return
        }

        const node = selection.anchor.getNode()
        if (!(node instanceof TextNode)) {
          setShowMenu(false)
          setSlashNodeKey(null)
          return
        }

        const text = node.getTextContent()
        const anchorOffset = selection.anchor.offset

        // Procurar por "/" no início ou após espaço
        let slashIndex = -1
        for (let i = anchorOffset - 1; i >= 0; i--) {
          if (text[i] === '/') {
            // Verificar se é início da linha ou após espaço
            if (i === 0 || text[i - 1] === ' ' || text[i - 1] === '\n') {
              slashIndex = i
              break
            }
          } else if (text[i] === ' ' || text[i] === '\n') {
            break
          }
        }

        if (slashIndex === -1) {
          setShowMenu(false)
          setSlashNodeKey(null)
          return
        }

        const query = text.slice(slashIndex + 1, anchorOffset)
        setSearchQuery(query)
        setShowMenu(true)
        setSelectedIndex(0)
        setSlashNodeKey(node.getKey())
        setSlashOffset(slashIndex)
        slashNodeRef.current = node

        // Posição do menu (viewport: fixed usa coordenadas da tela)
        const domSelection = window.getSelection()
        if (domSelection && domSelection.rangeCount > 0) {
          const range = domSelection.getRangeAt(0)
          const rect = range.getBoundingClientRect()
          setMenuPosition({
            top: rect.bottom + 5,
            left: rect.left,
          })
        }
      })
    })
  }, [editor])

  if (!showMenu || filteredCommands.length === 0) {
    return null
  }

  const droplist = (
    <div
      className="fixed z-[100] w-72 rounded-lg border border-border bg-popover text-popover-foreground shadow-lg"
      style={{ top: menuPosition.top, left: menuPosition.left }}
      role="listbox"
      aria-label="Comandos do editor"
    >
      <div className="max-h-[280px] overflow-y-auto p-1">
        {filteredCommands.map((command, index) => (
          <button
            key={command.id}
            ref={index === safeSelectedIndex ? selectedItemRef : undefined}
            type="button"
            role="option"
            aria-selected={index === safeSelectedIndex}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
              index === safeSelectedIndex
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-accent/50'
            }`}
            onClick={() => selectCommand(command)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
              {command.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium">{command.label}</div>
              <div className="truncate text-xs text-muted-foreground">{command.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  return createPortal(droplist, document.body)
}
