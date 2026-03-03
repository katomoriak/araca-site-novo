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
import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import FloatingToolbarPlugin from './plugins/FloatingToolbarPlugin'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

// Plugin para carregar conteúdo inicial HTML
function LoadInitialContentPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext()
  const isLoaded = useRef(false)

  useEffect(() => {
    // Carrega apenas uma vez
    if (isLoaded.current) return
    if (!html) return
    isLoaded.current = true

    setTimeout(() => {
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
    }, 0)
  }, [editor, html])

  return null
}

/** Usa o editor do contexto para gerar HTML. Ignora alterações apenas de seleção. */
function OnChangeHandler({ onChange }: { onChange: (value: string) => void }) {
  const [editor] = useLexicalComposerContext()

  const handleChange = (editorState: EditorState) => {
    try {
      editorState.read(() => {
        if (!editor) return
        const html = $generateHtmlFromNodes(editor, null)
        onChange(html)
      })
    } catch (e) {
      console.error('Erro ao gerar HTML do editor:', e)
    }
  }

  // ignoreSelectionChange={true} para não disparar atualizações desnecessárias
  return <OnChangePlugin onChange={handleChange} ignoreSelectionChange={true} />
}

export function RichTextEditor({ value, onChange, placeholder = 'Escreva o conteúdo aqui...' }: RichTextEditorProps) {
  // Guarda o valor exato que o componente recebeu ao montar (vazio no "Novo post", HTML no "Editar post")
  const initialValueRef = useRef(value)

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
            <LexicalLinkPlugin />
            <ImagePlugin />
            <LinkPlugin />
            <SlashCommandPlugin />
            <FloatingToolbarPlugin />
            <LoadInitialContentPlugin html={initialValueRef.current} />
          </div>
        </div>
      </ImageDialogProvider>
    </LexicalComposer>
  )
}
