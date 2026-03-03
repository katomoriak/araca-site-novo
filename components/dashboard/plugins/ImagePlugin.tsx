'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils'
import { getProxiedImageUrl } from '@/lib/transform-content-images'
import {
  $createParagraphNode,
  $getRoot,
  $getNodeByKey,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $createNodeSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  createCommand,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  DecoratorNode,
  type LexicalEditor,
  LexicalCommand,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical'
import React, { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export type InsertImagePayload = {
  altText: string
  captionText?: string
  src: string
  key?: NodeKey
}

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand('INSERT_IMAGE_COMMAND')

export type SerializedImageNode = Spread<
  {
    altText: string
    captionText?: string
    src: string
    width?: number
    height?: number
  },
  SerializedLexicalNode
>

export class ImageNode extends DecoratorNode<React.ReactElement> {
  __src: string
  __altText: string
  __captionText: string
  __width: 'inherit' | number
  __height: 'inherit' | number

  static getType(): string {
    return 'image'
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__captionText, node.__width, node.__height, node.__key)
  }

  constructor(src: string, altText: string, captionText?: string, width?: 'inherit' | number, height?: 'inherit' | number, key?: NodeKey) {
    super(key)
    this.__src = src
    this.__altText = altText
    this.__captionText = captionText || ''
    this.__width = width || 'inherit'
    this.__height = height || 'inherit'
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span')
    return span
  }

  updateDOM(): false {
    return false
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => ({
        conversion: (element: HTMLElement): DOMConversionOutput => {
          const img = element as HTMLImageElement
          const src = img.getAttribute('src') ?? img.src ?? ''
          const alt = img.getAttribute('alt') ?? img.alt ?? ''
          if (!src) return { node: null }
          const lexicalNode = $createImageNode({ src, altText: alt })
          return { node: lexicalNode }
        },
        priority: 0,
      }),
    }
  }

  exportDOM(): DOMExportOutput {
    const img = document.createElement('img')
    img.src = this.getSrc()
    img.alt = this.getAltText()
    return { element: img }
  }

  getSrc(): string {
    return this.__src
  }

  getAltText(): string {
    return this.__altText
  }

  getCaptionText(): string {
    return this.__captionText
  }

  setAltText(altText: string): void {
    const writable = this.getWritable()
    writable.__altText = altText
  }

  setCaptionText(captionText: string): void {
    const writable = this.getWritable()
    writable.__captionText = captionText
  }

  decorate(): React.ReactElement {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        captionText={this.__captionText}
        width={this.__width}
        height={this.__height}
        nodeKey={this.getKey()}
      />
    )
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, captionText, src, width, height } = serializedNode
    const node = $createImageNode({ altText, captionText, src })
    return node
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      captionText: this.getCaptionText(),
      src: this.getSrc(),
      type: 'image',
      version: 1,
    }
  }
}

export function $createImageNode({ altText, captionText, src, key }: InsertImagePayload): ImageNode {
  return new ImageNode(src, altText, captionText, undefined, undefined, key)
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode
}

function ImageComponent({
  src,
  altText,
  captionText,
  width,
  height,
  nodeKey,
}: {
  src: string
  altText: string
  captionText: string
  width: 'inherit' | number
  height: 'inherit' | number
  nodeKey: NodeKey
}) {
  const [editor] = useLexicalComposerContext()
  const imageRef = useRef<HTMLImageElement>(null)
  const [isSelected, setIsSelected] = useState(false)
  const [imgError, setImgError] = useState(false)

  const [localAlt, setLocalAlt] = useState(altText)
  const [localCaption, setLocalCaption] = useState(captionText)

  useEffect(() => {
    setLocalAlt(altText)
    setLocalCaption(captionText)
  }, [altText, captionText])

  const onUpdateProps = () => {
    if (!editor) return
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isImageNode(node)) {
        node.setAltText(localAlt)
        node.setCaptionText(localCaption)
      }
    })
  }

  const onDelete = () => {
    if (!editor) return
    try {
      editor.update(() => {
        const node = editor.getElementByKey(nodeKey)
        if (node) {
          node.remove()
        }
      })
    } catch {
      // evita derrubar o editor se o nó já foi removido
    }
  }

  useEffect(() => {
    if (!editor) return
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        try {
          editorState.read(() => {
            const selection = $getSelection()
            if ($isNodeSelection(selection)) {
              setIsSelected(selection.has(nodeKey))
            } else {
              setIsSelected(false)
            }
          })
        } catch {
          setIsSelected(false)
        }
      })
    )
  }, [editor, nodeKey])

  // URL para exibição: usar proxy para Supabase no editor (evita CORS / "Falha ao carregar imagem")
  const safeSrc = src && typeof src === 'string' ? String(src).trim() : ''
  const displayUrl = safeSrc ? getProxiedImageUrl(safeSrc) : ''
  const displaySrc = displayUrl && !imgError ? displayUrl : undefined

  if (!safeSrc) {
    return (
      <div className="relative my-4 inline-block max-w-full rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        Imagem sem URL
      </div>
    )
  }

  return (
    <div className="relative my-4 inline-block max-w-full">
      <img
        ref={imageRef}
        src={displaySrc}
        alt={altText ?? ''}
        className={`max-w-full h-auto rounded-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}
        draggable={false}
        onClick={(e) => {
          if (editor) {
            editor.update(() => {
              const nodeSelection = $createNodeSelection()
              nodeSelection.add(nodeKey)
              $setSelection(nodeSelection)
            })
          }
        }}
        onError={() => setImgError(true)}
      />
      {imgError && (
        <span className="block text-xs text-muted-foreground mt-1">Falha ao carregar imagem</span>
      )}
      {captionText && !isSelected && (
        <div className="mt-2 text-center text-sm text-muted-foreground italic">
          {captionText}
        </div>
      )}
      {isSelected && (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2"
          onClick={onDelete}
        >
          <X className="size-4" />
        </Button>
      )}
      {isSelected && (
        <div
          className="absolute top-full left-0 mt-2 bg-background border border-border p-3 rounded-lg shadow-xl z-50 w-full min-w-[300px]"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium block mb-1">Alt Text (Acessibilidade/SEO)</label>
              <input
                className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={localAlt}
                onChange={e => setLocalAlt(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Legenda (Opcional)</label>
              <input
                className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={localCaption}
                onChange={e => setLocalCaption(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button type="button" size="sm" onClick={onUpdateProps}>
                Salvar SEO Imagem
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ImagePlugin(): React.ReactElement | null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagePlugin: ImageNode not registered on editor')
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          try {
            if (!payload?.src) return false
            const src = String(payload.src).trim()
            if (!src) return false
            editor.update(() => {
              const selection = $getSelection()
              // Se não houver seleção (ex.: diálogo roubou o foco), coloca no fim da raiz
              if (!selection || !$isRangeSelection(selection)) {
                const root = $getRoot()
                root.selectEnd()
              }
              const imageNode = $createImageNode({
                src,
                altText: (payload.altText && String(payload.altText).trim()) || '',
              })
              $insertNodes([imageNode])
              if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
                $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd()
              }
            })
            return true
          } catch (e) {
            console.error('[ImagePlugin] Erro ao inserir imagem:', e)
            return false
          }
        },
        COMMAND_PRIORITY_EDITOR
      )
    )
  }, [editor])

  return null
}
