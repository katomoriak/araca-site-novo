'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { ImageUploadDialog } from './ImageUploadDialog'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { INSERT_IMAGE_COMMAND } from './plugins/ImagePlugin'

const ImageDialogContext = createContext<(() => void) | null>(null)

export function useImageDialog(): (() => void) | null {
  return useContext(ImageDialogContext)
}

export function ImageDialogProvider({ children }: { children: React.ReactNode }) {
  const [editor] = useLexicalComposerContext()
  const [open, setOpen] = useState(false)

  const openDialog = useCallback(() => setOpen(true), [])

  const handleInsert = useCallback(
    (url: string, altText: string) => {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        altText: altText || 'Imagem',
        src: url,
      })
    },
    [editor]
  )

  return (
    <ImageDialogContext.Provider value={openDialog}>
      {children}
      <ImageUploadDialog
        open={open}
        onOpenChange={setOpen}
        onInsert={handleInsert}
      />
    </ImageDialogContext.Provider>
  )
}
