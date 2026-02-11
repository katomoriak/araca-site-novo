'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $getSelection, $isRangeSelection } from 'lexical'
import { useEffect, useState, type ReactElement } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Link as LinkIcon, ExternalLink } from 'lucide-react'

export default function LinkPlugin(): ReactElement | null {
  const [editor] = useLexicalComposerContext()
  const [isLink, setIsLink] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkEditor, setShowLinkEditor] = useState(false)

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode()
          const parent = node.getParent()
          if ($isLinkNode(parent)) {
            setIsLink(true)
            setLinkUrl(parent.getURL())
          } else if ($isLinkNode(node)) {
            setIsLink(true)
            setLinkUrl(node.getURL())
          } else {
            setIsLink(false)
            setLinkUrl('')
          }
        }
      })
    })
  }, [editor])

  const insertLink = () => {
    if (!linkUrl) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
      return
    }

    editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl)
    setShowLinkEditor(false)
    setLinkUrl('')
  }

  return null
}

export function LinkToolbarButton() {
  const [editor] = useLexicalComposerContext()
  const [isLink, setIsLink] = useState(false)
  const [showLinkEditor, setShowLinkEditor] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode()
          const parent = node.getParent()
          if ($isLinkNode(parent)) {
            setIsLink(true)
            setLinkUrl(parent.getURL())
          } else if ($isLinkNode(node)) {
            setIsLink(true)
            setLinkUrl(node.getURL())
          } else {
            setIsLink(false)
            setLinkUrl('')
          }
        }
      })
    })
  }, [editor])

  const insertLink = () => {
    if (!linkUrl) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
      setShowLinkEditor(false)
      return
    }

    editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl)
    setShowLinkEditor(false)
    setLinkUrl('')
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant={isLink ? 'secondary' : 'ghost'}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => setShowLinkEditor(!showLinkEditor)}
        aria-label="Inserir link"
      >
        <LinkIcon className="size-4" />
      </Button>

      {showLinkEditor && (
        <div className="absolute top-full left-0 z-50 mt-2 w-80 rounded-lg border border-border bg-popover p-3 shadow-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium">URL do Link</label>
            <Input
              type="url"
              placeholder="https://exemplo.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  insertLink()
                } else if (e.key === 'Escape') {
                  setShowLinkEditor(false)
                }
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <Button type="button" size="sm" onClick={insertLink}>
                {isLink ? 'Atualizar' : 'Inserir'}
              </Button>
              {isLink && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
                    setShowLinkEditor(false)
                    setLinkUrl('')
                  }}
                >
                  Remover
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowLinkEditor(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
