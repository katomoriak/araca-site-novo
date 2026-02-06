# ✨ Liquid Glass Cursor

## Estética Apple | Design Minimalista | Movimento Fluido

Um cursor personalizado com a icônica estética **Liquid Glass** da Apple, criando uma experiência visual premium e moderna.

---

## 🎯 Características

### 🌊 Movimento com Mola
- **Física de mola** para movimento orgânico e natural
- **Efeito de espichar sutil** ao movimentar (sem rotação)
- **Suavidade extrema** com interpolação spring-based estilo Apple

### 💎 Glass Morphism Autêntico
- **Backdrop filter blur** com saturação aumentada (180%)
- **Transparência gradual** com reflexos realistas
- **Bordas sutis** com múltiplas camadas de brilho
- **Sombras profundas** para criar profundidade

### ⚡ Alta Performance
- **60 FPS constante** usando requestAnimationFrame
- **GPU-accelerated** com will-change
- **Otimizado** para movimentos rápidos e lentos

### 🎯 Interação Inteligente
- **Aumenta automaticamente** sobre elementos clicáveis
- **Comprime ao clicar** para feedback tátil visual
- **Transições suaves** entre estados

---

## 🚀 Como Usar

### No React/Next.js

```tsx
import { LiquidGlassCursor } from '@/components/ui/LiquidGlassCursor'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <LiquidGlassCursor />
        {children}
      </body>
    </html>
  )
}
```

### HTML Standalone

Abra o arquivo `test-liquid-cursor.html` no navegador para ver o cursor em ação com uma página de demonstração completa.

```bash
# Método 1: Diretamente no navegador
# Abra test-liquid-cursor.html

# Método 2: Com servidor local
node server.js
# Acesse: http://localhost:3000/test-liquid-cursor.html
```

---

## 🎨 Design

### Tamanhos
- **Normal**: 32px × 32px
- **Hover**: 48px × 48px (sobre elementos clicáveis)
- **Pressed**: 28px × 28px (ao clicar)

### Cores e Transparência
```css
background: rgba(255, 255, 255, 0.15)
backdrop-filter: blur(3px) saturate(180%)
border: 1.5px solid rgba(255, 255, 255, 0.3)
```

### Física do Movimento
```javascript
spring: 0.15  // Força da mola (0-1)
friction: 0.7 // Resistência do movimento (0-1)
```

---

## 🔧 Customização

### Alterar Tamanhos

Edite no arquivo `LiquidGlassCursor.tsx` ou `test-liquid-cursor.html`:

```css
.liquid-cursor-container {
  width: 32px;   /* Tamanho normal */
  height: 32px;
}

.liquid-cursor-container.is-pointer {
  width: 48px;   /* Tamanho em hover */
  height: 48px;
}
```

### Ajustar Física

```javascript
const spring = 0.15   // Maior = mais rápido
const friction = 0.7  // Menor = mais fluido
```

### Alterar Aparência

```css
.liquid-cursor-inner {
  background: rgba(255, 255, 255, 0.15);  /* Opacidade */
  backdrop-filter: blur(3px);              /* Blur bem sutil (máxima nitidez) */
  border: 1.5px solid rgba(255, 255, 255, 0.3);  /* Borda */
}
```

---

## 💡 Detalhes Técnicos

### Efeito de Mola

O cursor segue o mouse e espicha sutilmente ao movimentar:

```javascript
// Física de mola
const spring = 0.15
const friction = 0.7

// Calcula velocidade
velocity.x += (mousePos.x - cursorPos.x) * spring
velocity.y += (mousePos.y - cursorPos.y) * spring
velocity.x *= friction
velocity.y *= friction

// Efeito de espichar sutil (sem rotação)
const speed = Math.sqrt(velocity.x² + velocity.y²)
const stretch = Math.min(speed / 20, 1)
const scaleX = 1 + stretch * 0.15  // Estica horizontal
const scaleY = 1 - stretch * 0.08  // Comprime vertical

transform: scaleX(${scaleX}) scaleY(${scaleY})
```

### Glass Morphism

O efeito de vidro usa múltiplas camadas:

1. **Base**: Fundo semi-transparente com blur
2. **Brilho superior** (::before): Gradiente branco no topo
3. **Sombra inferior** (::after): Gradiente escuro embaixo
4. **Bordas**: Múltiplas sombras internas e externas

### Detecção de Hover

```javascript
const isClickable = 
  target.tagName === 'A' ||
  target.tagName === 'BUTTON' ||
  target.closest('a, button, [role="button"], input, textarea')
```

---

## 📱 Responsividade

O cursor é automaticamente **desabilitado em dispositivos touch**:

```css
@media (pointer: coarse) {
  .liquid-cursor-container {
    display: none !important;
  }
}
```

---

## ✨ Diferenciais

### Comparado ao cursor anterior:

| Característica | Cursor Anterior | Liquid Glass |
|---|---|---|
| **Complexidade** | ~300 linhas | ~200 linhas |
| **Performance** | Médio (clonagem DOM) | Alto (apenas transforms) |
| **Estética** | Zoom com conteúdo | Glass puro minimalista |
| **Movimento** | Linear | Física de mola |
| **Manutenção** | Complexa | Simples |

### Por que é melhor?

1. **Mais simples**: Sem clonagem de DOM
2. **Mais rápido**: Apenas CSS transforms
3. **Mais elegante**: Design minimalista Apple
4. **Mais fluido**: Física de mola natural
5. **Mais leve**: Menos código, menos memória

---

## 🎯 Elementos Suportados

O cursor aumenta automaticamente ao passar sobre:

- ✅ Links (`<a>`)
- ✅ Botões (`<button>`)
- ✅ Inputs (`<input>`, `<textarea>`, `<select>`)
- ✅ Elementos com `role="button"`
- ✅ Elementos com `data-cursor-hover`

### Adicionar hover em elemento customizado:

```html
<div data-cursor-hover>
  Elemento customizado com hover
</div>
```

---

## 🌐 Compatibilidade

### Navegadores Suportados

- ✅ Chrome/Edge 76+ (backdrop-filter)
- ✅ Safari 9+ (webkit-backdrop-filter)
- ✅ Firefox 103+ (backdrop-filter)
- ✅ Opera 63+

### Features Requeridas

- `backdrop-filter` ou `-webkit-backdrop-filter`
- `requestAnimationFrame`
- `matchMedia` (para detecção de touch)

---

## 🎨 Inspiração

Design inspirado nos elementos de interface da Apple:

- **macOS Cursor**: Movimento suave e responsivo
- **iOS Glass**: Transparência com blur
- **Apple Design Language**: Minimalismo e elegância
- **Liquid Motion**: Fluidez natural

---

## 📝 Exemplos de Uso

### Página Simples

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="liquid-cursor.css">
</head>
<body>
  <h1>Meu Site</h1>
  <button>Clique Aqui</button>
  
  <div class="liquid-cursor-container">
    <div class="liquid-cursor-inner"></div>
  </div>
  
  <script src="liquid-cursor.js"></script>
</body>
</html>
```

### Com React

```tsx
import { LiquidGlassCursor } from '@/components/ui/LiquidGlassCursor'

export default function App() {
  return (
    <>
      <LiquidGlassCursor />
      <main>
        {/* Seu conteúdo */}
      </main>
    </>
  )
}
```

---

## 🐛 Troubleshooting

### Cursor não aparece
- Verifique se a classe `has-liquid-cursor` está no body
- Confirme que não está em dispositivo touch

### Movimento está travando
- Verifique o DevTools para erros JavaScript
- Confirme que o CSS está carregado corretamente

### Blur não funciona
- Alguns navegadores antigos não suportam `backdrop-filter`
- Use `-webkit-backdrop-filter` para Safari antigo

---

## 🔮 Roadmap Futuro

- [ ] Temas de cores (escuro, claro, colorido)
- [ ] Efeitos de trail (rastro)
- [ ] Partículas ao clicar
- [ ] Modo "gravidade" (simula peso)
- [ ] Integração com gestos

---

**✨ Feito com amor para o projeto Araçá Arquitetura**

*Design minimalista. Movimento fluido. Estética Apple.*
