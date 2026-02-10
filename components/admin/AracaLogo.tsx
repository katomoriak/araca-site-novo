/**
 * Logo Aracá para tela de Login e áreas amplas do admin Payload
 */
import Image from 'next/image'
import React from 'react'

export function AracaLogo() {
  return (
    <Image
      src="/logotipos/LOGOTIPO_LATERAL@300x.png"
      alt="Aracá Interiores"
      width={180}
      height={72}
      priority
      style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
    />
  )
}
