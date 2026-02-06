# Liquid Glass Design System - Aracá

## Visão Geral

O **Liquid Glass** é um sistema de design baseado na linguagem visual da Apple (WWDC 2025), que usa efeitos de vidro translúcido, refração de luz e comportamento fluido para criar interfaces modernas e imersivas.

## Quando Usar

✅ **Use Liquid Glass para:**
- Elementos de navegação flutuantes (menus, navbars, toolbars)
- Controles que ficam sobre conteúdo rico (mídia, vídeos, imagens)
- Componentes que precisam destacar-se mantendo transparência
- Layers que devem flutuar sobre o conteúdo principal

❌ **NÃO use Liquid Glass para:**
- Camada de conteúdo principal
- Glass sobre glass (empilhamento)
- Elementos que não precisam transparência
- Áreas de alta densidade de informação

## Princípios Fundamentais

### 1. Lensing (Efeito de Lente)
O efeito primário é o "lensing" - a luz é dobrada e concentrada (não apenas espalhada), criando definição e profundidade.

### 2. Adaptivity (Adaptabilidade)
O material adapta-se automaticamente ao conteúdo por trás dele:
- Sombras mais pronunciadas sobre texto
- Ajuste automático de tinta e contraste
- Transição light/dark baseada no background

### 3. Dynamics (Dinamismo)
Resposta fluida à interação:
- Flexiona e energiza com luz no toque
- Morfismo suave entre estados
- Comportamento gel-like e maleável

## Especificações Técnicas

### Parâmetros Base (Container Principal)

```css
/* Background com gradiente sutil */
background: linear-gradient(135deg, 
  rgba(255,255,255,0.12) 0%, 
  rgba(255,255,255,0.06) 100%
);

/* Blur + Saturação (efeito de lensing) */
backdrop-filter: blur(42px) saturate(180%);
-webkit-backdrop-filter: blur(42px) saturate(180%);

/* Sombras multicamadas para profundidade */
box-shadow: 
  0 8px 32px rgba(0, 0, 0, 0.4),      /* Sombra principal */
  0 2px 8px rgba(0, 0, 0, 0.2),       /* Sombra secundária */
  inset 0 1px 0 rgba(255, 255, 255, 0.2),  /* Highlight superior */
  inset 0 -1px 0 rgba(0, 0, 0, 0.1);       /* Sombra inferior interna */

/* Borda refratora */
border: 1px solid rgba(255, 255, 255, 0.18);

/* Forma arredondada (pill shape) */
border-radius: 9999px; /* ou valor específico */
```

### Variações por Tamanho

**Elementos Pequenos (navbars, toolbars):**
- Blur: 42px
- Transição light/dark automática
- Sombras sutis

**Elementos Grandes (sidebars, menus):**
- Blur: 50-60px (material mais espesso)
- Sombras mais profundas e ricas
- Efeito de lensing mais pronunciado
- Soft scattering de luz

### Estados Interativos

**Hover:**
```css
.liquid-glass-item:hover {
  background: radial-gradient(
    circle at center, 
    rgba(255,255,255,0.15) 0%, 
    transparent 70%
  );
}
```

**Active/Selected:**
```css
.liquid-glass-active {
  background: linear-gradient(135deg, 
    rgba(255,255,255,0.95) 0%, 
    rgba(255,255,255,0.85) 100%
  );
  box-shadow: 
    0 2px 12px rgba(0, 0, 0, 0.15), 
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}
```

## Implementação no Projeto

### Menu Principal (Exemplo de Referência)

```tsx
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
  className="rounded-full px-6 py-3"
>
  {/* Conteúdo */}
</div>
```

### Espaçamento e Layout

- **Distância das bordas:** 20% do container (10% cada lado)
- **Largura máxima:** 80% do container ou 1024px
- **Centralização:** Usar `justify-center` no container pai
- **Padding interno:** 16-24px (px-6, py-3)

### Tipografia sobre Liquid Glass

```css
/* Texto sobre vidro */
text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
color: rgba(255, 255, 255, 0.95);
```

### Logotipos sobre Liquid Glass

```css
/* SVG com filtro branco */
filter: brightness(0) invert(1);

/* Drop shadow para destacar */
drop-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
```

## Acessibilidade

O Liquid Glass inclui modificadores automáticos de acessibilidade:

- **Reduced Transparency:** Vidro mais opaco
- **Increased Contrast:** Elementos preto/branco com borda contrastante
- **Reduced Motion:** Desabilita propriedades elásticas

## Diretrizes de Motion

```css
/* Transições padrão */
transition: all 300ms ease-out;

/* Morfismo entre estados */
transition: 
  background 400ms ease-in-out,
  box-shadow 400ms ease-in-out,
  transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

## Referências

- [Apple WWDC 2025 - Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/)
- [Apple Human Interface Guidelines - Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- Implementação oficial: `.glassEffect()` modifier (SwiftUI)

## Checklist de Implementação

Ao criar um novo componente Liquid Glass, verifique:

- [ ] Blur entre 40-60px com saturate(180%)
- [ ] Sombras multicamadas (externa + inset)
- [ ] Borda translúcida (rgba branco ~0.18)
- [ ] Border-radius apropriado (pill para navs)
- [ ] Text-shadow para legibilidade
- [ ] Transições suaves (300ms)
- [ ] Hover com glow radial
- [ ] Não está sobre outro glass
- [ ] Está na camada de navegação, não de conteúdo
- [ ] Respeita espaçamento de 10% das bordas do container

---

**Última atualização:** 06/02/2026
**Baseado em:** Apple WWDC 2025 Liquid Glass Design Language
