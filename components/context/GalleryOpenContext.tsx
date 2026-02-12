'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type GalleryOpenContextValue = {
  galleryOpen: boolean
  setGalleryOpen: (open: boolean) => void
}

const defaultValue: GalleryOpenContextValue = {
  galleryOpen: false,
  setGalleryOpen: () => {},
}

const GalleryOpenContext = createContext<GalleryOpenContextValue>(defaultValue)

export function GalleryOpenProvider({ children }: { children: ReactNode }) {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const setOpen = useCallback((open: boolean) => setGalleryOpen(open), [])
  return (
    <GalleryOpenContext.Provider value={{ galleryOpen, setGalleryOpen: setOpen }}>
      {children}
    </GalleryOpenContext.Provider>
  )
}

export function useGalleryOpen() {
  return useContext(GalleryOpenContext)
}
