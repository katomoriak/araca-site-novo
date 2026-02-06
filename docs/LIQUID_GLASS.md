# Liquid Glass Design System - Documentação Técnica

## Índice

1. [Introdução](#introdução)
2. [Conceitos Fundamentais](#conceitos-fundamentais)
3. [Propriedades Ópticas](#propriedades-ópticas)
4. [Variantes](#variantes)
5. [Implementação](#implementação)
6. [Exemplos de Código](#exemplos-de-código)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Introdução

**Liquid Glass** é um meta-material digital desenvolvido pela Apple (WWDC 2025) que unifica a linguagem de design em todas as plataformas, proporcionando uma experiência mais dinâmica e expressiva.

### O que é Liquid Glass?

- **Digital meta-material** que dinamicamente dobra e molda luz
- **Comportamento orgânico** similar a um líquido leve
- **Responde fluidamente** ao toque e ao dinamismo das aplicações modernas
- **Camada flutuante** que vive acima do conteúdo

### História e Evolução

```
Mac OS X Aqua (2001)
    ↓
iOS 7 Blur (2013)
    ↓
iPhone X Fluidity (2017)
    ↓
Dynamic Island (2022)
    ↓
visionOS Immersive (2024)
    ↓
Liquid Glass (2025) ⭐
```

---

## Conceitos Fundamentais

### 1. Lensing (Efeito Primário)

O **lensing** é a forma principal como o Liquid Glass se define visualmente:

- Luz é **dobrada e concentrada** (não apenas espalhada)
- Cria **warping natural** da luz
- Comunica **presença, movimento e forma**
- Baseado em experiências intuitivas do mundo natural

**Comportamento:**
```
Luz normal → Scatter (iOS 7-14)
Liquid Glass → Bend & Concentrate (iOS 15+)
```

### 2. Adaptivity (Adaptação Dinâmica)

O Liquid Glass adapta-se continuamente:

#### Por Conteúdo:
- **Texto abaixo:** Sombras mais pronunciadas
- **Background claro:** Opacidade de sombra reduzida
- **Background escuro:** Transição para dark mode

#### Por Tamanho:
- **Pequeno (navbar):** Material fino, blur moderado
- **Grande (sidebar):** Material espesso, blur intenso, sombras profundas

#### Por Ambiente:
- **Conteúdo colorido próximo:** Luz spilla nas superfícies
- **Reflexões ambientais:** Luz reflete e sangra nas sombras

### 3. Dynamics (Comportamento Dinâmico)

**Materialização:**
```
Aparece: Modula gradualmente o light bending
Desaparece: Gradual demodulação mantendo integridade óptica
```

**Interação:**
- Flexiona e energiza instantaneamente com luz ao toque
- Glow começa sob o dedo e se espalha
- Propriedades gel-like comunicam natureza transitória
- Elementos podem "levantar" temporariamente para Liquid Glass

**Shape-shifting:**
- Morfa dinamicamente entre controles em diferentes contextos
- Mantém conceito de "planeta flutuante singular"
- Menus popam organicamente do botão sem deslocamento

---

## Propriedades Ópticas

### Camadas do Sistema

O Liquid Glass é composto de múltiplas camadas que trabalham juntas:

#### 1. Highlights Layer
```css
/* Luz ambiental que se move com device motion */
animation: light-travel 2s ease-in-out infinite;

/* Highlights respondem à geometria */
background: radial-gradient(
  ellipse at var(--light-position),
  rgba(255,255,255,0.3) 0%,
  transparent 50%
);
```

#### 2. Shadow Layer
```css
/* Sombras adaptativas */
box-shadow: 
  /* Aumenta sobre texto */
  0 8px 32px rgba(0,0,0, var(--shadow-opacity)),
  /* Diminui sobre backgrounds claros */
  0 2px 8px rgba(0,0,0, calc(var(--shadow-opacity) * 0.5));
```

#### 3. Glow Layer (Interação)
```css
/* Feedback de toque */
.liquid-glass:active {
  background: radial-gradient(
    circle at var(--touch-point),
    rgba(255,255,255,0.4) 0%,
    transparent 60%
  );
}

/* Propaga para elementos próximos */
.liquid-glass-nearby {
  box-shadow: 0 0 20px rgba(255,255,255,0.2);
}
```

#### 4. Tint & Vibrancy
```css
/* Sistema de cores adaptativo */
backdrop-filter: 
  blur(42px) 
  saturate(180%)      /* Mantém cores vibrantes */
  brightness(1.1);    /* Ajusta brilho */
```

---

## Variantes

### Regular (Versátil)

**Quando usar:**
- Navegação principal
- Controles flutuantes
- Qualquer tamanho
- Sobre qualquer conteúdo

**Características:**
- Todos os efeitos visuais e adaptativos
- Legibilidade garantida em qualquer contexto
- Flip automático light/dark em elementos pequenos

**Especificações:**
```css
.liquid-glass-regular {
  background: linear-gradient(135deg, 
    rgba(255,255,255,0.12) 0%, 
    rgba(255,255,255,0.06) 100%
  );
  backdrop-filter: blur(42px) saturate(180%);
  box-shadow: 
    0 8px 32px rgba(0,0,0,0.4),
    0 2px 8px rgba(0,0,0,0.2),
    inset 0 1px 0 rgba(255,255,255,0.2),
    inset 0 -1px 0 rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.18);
}
```

### Clear (Transparente Permanente)

**Quando usar (3 condições obrigatórias):**
1. ✅ Sobre conteúdo rico em mídia
2. ✅ Camada de conteúdo não afetada negativamente por dimming
3. ✅ Conteúdo acima é bold e bright

**Características:**
- Permanentemente mais transparente
- Sem comportamentos adaptativos
- Requer dimming layer para legibilidade
- Permite riqueza do conteúdo interagir com glass

**Especificações:**
```css
.liquid-glass-clear {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(60px) saturate(200%);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.12);
}

/* Dimming layer obrigatória */
.liquid-glass-clear::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: -1;
}
```

---

## Implementação

### CSS Variables (Recomendado)

```css
:root {
  /* Liquid Glass - Regular */
  --liquid-glass-bg: linear-gradient(135deg, 
    rgba(255,255,255,0.12) 0%, 
    rgba(255,255,255,0.06) 100%
  );
  --liquid-glass-blur: blur(42px) saturate(180%);
  --liquid-glass-shadow: 
    0 8px 32px rgba(0,0,0,0.4),
    0 2px 8px rgba(0,0,0,0.2),
    inset 0 1px 0 rgba(255,255,255,0.2),
    inset 0 -1px 0 rgba(0,0,0,0.1);
  --liquid-glass-border: 1px solid rgba(255,255,255,0.18);
  
  /* Motion */
  --liquid-glass-transition: all 300ms ease-out;
  --liquid-glass-morph: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
  
  /* Typography */
  --liquid-glass-text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.liquid-glass {
  background: var(--liquid-glass-bg);
  backdrop-filter: var(--liquid-glass-blur);
  -webkit-backdrop-filter: var(--liquid-glass-blur);
  box-shadow: var(--liquid-glass-shadow);
  border: var(--liquid-glass-border);
  transition: var(--liquid-glass-transition);
}
```

### Tailwind CSS Plugin (Futuro)

```js
// tailwind.config.js - Exemplo futuro
module.exports = {
  plugins: [
    require('./plugins/liquid-glass')({
      variants: ['regular', 'clear'],
      sizes: ['sm', 'md', 'lg'],
    })
  ]
}

// Uso:
// <div className="liquid-glass liquid-glass-regular liquid-glass-md" />
```

### React Component (Exemplo)

```tsx
import { CSSProperties } from 'react'

interface LiquidGlassProps {
  children: React.ReactNode
  variant?: 'regular' | 'clear'
  className?: string
  style?: CSSProperties
}

export function LiquidGlass({ 
  children, 
  variant = 'regular',
  className = '',
  style = {}
}: LiquidGlassProps) {
  const baseStyle: CSSProperties = {
    background: variant === 'regular' 
      ? 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)'
      : 'rgba(255,255,255,0.04)',
    backdropFilter: variant === 'regular'
      ? 'blur(42px) saturate(180%)'
      : 'blur(60px) saturate(200%)',
    WebkitBackdropFilter: variant === 'regular'
      ? 'blur(42px) saturate(180%)'
      : 'blur(60px) saturate(200%)',
    boxShadow: variant === 'regular'
      ? `0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2), 
         inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)`
      : '0 8px 24px rgba(0,0,0,0.3)',
    border: variant === 'regular'
      ? '1px solid rgba(255,255,255,0.18)'
      : '1px solid rgba(255,255,255,0.12)',
    transition: 'all 300ms ease-out',
    ...style
  }
  
  return (
    <div className={className} style={baseStyle}>
      {children}
    </div>
  )
}
```

---

## Exemplos de Código

### Menu Principal (Navbar)

```tsx
<nav className="flex h-20 items-center justify-center">
  <div 
    style={{
      width: '80%',
      maxWidth: '1024px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
      backdropFilter: 'blur(42px) saturate(180%)',
      WebkitBackdropFilter: 'blur(42px) saturate(180%)',
      boxShadow: `
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 2px 8px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.2),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1)
      `,
      border: '1px solid rgba(255, 255, 255, 0.18)',
    }}
    className="flex items-center justify-between gap-6 rounded-full px-6 py-3"
  >
    {/* Logo + Menu Items */}
  </div>
</nav>
```

### Botão Ativo

```tsx
<Link
  href="/"
  className="group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium text-neutral-900 transition-all duration-300 hover:scale-[1.02]"
  style={{
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
  }}
>
  <span className="relative z-10">Home</span>
  <div className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
</Link>
```

### Botão Inativo com Hover

```tsx
<Link
  href="/sobre"
  className="group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium text-white/95 transition-all duration-300 hover:text-white"
  style={{
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  }}
>
  <span className="relative z-10">Sobre nós</span>
  <div 
    className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    style={{
      background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
    }}
  />
</Link>
```

### Sidebar (Elemento Grande)

```tsx
<aside 
  style={{
    background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.08) 100%)',
    backdropFilter: 'blur(60px) saturate(190%)',
    WebkitBackdropFilter: 'blur(60px) saturate(190%)',
    boxShadow: `
      0 12px 48px rgba(0, 0, 0, 0.5),
      0 4px 12px rgba(0, 0, 0, 0.3),
      inset 0 2px 0 rgba(255, 255, 255, 0.25),
      inset 0 -2px 0 rgba(0, 0, 0, 0.15)
    `,
    border: '1px solid rgba(255, 255, 255, 0.22)',
  }}
  className="h-full w-64 rounded-2xl p-6"
>
  {/* Sidebar content */}
</aside>
```

---

## Best Practices

### ✅ DO

1. **Reserve para navegação**
   - Use em navbars, toolbars, sidebars flutuantes
   - Mantenha na layer de navegação, acima do conteúdo

2. **Mantenha espaçamento adequado**
   - 10% de margem de cada lado (80% width)
   - Evite tocar nas bordas do viewport

3. **Use logotipos apropriados**
   - SVG com `filter: brightness(0) invert(1)` para branco
   - Drop-shadow para destacar: `0 2px 4px rgba(0,0,0,0.3)`

4. **Adicione text-shadow**
   - `text-shadow: 0 1px 2px rgba(0,0,0,0.3)` para legibilidade

5. **Transições suaves**
   - 300ms para estados normais
   - 400ms para morfismo entre estados

### ❌ DON'T

1. **Não empilhe glass**
   - Nunca coloque glass sobre glass
   - Causa confusão visual e quebra hierarquia

2. **Não use na camada de conteúdo**
   - Conteúdo principal deve ser sólido
   - Glass compete e confunde a hierarquia

3. **Não aplique em tudo**
   - Use seletivamente para elementos de navegação
   - Conteúdo deve respirar sem efeitos

4. **Não ignore acessibilidade**
   - Sempre teste contraste
   - Implemente suporte para Reduced Motion
   - Respeite Increased Contrast

---

## Troubleshooting

### Problema: Blur não aparece

**Causa:** Navegadores antigos ou falta de prefixos

**Solução:**
```css
backdrop-filter: blur(42px) saturate(180%);
-webkit-backdrop-filter: blur(42px) saturate(180%);
```

### Problema: Performance ruim

**Causa:** Blur muito intenso ou muitos elementos

**Solução:**
- Reduza blur para 30-40px
- Use `will-change: backdrop-filter` com cuidado
- Limite número de elementos com glass
- Use GPU acceleration: `transform: translateZ(0)`

### Problema: Legibilidade baixa

**Causa:** Contraste insuficiente ou background muito complexo

**Solução:**
- Adicione text-shadow: `0 1px 2px rgba(0,0,0,0.3)`
- Aumente opacidade do background
- Use variant Clear com dimming layer
- Adicione borda mais visível

### Problema: Sombras não aparecem

**Causa:** Z-index ou posicionamento incorreto

**Solução:**
```css
position: relative;
z-index: 10;
/* ou */
isolation: isolate;
```

---

## Referências e Recursos

### Documentação Oficial Apple

- [WWDC 2025 - Meet Liquid Glass (Vídeo)](https://developer.apple.com/videos/play/wwdc2025/219/)
- [Human Interface Guidelines - Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [Adopting Liquid Glass](https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass)

### Implementações de Referência

- SwiftUI: `.glassEffect()` modifier
- UIKit: `UIVisualEffectView` com Liquid Glass material
- Web: Manual implementation com CSS

### Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| backdrop-filter | 76+ | 103+ | 9+ | 79+ |
| saturate() | 76+ | 103+ | 9+ | 79+ |
| inset box-shadow | ✅ | ✅ | ✅ | ✅ |

---

**Última atualização:** 06/02/2026  
**Versão:** 1.0.0  
**Projeto:** Aracá Interiores  
**Baseado em:** Apple WWDC 2025 Liquid Glass Design Language
