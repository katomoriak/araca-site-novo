'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, LexicalEditor, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_LOW } from 'lexical'
import { Bold, Italic, Link as LinkIcon, Strikethrough, Underline, Code } from 'lucide-react'
import { mergeRegister } from '@lexical/utils'
import { TOGGLE_LINK_COMMAND, $isLinkNode } from '@lexical/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const FloatingToolbarPlugin = () => {
    const [editor] = useLexicalComposerContext()
    const toolbarRef = useRef<HTMLDivElement>(null)

    const [isText, setIsText] = useState(false)
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const [isUnderline, setIsUnderline] = useState(false)
    const [isStrikethrough, setIsStrikethrough] = useState(false)
    const [isCode, setIsCode] = useState(false)
    const [isLink, setIsLink] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')
    const [showLinkEditor, setShowLinkEditor] = useState(false)
    const [openInNewTab, setOpenInNewTab] = useState(false)

    const updateToolbar = useCallback(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
            const node = selection.anchor.getNode()
            const parent = node.getParent()

            setIsBold(selection.hasFormat('bold'))
            setIsItalic(selection.hasFormat('italic'))
            setIsUnderline(selection.hasFormat('underline'))
            setIsStrikethrough(selection.hasFormat('strikethrough'))
            setIsCode(selection.hasFormat('code'))

            if ($isLinkNode(parent)) {
                setIsLink(true)
                setLinkUrl(parent.getURL())
                setOpenInNewTab(parent.getTarget() === '_blank')
            } else if ($isLinkNode(node)) {
                setIsLink(true)
                setLinkUrl(node.getURL())
                setOpenInNewTab(node.getTarget() === '_blank')
            } else {
                setIsLink(false)
                setLinkUrl('')
            }
        }
    }, [])

    const updatePosition = useCallback(() => {
        const toolbar = toolbarRef.current
        if (!toolbar) return

        const nativeSelection = window.getSelection()

        // Ignora posições se estamos no textarea de link (showLinkEditor = true e foco lá dentro)
        if (showLinkEditor) {
            setIsText(true)
            return
        }

        if (!nativeSelection || nativeSelection.isCollapsed) {
            setIsText(false)
            return
        }

        const rootElement = editor.getRootElement()

        if (rootElement !== null && rootElement.contains(nativeSelection.anchorNode)) {
            setIsText(true)
        } else {
            setIsText(false)
            return
        }

        const range = nativeSelection.getRangeAt(0)
        const rect = range.getBoundingClientRect()

        toolbar.style.opacity = '1'
        toolbar.style.position = 'absolute'

        const top = rect.top + window.scrollY - toolbar.offsetHeight - 10
        const left = rect.left + window.scrollX + rect.width / 2 - toolbar.offsetWidth / 2

        toolbar.style.top = `${Math.max(0, top)}px`
        toolbar.style.left = `${Math.max(0, left)}px`
    }, [editor, showLinkEditor])

    useEffect(() => {
        const update = () => {
            editor.getEditorState().read(() => {
                updateToolbar()
            })
            updatePosition()
        }

        return mergeRegister(
            editor.registerUpdateListener(() => {
                update()
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    update()
                    return false
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerRootListener(() => {
                if (editor.getRootElement() !== null) {
                    updatePosition()
                }
            })
        )
    }, [editor, updateToolbar, updatePosition])

    useEffect(() => {
        const handleMouseUp = () => {
            setTimeout(() => {
                updatePosition()
            }, 0)
        }

        document.addEventListener('mouseup', handleMouseUp)
        return () => {
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [updatePosition])

    const insertLink = useCallback(() => {
        if (!linkUrl) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
            setShowLinkEditor(false)
            return
        }

        editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
            url: linkUrl,
            target: openInNewTab ? '_blank' : undefined,
            rel: openInNewTab ? 'noopener noreferrer' : undefined,
        })
        setShowLinkEditor(false)
        setLinkUrl('')
    }, [editor, linkUrl, openInNewTab])

    // Evita interagir se o cursor estiver vazio, exceto se estiver com o input de link focado
    if (!isText && !showLinkEditor) return null

    const toolbarContent = (
        <div
            ref={toolbarRef}
            className={`absolute z-50 flex items-center gap-1 rounded-md border border-border bg-popover p-1 shadow-md transition-opacity duration-200 ${isText || showLinkEditor ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            style={{ top: -10000, left: -10000 }} // Fora da tela inicialmente para evitar flicker
        >
            {!showLinkEditor ? (
                <>
                    <Button
                        type="button"
                        variant={isBold ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                    >
                        <Bold className="size-4" />
                    </Button>

                    <Button
                        type="button"
                        variant={isItalic ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                    >
                        <Italic className="size-4" />
                    </Button>

                    <Button
                        type="button"
                        variant={isUnderline ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
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

                    <div className="mx-1 h-4 w-px bg-border" />

                    <Button
                        type="button"
                        variant={isLink ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setShowLinkEditor(true)}
                    >
                        <LinkIcon className="size-4" />
                    </Button>
                </>
            ) : (
                <div className="flex w-64 flex-col gap-2 p-1">
                    <label className="text-xs font-medium text-muted-foreground">URL do Link</label>
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
                        className="h-8 text-xs"
                    />
                    <div className="flex items-center space-x-2 pb-1">
                        <input
                            type="checkbox"
                            id="floatingOpenInNewTab"
                            checked={openInNewTab}
                            onChange={(e) => setOpenInNewTab(e.target.checked)}
                            className="h-3 w-3 rounded border-gray-300"
                        />
                        <label htmlFor="floatingOpenInNewTab" className="cursor-pointer text-xs leading-none">
                            Abrir em nova aba
                        </label>
                    </div>
                    <div className="flex gap-1 justify-end">
                        {isLink && (
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs"
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
                            className="h-7 px-2 text-xs"
                            onClick={() => setShowLinkEditor(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={insertLink}
                        >
                            {isLink ? 'Atualizar' : 'Inserir'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )

    // Renderiza no body para float absoluto real sobre a tela
    if (typeof document !== 'undefined') {
        return createPortal(toolbarContent, document.body)
    }
    return null
}

export default FloatingToolbarPlugin
