/**
 * Ícone Aracá (logo redondo) para sidebar/nav do admin Payload
 */
import Image from 'next/image'
import React from 'react'

export function AracaIcon() {
  return (
    <Image
      src="/logotipos/LOGOTIPO%20REDONDO@300x.png"
      alt="Aracá"
      width={36}
      height={36}
      priority
      style={{ objectFit: 'contain', borderRadius: '4px' }}
    />
  )
}
