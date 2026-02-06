# Liquid Glass - Guia Rápido de Implementação

## Início Rápido (5 minutos)

### 1. Importar o Componente

```tsx
import { LiquidGlass, LiquidGlassButton } from '@/components/ui'
```

### 2. Usar no JSX

```tsx
// Menu de navegação
<LiquidGlass variant="regular" size="sm" className="rounded-full px-6 py-3">
  <nav className="flex items-center gap-4">
    <LiquidGlassButton active>Home</LiquidGlassButton>
    <LiquidGlassButton>Sobre</LiquidGlassButton>
    <LiquidGlassButton>Contato</LiquidGlassButton>
  </nav>
</LiquidGlass>
```

### 3. Pronto! ✨

---

## Receitas Comuns

### Menu Horizontal (Navbar)

```tsx
<Container>
  <div className="flex h-20 items-center justify-center">
    <LiquidGlass 
      variant="regular" 
      size="sm"
      className="flex items-center justify-between gap-6 rounded-full px-6 py-3"
      style={{ width: '80%', maxWidth: '1024px' }}
    >
      {/* Logo */}
      <Link href="/">
        <Image 
          src="/logo.svg" 
          alt="Logo"
          width={80}
          height={60}
          className="liquid-glass-logo-shadow"
        />
      </Link>
      
      {/* Menu Items */}
      <nav className="flex items-center gap-2">
        <LiquidGlassButton active>Home</LiquidGlassButton>
        <LiquidGlassButton>Sobre nós</LiquidGlassButton>
        <LiquidGlassButton>Projetos</LiquidGlassButton>
        <LiquidGlassButton>Contato</LiquidGlassButton>
      </nav>
    </LiquidGlass>
  </div>
</Container>
```

### Sidebar Flutuante

```tsx
<LiquidGlass 
  variant="regular" 
  size="lg"
  className="h-full w-64 rounded-2xl p-6"
  as="aside"
>
  <nav className="space-y-4">
    <h2 className="liquid-glass-text text-lg font-semibold">Menu</h2>
    <ul className="space-y-2">
      <li><a href="/" className="liquid-glass-text">Dashboard</a></li>
      <li><a href="/users" className="liquid-glass-text">Usuários</a></li>
      <li><a href="/settings" className="liquid-glass-text">Configurações</a></li>
    </ul>
  </nav>
</LiquidGlass>
```

### Modal/Dialog

```tsx
<LiquidGlass 
  variant="regular" 
  size="lg"
  className="max-w-md rounded-3xl p-8"
>
  <h2 className="liquid-glass-text mb-4 text-2xl font-bold">
    Título do Modal
  </h2>
  <p className="liquid-glass-text mb-6">
    Conteúdo do modal aqui...
  </p>
  <div className="flex gap-4">
    <button className="liquid-glass-active rounded-full px-6 py-2">
      Confirmar
    </button>
    <button className="liquid-glass-item rounded-full px-6 py-2 liquid-glass-text">
      Cancelar
    </button>
  </div>
</LiquidGlass>
```

### Card sobre Imagem/Vídeo (Variant Clear)

```tsx
<div className="relative">
  {/* Background rico (imagem, vídeo, etc) */}
  <Image src="/background.jpg" alt="Background" fill />
  
  {/* Card com Clear variant */}
  <LiquidGlass 
    variant="clear"
    size="sm"
    className="absolute bottom-8 left-8 rounded-2xl p-6"
  >
    <h3 className="liquid-glass-text text-xl font-bold">
      Título sobre mídia
    </h3>
    <p className="liquid-glass-text mt-2">
      Conteúdo com alta legibilidade
    </p>
  </LiquidGlass>
</div>
```

---

## CSS Utilities

### Classes Prontas

```tsx
// Container glass
<div className="liquid-glass-sm rounded-full px-6 py-3">
  {/* Conteúdo */}
</div>

// Texto sobre glass
<p className="liquid-glass-text">
  Texto com shadow para legibilidade
</p>

// Logo/SVG branco
<Image 
  src="/logo.svg" 
  alt="Logo"
  className="liquid-glass-logo-shadow"
/>

// Item interativo com hover glow
<button className="liquid-glass-item rounded-full px-5 py-2">
  Hover me
</button>

// Item ativo/selecionado
<button className="liquid-glass-active rounded-full px-5 py-2">
  Active state
</button>
```

### CSS Variables

```css
/* Em seu CSS customizado */
.meu-componente {
  background: var(--liquid-glass-bg-sm);
  backdrop-filter: var(--liquid-glass-blur-sm);
  box-shadow: var(--liquid-glass-shadow-sm);
  border: var(--liquid-glass-border-sm);
  transition: var(--liquid-glass-transition);
}

.meu-texto {
  text-shadow: var(--liquid-glass-text-shadow);
  color: var(--liquid-glass-text-color);
}
```

---

## Inline Styles (Quando Necessário)

```tsx
<div 
  style={{
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
  className="rounded-full px-6 py-3"
>
  {/* Conteúdo */}
</div>
```

---

## Checklist de QA

Ao implementar Liquid Glass, verifique:

- [ ] **Blur aparece?** (Teste em Chrome, Firefox, Safari)
- [ ] **Legibilidade OK?** Texto legível sobre blur
- [ ] **Não está sobre outro glass?** Evite empilhamento
- [ ] **Espaçamento adequado?** 10% das bordas em containers
- [ ] **Border radius apropriado?** Pill (rounded-full) para navs
- [ ] **Transições suaves?** 300ms ease-out
- [ ] **Hover funciona?** Glow radial aparece
- [ ] **Logo visível?** Use filter para branco se necessário
- [ ] **Performance OK?** Blur não causa lag
- [ ] **Acessibilidade?** Contraste e Reduced Motion

---

## Troubleshooting Rápido

### Blur não aparece
```tsx
// Adicione -webkit- prefix
backdropFilter: 'blur(42px) saturate(180%)'
WebkitBackdropFilter: 'blur(42px) saturate(180%)' // ← Adicione esta linha
```

### Texto ilegível
```tsx
// Adicione text-shadow
<p className="liquid-glass-text"> {/* ← Classe com shadow */}
  Texto legível
</p>
```

### Logo não fica branco
```tsx
// Use a classe de filtro
<Image 
  src="/logo.svg"
  className="liquid-glass-logo" // ← Adicione esta classe
/>
```

### Performance ruim
```tsx
// Reduza o blur
backdropFilter: 'blur(30px) saturate(180%)' // ← Reduza para 30px
```

---

## Recursos

- **Documentação completa:** [docs/LIQUID_GLASS.md](./LIQUID_GLASS.md)
- **Regras do projeto:** [.cursor/rules/liquid-glass.md](../.cursor/rules/liquid-glass.md)
- **Componentes:** `components/ui/LiquidGlass.tsx`
- **CSS Utilities:** `styles/liquid-glass.css`

---

## Exemplos de Referência

Veja a implementação real no projeto:

```bash
# Menu principal da homepage
app/(frontend)/page.tsx (linha ~76)

# Componente base
components/ui/LiquidGlass.tsx

# Estilos globais
styles/liquid-glass.css
```

---

**Pronto para usar!** 🚀

Se tiver dúvidas, consulte a [documentação técnica completa](./LIQUID_GLASS.md).
