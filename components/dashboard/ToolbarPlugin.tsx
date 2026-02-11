'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useCallback, useEffect, useState } from 'react'
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import { $setBlocksType } from '@lexical/selection'
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from '@lexical/rich-text'
import { $createParagraphNode } from 'lexical'
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Image as ImageIcon,
  Link as LinkIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LinkToolbarButton } from './plugins/LinkPlugin'
import { useImageDialog } from './ImageDialogContext'

const blockTypeToBlockName = {
  paragraph: 'Normal',
  h1: 'Título 1',
  h2: 'Título 2',
  h3: 'Título 3',
  quote: 'Citação',
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isCode, setIsCode] = useState(false)
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph')
  const openImageDialog = useImageDialog()

  const updateToolbar = useCallback(() => {
    try {
      const selection = $getSelection()
      if (selection && $isRangeSelection(selection)) {
        setIsBold(selection.hasFormat('bold'))
        setIsItalic(selection.hasFormat('italic'))
        setIsUnderline(selection.hasFormat('underline'))
        setIsStrikethrough(selection.hasFormat('strikethrough'))
        setIsCode(selection.hasFormat('code'))
      }
    } catch {
      // ignorar erros de leitura da seleção
    }
  }, [])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar()
      })
    })
  }, [editor, updateToolbar])

  const formatParagraph = () => {
    try {
      editor.update(() => {
        const selection = $getSelection()
        if (selection && $isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode())
        }
      })
      setBlockType('paragraph')
    } catch (e) {
      console.error('[Toolbar] formatParagraph:', e)
    }
  }

  const formatHeading = (headingSize: HeadingTagType) => {
    try {
      editor.update(() => {
        const selection = $getSelection()
        if (selection && $isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize))
        }
      })
      setBlockType(headingSize as keyof typeof blockTypeToBlockName)
    } catch (e) {
      console.error('[Toolbar] formatHeading:', e)
    }
  }

  const formatQuote = () => {
    try {
      editor.update(() => {
        const selection = $getSelection()
        if (selection && $isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode())
        }
      })
      setBlockType('quote')
    } catch (e) {
      console.error('[Toolbar] formatQuote:', e)
    }
  }

  const handleBlockTypeChange = (value: string) => {
    // Executar após o dropdown fechar (evita erro com Radix Select / focus)
    queueMicrotask(() => {
      try {
        if (value === 'paragraph') {
          formatParagraph()
        } else if (value === 'h1' || value === 'h2' || value === 'h3') {
          formatHeading(value as HeadingTagType)
        } else if (value === 'quote') {
          formatQuote()
        }
      } catch (e) {
        console.error('[Toolbar] handleBlockTypeChange:', e)
      }
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-input bg-muted/50 p-2">
      <Select value={blockType} onValueChange={handleBlockTypeChange}>
        <SelectTrigger className="h-8 w-32 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Normal</SelectItem>
          <SelectItem value="h1">Título 1</SelectItem>
          <SelectItem value="h2">Título 2</SelectItem>
          <SelectItem value="h3">Título 3</SelectItem>
          <SelectItem value="quote">Citação</SelectItem>
        </SelectContent>
      </Select>

      <div className="mx-1 h-6 w-px bg-border" />

      <Button
        type="button"
        variant={isBold ? 'secondary' : 'ghost'}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        aria-label="Negrito"
      >
        <Bold className="size-4" />
      </Button>

      <Button
        type="button"
        variant={isItalic ? 'secondary' : 'ghost'}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        aria-label="Itálico"
      >
        <Italic className="size-4" />
      </Button>

      <Button
        type="button"
        variant={isUnderline ? 'secondary' : 'ghost'}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        aria-label="Sublinhado"
      >
        <Underline className="size-4" />
      </Button>

      <Button
        type="button"
        variant={isStrikethrough ? 'secondary' : 'ghost'}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        aria-label="Tachado"
      >
        <Strikethrough className="size-4" />
      </Button>

      <Button
        type="button"
        variant={isCode ? 'secondary' : 'ghost'}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        aria-label="Código"
      >
        <Code className="size-4" />
      </Button>

      <div className="mx-1 h-6 w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
        aria-label="Lista não ordenada"
      >
        <List className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
        aria-label="Lista ordenada"
      >
        <ListOrdered className="size-4" />
      </Button>

      <div className="mx-1 h-6 w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => openImageDialog?.()}
        aria-label="Inserir imagem"
      >
        <ImageIcon className="size-4" />
      </Button>

      <LinkToolbarButton />

      <div className="mx-1 h-6 w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        aria-label="Desfazer"
      >
        <Undo className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        aria-label="Refazer"
      >
        <Redo className="size-4" />
      </Button>

      <div className="ml-auto text-xs text-muted-foreground">
        Digite <kbd className="rounded bg-muted px-1 py-0.5 font-mono">/</kbd> para comandos
      </div>
    </div>
  )
}
