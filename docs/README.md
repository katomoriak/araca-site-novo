# Documentação do Projeto Aracá

## Índice Geral

### Liquid Glass Design System

Implementação do sistema de design Liquid Glass da Apple (WWDC 2025) para interfaces modernas com efeitos de vidro translúcido, refração de luz e comportamento fluido.

**Documentos disponíveis:**

1. **[Guia Rápido de Implementação](./LIQUID_GLASS_QUICKSTART.md)** ⚡
   - Início em 5 minutos
   - Receitas comuns (navbar, sidebar, modal, etc.)
   - CSS utilities e classes prontas
   - Troubleshooting rápido

2. **[Documentação Técnica Completa](./LIQUID_GLASS.md)** 📖
   - Conceitos fundamentais (Lensing, Adaptivity, Dynamics)
   - Propriedades ópticas detalhadas
   - Variantes (Regular vs Clear)
   - Especificações CSS completas
   - Exemplos de código avançados
   - Best practices e troubleshooting

3. **[Regras do Cursor](./../.cursor/rules/liquid-glass.md)** 📋
   - Diretrizes de quando usar/não usar
   - Princípios fundamentais
   - Checklist de implementação
   - Parâmetros técnicos resumidos

**Arquivos de código:**

- **Componente React:** `components/ui/LiquidGlass.tsx`
- **CSS Utilities:** `styles/liquid-glass.css`
- **Export index:** `components/ui/index.ts`

**Implementação de referência:**

- Menu principal: `app/(frontend)/page.tsx` (linha ~76)

---

## Quick Links

### Para Desenvolvedores

- 🚀 [Começar agora](./LIQUID_GLASS_QUICKSTART.md) - Guia rápido
- 📚 [Documentação completa](./LIQUID_GLASS.md) - Referência técnica
- 🎨 [Design System Lab](http://localhost:3000/design-system) - Preview interativo

### Para Designers

- 🎨 [Princípios de Design](./../.cursor/rules/liquid-glass.md#princípios-fundamentais)
- 🔍 [Quando usar Liquid Glass](./../.cursor/rules/liquid-glass.md#quando-usar)
- 📐 [Especificações visuais](./LIQUID_GLASS.md#propriedades-ópticas)

### Recursos Externos

- [Apple WWDC 2025 - Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/)
- [Human Interface Guidelines - Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [Liquid Glass Info](https://liquidglass.info/)

---

## Estrutura da Documentação

```
docs/
├── README.md                        ← Você está aqui
├── LIQUID_GLASS_QUICKSTART.md      ← Guia rápido (5 min)
└── LIQUID_GLASS.md                 ← Documentação técnica completa

.cursor/
└── rules/
    └── liquid-glass.md             ← Regras e diretrizes do projeto

components/
└── ui/
    ├── LiquidGlass.tsx             ← Componente React
    └── index.ts                     ← Exports

styles/
├── globals.css                      ← Importa liquid-glass.css
└── liquid-glass.css                ← CSS Variables e utilities
```

---

## Começando

1. **Leia o guia rápido:** [LIQUID_GLASS_QUICKSTART.md](./LIQUID_GLASS_QUICKSTART.md)
2. **Importe o componente:**
   ```tsx
   import { LiquidGlass, LiquidGlassButton } from '@/components/ui'
   ```
3. **Use no seu código:**
   ```tsx
   <LiquidGlass variant="regular" size="sm" className="rounded-full px-6 py-3">
     <nav>{/* Seu conteúdo */}</nav>
   </LiquidGlass>
   ```

---

## Suporte

Para dúvidas sobre Liquid Glass:

1. Consulte o [Guia Rápido](./LIQUID_GLASS_QUICKSTART.md) para receitas comuns
2. Veja a [Documentação Técnica](./LIQUID_GLASS.md) para detalhes avançados
3. Confira a [implementação de referência](../app/(frontend)/page.tsx) no menu principal

---

**Última atualização:** 06/02/2026  
**Versão:** 1.0.0  
**Projeto:** Aracá Interiores
