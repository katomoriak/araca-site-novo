'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Mail, Phone, MapPin, UserPlus, Instagram, Linkedin } from 'lucide-react'

// Icone do Pinterest customizado pois lucide-react não tem
const PinterestIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.688 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.094.399-.303 1.236-.346 1.417-.056.236-.184.288-.429.174-1.604-.748-2.607-3.098-2.607-4.99 0-4.067 2.956-7.809 8.536-7.809 4.492 0 7.989 3.2 7.989 7.472 0 4.467-2.812 8.067-6.723 8.067-1.313 0-2.548-.682-2.972-1.492l-.809 3.085c-.292 1.114-1.085 2.508-1.618 3.36 1.247.388 2.571.597 3.939.597 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
  </svg>
)

type BusinessCardProps = {
  slug: string
  name: string
  role: string
  email: string
  phone: string
  address: string
  avatarUrl: string | null
  initials: string
}

export function CVClient({ card }: { card: BusinessCardProps }) {
  const handleSaveContact = () => {
    // Apenas números
    const telUnformatted = card.phone.replace(/\D/g, '')
    // Usar formato internacional basico (assume BR se tiver 10 ou 11 chars)
    const telToSave = telUnformatted.length >= 10 ? `+55${telUnformatted}` : card.phone

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${card.name}
ORG:Aracá Interiores
TITLE:${card.role}
TEL;TYPE=CELL,VOICE:${telToSave}
EMAIL:${card.email}
URL:https://araca.arq.br
ADR;TYPE=WORK:;;Santo André;SP;;;Brasil
END:VCARD`

    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${card.slug}_araca.vcf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Se for celular (tem q limpar), direcionar por wa.me ou tel:
  const isCelular = card.phone.replace(/\D/g, '').length >= 10
  const cleanPhone = card.phone.replace(/\D/g, '')
  const whatsappMessage = encodeURIComponent(`Olá ${card.name}, vim pelo Cartão de Visitas Virtual.`)
  const phoneHref = isCelular ? `https://wa.me/55${cleanPhone}?text=${whatsappMessage}` : `tel:${cleanPhone}`

  return (
    <div className="min-h-screen bg-araca-bege-claro/30 flex flex-col items-center font-body animate-fade-in relative selection:bg-araca-verde-pinho-escuro/20 selection:text-araca-verde-pinho-escuro">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl overflow-hidden flex flex-col relative">

        {/* Background / Hero */}
        <div className="relative h-48 sm:h-64 w-full bg-gradient-to-br from-araca-verde-pinho-escuro via-araca-mineral-green to-araca-verde-medio overflow-hidden rounded-b-[2.5rem]">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-araca-dourado-ocre/20 blur-3xl"></div>

          {/* Botão Voltar */}
          <Link
            href="/"
            className="absolute top-6 right-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 text-sm font-medium transition-all shadow-glass"
          >
            Voltar ao site
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Avatar Section */}
        <div className="relative flex justify-center -mt-16 sm:-mt-20 z-10 animate-slide-up">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-8 border-white bg-araca-dourado-ocre shadow-lg flex items-center justify-center relative overflow-hidden group">
            {card.avatarUrl ? (
              <img
                src={card.avatarUrl}
                alt={card.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent"></div>
                <span className="text-white text-4xl sm:text-5xl font-display font-medium tracking-tight drop-shadow-md">
                  {card.initials}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="px-6 pt-4 sm:pt-6 pb-6 sm:pb-8 text-center animate-slide-up bg-white relative z-10" style={{ animationDelay: '100ms' }}>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-araca-cafe-escuro mb-1">
            {card.name}
          </h1>
          <p className="text-araca-verde-pinho-escuro font-medium text-base sm:text-lg mb-3">
            {card.role}
          </p>
          <div className="flex items-center justify-center gap-1.5 text-araca-cafe-medio text-xs sm:text-sm font-medium">
            <MapPin className="w-4 h-4 text-araca-laranja-queimado/80" />
            <span>{card.address}</span>
          </div>
        </div>

        {/* Buttons List */}
        <div className="px-6 flex flex-col gap-3 sm:gap-4 animate-slide-up flex-grow" style={{ animationDelay: '200ms' }}>

          <button
            onClick={handleSaveContact}
            className="w-full flex items-center justify-center gap-3 bg-araca-verde-pinho-escuro hover:bg-araca-mineral-green text-white py-3.5 sm:py-4 px-6 rounded-2xl font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            <UserPlus className="w-5 h-5" />
            Adicionar aos Contatos
          </button>

          <a
            href={`mailto:${card.email} `}
            className="w-full flex items-center gap-4 bg-araca-creme hover:bg-araca-bege-claro text-araca-cafe-escuro border border-araca-bege-medio py-3.5 sm:py-4 px-6 rounded-2xl font-medium transition-all shadow-sm active:scale-[0.98] group"
          >
            <div className="bg-white p-2.5 rounded-xl text-araca-verde-pinho-escuro shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start translate-y-px overflow-hidden">
              <span className="text-[10px] sm:text-xs text-araca-cafe-medio uppercase tracking-wider font-semibold mb-0.5">Email</span>
              <span className="text-araca-chocolate-amargo text-sm sm:text-base truncate w-full">{card.email}</span>
            </div>
          </a>

          <a
            href={phoneHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-4 bg-araca-creme hover:bg-araca-bege-claro text-araca-cafe-escuro border border-araca-bege-medio py-3.5 sm:py-4 px-6 rounded-2xl font-medium transition-all shadow-sm active:scale-[0.98] group"
          >
            <div className="bg-white p-2.5 rounded-xl text-araca-verde-pinho-escuro shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start translate-y-px overflow-hidden">
              <span className="text-[10px] sm:text-xs text-araca-cafe-medio uppercase tracking-wider font-semibold mb-0.5">WhatsApp / Telefone</span>
              <span className="text-araca-chocolate-amargo text-sm sm:text-base truncate w-full">{card.phone}</span>
            </div>
          </a>

        </div>

        {/* Footer */}
        <div className="mt-8 mb-6 pt-6 border-t border-araca-bege-medio/50 text-center animate-slide-up mx-6" style={{ animationDelay: '300ms' }}>
          <div className="flex justify-center mb-5">
            <Image
              src="/logotipos/LOGOTIPO_PRINCIPAL.svg"
              alt="Aracá Interiores"
              width={120}
              height={48}
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Redes Sociais */}
          <div className="flex justify-center gap-4 mb-6">
            <a href="https://www.instagram.com/aracainteriores/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-araca-creme text-araca-cafe-escuro hover:text-white hover:bg-araca-laranja-queimado transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://www.linkedin.com/company/araca-arq" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-araca-creme text-araca-cafe-escuro hover:text-white hover:bg-araca-laranja-queimado transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://br.pinterest.com/aracainteriores/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-araca-creme text-araca-cafe-escuro hover:text-white hover:bg-araca-laranja-queimado transition-colors">
              <PinterestIcon className="h-5 w-5" />
            </a>
          </div>

          <div className="flex items-center justify-center pt-2">
            <a
              href="https://www.agencianaut.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-araca-chocolate-amargo/70 hover:text-araca-laranja-queimado transition"
            >
              <span className="text-xs text-araca-chocolate-amargo/60">Desenvolvido por</span>
              <img
                src="/assets/naut-logotipo-mono-branco.svg"
                alt="Naut"
                className="h-4 w-auto drop-shadow-sm brightness-0 invert-[0.3]"
              />
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
