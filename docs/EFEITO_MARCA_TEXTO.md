# Efeito de Marca-Texto Sequencial

## Descrição

Efeito visual onde palavras-chave aparecem destacadas com marca-texto amarelo/dourado, uma após a outra, criando uma sequência fluida e orgânica.

## Como Funciona

### Timing Sequencial

Cada palavra destacada tem um delay progressivo:

1. **Primeira palavra**: aparece 0.3s após o texto surgir
2. **Segunda palavra**: aparece 0.7s após o texto surgir (0.3s + 0.4s)
3. **Terceira palavra**: aparece 1.1s após o texto surgir (0.3s + 0.8s)
4. **Quarta palavra**: aparece 1.5s após o texto surgir (0.3s + 1.2s)
5. E assim por diante...

**Fórmula**: `delay = 0.3s + (índice_da_palavra × 0.4s)`

### Exemplo Prático

Para o texto: **"Na Aracá, combinamos estética, funcionalidade e execução."**

Com highlights em: `['estética', 'funcionalidade', 'execução']`

**Sequência de animação**:
1. Texto aparece (fade in)
2. 0.3s depois → marca-texto em "**estética**" (da esquerda para direita)
3. 0.7s depois → marca-texto em "**funcionalidade**" (da esquerda para direita)
4. 1.1s depois → marca-texto em "**execução**" (da esquerda para direita)

## Características do Marca-Texto

### Visual
- **Formato orgânico**: Bordas irregulares que imitam marca-texto real
- **Duas camadas**: Base + textura sobreposta para profundidade
- **Cores vibrantes**: 
  - Camada 1: Gradiente vertical (#FFD700 → #FFC800)
  - Camada 2: Gradiente horizontal (#FFE55C → #FFD700 → #FFC800)
- **Inclinação sutil**: `skewY(-0.5deg)` e `skewY(0.3deg)` para look manuscrito

### Animação
- **Direção**: Esquerda para direita (`transformOrigin: 'left'`)
- **Duração**: 0.5s por palavra
- **Easing**: `easeOut` (aceleração no início, desaceleração no fim)
- **Propriedades animadas**: 
  - `scaleX`: 0 → 1 (expansão horizontal)
  - `opacity`: 0 → 1 (fade in)

## Configuração no Código

### Ajustar Delays

No arquivo `ScrollTextReveal.tsx`, linhas 57-60:

```typescript
// Delay base (primeira palavra)
const baseDelay = 0.3  // ← altere aqui (em segundos)

// Intervalo entre palavras
const delayPerWord = 0.4  // ← altere aqui (em segundos)
```

**Exemplos**:
- Mais rápido: `baseDelay = 0.2`, `delayPerWord = 0.3`
- Mais lento: `baseDelay = 0.5`, `delayPerWord = 0.6`
- Simultâneo: `baseDelay = 0.3`, `delayPerWord = 0`

### Ajustar Duração da Animação

Linha 68:

```typescript
scaleX: { duration: 0.5, delay: totalDelay, ease: "easeOut" }
```

**Exemplos**:
- Mais rápido: `duration: 0.3`
- Mais lento: `duration: 0.8`

### Cores do Marca-Texto

**Camada 1** (linhas 73-79):
```css
background: 'linear-gradient(to bottom, transparent 0%, #FFD700 15%, #FFC800 85%, transparent 100%)'
```

**Camada 2** (linhas 82-88):
```css
background: 'linear-gradient(90deg, #FFE55C 0%, #FFD700 20%, #FFC800 40%, #FFD700 60%, #FFE55C 80%, #FFC800 100%)'
```

**Sugestões de outras cores**:
- Verde: `#7FFF00`, `#32CD32`, `#90EE90`
- Rosa: `#FF69B4`, `#FFB6C1`, `#FFC0CB`
- Azul: `#87CEEB`, `#00BFFF`, `#B0E0E6`

## Performance

✅ **Otimizado para**:
- Renderização via GPU (transform e opacity)
- Sem reflows/repaints
- Animações independentes por palavra
- Mobile-friendly

## Browser Support

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers
- ⚠️ Requer suporte a CSS transforms e Framer Motion

## Acessibilidade

- ✅ Texto permanece legível durante animação
- ✅ Cores com contraste adequado
- ✅ Não interfere com leitores de tela
- ✅ Animação pode ser desabilitada via `prefers-reduced-motion`
