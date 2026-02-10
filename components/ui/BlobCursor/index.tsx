'use client'

/**
 * Cursor do site usando Blob Cursor do React Bits (registry/MCP).
 * reactbits.dev/animations/blob-cursor
 * Registry: https://reactbits.dev/r/BlobCursor-JS-CSS
 */

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import BlobCursor from './BlobCursor'

const BlobCursorClient = dynamic(() => Promise.resolve(BlobCursor), {
  ssr: false,
  loading: () => null,
})

export function ReactBitsCursor() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.classList.add('has-blob-cursor')
    return () => document.body.classList.remove('has-blob-cursor')
  }, [])

  if (!mounted) return null

  return (
    <>
      <style jsx>{`
        .cursor-wrap {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }
        :global(body.has-blob-cursor),
        :global(body.has-blob-cursor *) {
          cursor: none !important;
        }
        @media (pointer: coarse) {
          .cursor-wrap {
            display: none !important;
          }
          :global(body.has-blob-cursor),
          :global(body.has-blob-cursor *) {
            cursor: auto !important;
          }
        }
      `}</style>
      <div className="cursor-wrap" aria-hidden="true">
        <BlobCursorClient
          listenDocument
          blobType="circle"
          fillColor="rgba(255,255,255,0.25)"
          trailCount={3}
          sizes={[28, 48, 36]}
          innerSizes={[10, 18, 12]}
          innerColor="rgba(255,255,255,0.9)"
          opacities={[0.7, 0.5, 0.5]}
          shadowColor="rgba(0,0,0,0.2)"
          shadowBlur={8}
          shadowOffsetX={0}
          shadowOffsetY={4}
          fastDuration={0.08}
          slowDuration={0.35}
          zIndex={99999}
        />
      </div>
    </>
  )
}

export { default as BlobCursor } from './BlobCursor'
