'use client'

import { useEffect, useRef } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeNode } from '@lexical/code'
import { LinkNode, AutoLinkNode } from '@lexical/link'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { $getRoot, EditorState } from 'lexical'
import ToolbarPlugin from './ToolbarPlugin'
import ImagePlugin, { ImageNode } from './plugins/ImagePlugin'
import SlashCommandPlugin from './plugins/SlashCommandPlugin'
import { ImageDialogProvider } from './ImageDialogContext'
import LinkPlugin from './plugins/LinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

// Plugin para carregar conteúdo inicial HTML
function LoadInitialContentPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (!isFirstRender.current || !html) return
    isFirstRender.current = false

    try {
      editor.update(() => {
        const parser = new DOMParser()
        const dom = parser.parseFromString(html, 'text/html')
        const nodes = $generateNodesFromDOM(editor, dom)
        const root = $getRoot()
        root.clear()
        if (nodes.length > 0) {
          root.append(...nodes)
        }
      })
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error)
    }
  }, [editor, html])

  return null
}

/** Usa o editor do contexto (com nós registrados) para gerar HTML, evitando erro _nodes undefined. */
function OnChangeHandler({ onChange }: { onChange: (value: string) => void }) {
  const [editor] = useLexicalComposerContext()

  const handleChange = (editorState: EditorState) => {
    try {
      editorState.read(() => {
        if (!editor) return
        // Usar o editor do contexto (com ImageNode etc. registrados), não editorState._editor
        const html = $generateHtmlFromNodes(editor, null)
        onChange(html)
      })
    } catch (e) {
      console.error('Erro ao gerar HTML do editor:', e)
    }
  }

  return <OnChangePlugin onChange={handleChange} />
}

export function RichTextEditor({ value, onChange, placeholder = 'Escreva o conteúdo aqui...' }: RichTextEditorProps) {
  const initialConfig = {
    namespace: 'PostEditor',
    theme: {
      paragraph: 'mb-2',
      heading: {
        h1: 'text-3xl font-bold mb-4 mt-6',
        h2: 'text-2xl font-bold mb-3 mt-5',
        h3: 'text-xl font-bold mb-2 mt-4',
        h4: 'text-lg font-bold mb-2 mt-3',
        h5: 'text-base font-bold mb-2 mt-2',
      },
      list: {
        ul: 'list-disc list-inside mb-2',
        ol: 'list-decimal list-inside mb-2',
        listitem: 'ml-4',
      },
      link: 'text-blue-600 underline hover:text-blue-800 cursor-pointer',
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
        code: 'bg-gray-100 px-1 py-0.5 rounded font-mono text-sm',
      },
      code: 'bg-gray-100 p-4 rounded font-mono text-sm block mb-2',
      quote: 'border-l-4 border-gray-300 pl-4 italic mb-2',
      image: 'editor-image',
    },
    onError: (error: Error) => {
      console.error('Lexical Error:', error)
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      LinkNode,
      AutoLinkNode,
      ImageNode,
    ],
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ImageDialogProvider>
      <div className="relative rounded-md border border-input bg-background">
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[300px] resize-none overflow-auto px-4 py-3 text-sm outline-none" />
            }
            placeholder={
              <div className="pointer-events-none absolute left-4 top-3 text-sm text-muted-foreground">
                {placeholder}
              </div>
            }
            ErrorBoundary={({ children }: { children: React.ReactNode }) => <>{children}</>}
          />
          <OnChangeHandler onChange={onChange} />
          <HistoryPlugin />
          <ListPlugin />
          <ImagePlugin />
          <LinkPlugin />
          <SlashCommandPlugin />
          <LoadInitialContentPlugin html={value} />
        </div>
      </div>
      </ImageDialogProvider>
    </LexicalComposer>
  )
}
