'use client'

import { useEffect, useRef } from 'react'
import { ScrollIndicator } from '@/components/layout/ScrollIndicator'

export default function HomePage() {
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const handleScroll = () => {
      sectionsRef.current.forEach((section) => {
        if (!section) return
        
        const rect = section.getBoundingClientRect()
        const windowHeight = window.innerHeight
        
        // Calcula a posição do centro da seção em relação ao centro da viewport
        const sectionCenter = rect.top + rect.height / 2
        const viewportCenter = windowHeight / 2
        
        // Distância do centro da seção ao centro da viewport
        const distance = Math.abs(sectionCenter - viewportCenter)
        
        // Área onde o texto é visível (30% da altura da tela = mais restrito)
        const visibleRange = windowHeight * 0.3
        
        // Calcula a opacidade de forma mais agressiva
        // Só fica visível quando está próximo do centro
        let opacity = 0
        if (distance < visibleRange) {
          opacity = 1 - (distance / visibleRange)
          // Suaviza a curva de transição
          opacity = Math.pow(opacity, 1.5)
        }
        
        opacity = Math.max(0, Math.min(1, opacity))
        
        // Aplica a opacidade
        section.style.opacity = opacity.toString()
        
        // Aplica um leve scale e translateY para dar mais dramaticidade
        const scale = 0.85 + (opacity * 0.15)
        const translateY = (1 - opacity) * 20
        section.style.transform = `scale(${scale}) translateY(${translateY}px)`
      })
    }

    handleScroll() // Executa na montagem
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el)
    }
  }

  return (
    <div className="bg-white">
      {/* Seção Hero Inicial */}
      <section className="flex h-screen items-center justify-center px-4 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-5xl font-bold text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Aracá Interiores
          </h1>
          <p className="mt-6 font-primary text-xl text-white/90 sm:text-2xl md:text-3xl">
            Interiores que se adaptam ao seu momento
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ScrollIndicator />
        </div>
      </section>

      {/* Seção 1: Somos Aracá Interiores */}
      <section 
        ref={addToRefs}
        className="flex h-screen items-center justify-center px-6 transition-all duration-500 ease-out"
      >
        <h2 className="font-display text-5xl font-bold sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-center max-w-7xl leading-tight">
          <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Somos Aracá
          </span>
          <br />
          <span className="text-gray-200">
            Interiores.
          </span>
        </h2>
      </section>

      {/* Seção 2: Nosso modelo é totalmente inovador */}
      <section 
        ref={addToRefs}
        className="flex h-screen items-center justify-center px-6 transition-all duration-500 ease-out"
      >
        <h2 className="font-display text-5xl font-bold sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-center max-w-7xl leading-tight">
          <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Nosso modelo é
          </span>
          <br />
          <span className="text-gray-200">
            totalmente inovador.
          </span>
        </h2>
      </section>

      {/* Seção 3: Você escolhe o que quer contratar */}
      <section 
        ref={addToRefs}
        className="flex h-screen items-center justify-center px-6 transition-all duration-500 ease-out"
      >
        <h2 className="font-display text-5xl font-bold sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-center max-w-7xl leading-tight">
          <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Você escolhe
          </span>
          <br />
          <span className="text-gray-200">
            o que leva.
          </span>
        </h2>
      </section>

      {/* Seção 4: Projeto criativo */}
      <section 
        ref={addToRefs}
        className="flex h-screen items-center justify-center px-6 transition-all duration-500 ease-out"
      >
        <h2 className="font-display text-6xl font-bold sm:text-7xl md:text-8xl lg:text-9xl text-center leading-tight">
          <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Projeto
          </span>
          <br />
          <span className="text-gray-200">
            criativo
          </span>
        </h2>
      </section>

      {/* Seção 5: Projeto executivo */}
      <section 
        ref={addToRefs}
        className="flex h-screen items-center justify-center px-6 transition-all duration-500 ease-out"
      >
        <h2 className="font-display text-6xl font-bold sm:text-7xl md:text-8xl lg:text-9xl text-center leading-tight">
          <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Projeto
          </span>
          <br />
          <span className="text-gray-200">
            executivo
          </span>
        </h2>
      </section>

      {/* Seção 6: Detalhamentos */}
      <section 
        ref={addToRefs}
        className="flex h-screen items-center justify-center px-6 transition-all duration-500 ease-out"
      >
        <h2 className="font-display text-6xl font-bold sm:text-7xl md:text-8xl lg:text-9xl text-center leading-tight">
          <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Detalhamentos
          </span>
        </h2>
      </section>

      {/* Seção 7: Acompanhamento de obra */}
      <section 
        ref={addToRefs}
        className="flex h-screen items-center justify-center px-6 transition-all duration-500 ease-out"
      >
        <h2 className="font-display text-6xl font-bold sm:text-7xl md:text-8xl lg:text-9xl text-center leading-tight">
          <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Acompanhamento
          </span>
          <br />
          <span className="text-gray-200">
            de obra
          </span>
        </h2>
      </section>

      {/* Seção 8: Texto final */}
      <section 
        ref={addToRefs}
        className="flex h-screen items-center justify-center px-6 transition-all duration-500 ease-out"
      >
        <p className="font-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center max-w-6xl leading-relaxed">
          <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent font-semibold">
            Na Aracá, combinamos estética, funcionalidade e execução.
          </span>
          <br />
          <span className="text-gray-300">
            Você pode contratar o processo completo ou apenas o que faz sentido para o seu momento — com clareza, previsibilidade e um padrão de entrega consistente.
          </span>
        </p>
      </section>

      {/* Seção "Sobre Nós" - aqui virá o restante do conteúdo */}
      <section className="min-h-screen bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl mb-12">
            Sobre Nós
          </h2>
          {/* Aqui virá o conteúdo de "Sobre Nós" */}
        </div>
      </section>

      {/* Seção: Título "Nossos Projetos" */}
      <section 
        ref={addToRefs}
        className="flex h-screen items-center justify-center px-6 transition-all duration-500 ease-out bg-white"
      >
        <h2 className="font-display text-5xl font-bold sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-center max-w-7xl leading-tight">
          <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Nossos
          </span>
          <br />
          <span className="text-gray-200">
            Projetos
          </span>
        </h2>
      </section>

      {/* Seção de Galeria de Projetos */}
      <ProjectsSection />
    </div>
  )
}

function ProjectsSection() {
  // Mock de projetos (substitua com seus dados reais)
  const projects = [
    { 
      id: 1, 
      title: 'Casa Moderna', 
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80&fit=crop&auto=format'
    },
    { 
      id: 2, 
      title: 'Loft Industrial', 
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&fit=crop&auto=format'
    },
    { 
      id: 3, 
      title: 'Apartamento Minimalista', 
      image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80&fit=crop&auto=format'
    },
    { 
      id: 4, 
      title: 'Residência Contemporânea', 
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80&fit=crop&auto=format'
    },
    { 
      id: 5, 
      title: 'Espaço Corporativo', 
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&fit=crop&auto=format'
    },
    { 
      id: 6, 
      title: 'Casa de Campo', 
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80&fit=crop&auto=format'
    },
  ]
  
  return (
    <section className="min-h-screen bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Galeria de Projetos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-2xl font-bold text-white">
                    {project.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
