# Impacto das atualizações de dependências no front-end

**Referência:** [docs/PLANO_ATUALIZACAO_DEPENDENCIAS_REVISADO.md](PLANO_ATUALIZACAO_DEPENDENCIAS_REVISADO.md)

Este documento resume o impacto das atualizações planejadas no front-end e ações que o time pode tomar **antes** e **durante** as atualizações.

---

## Resumo executivo

| Pacote         | Risco front-end | Onde é usado                          | Preparação recomendada                          |
|----------------|-----------------|---------------------------------------|-------------------------------------------------|
| Payload/types  | Baixo           | Admin, server components              | Nenhuma                                         |
| sharp          | Baixo           | Otimização de imagens (Next/Payload)  | Nenhuma                                         |
| lucide-react   | Baixo           | ~30 componentes, ícones               | Verificar ícones após atualizar                 |
| tailwind-merge | Baixo           | `lib/utils.ts` cn(), ~40+ componentes | Checar API v3 (twMerge vs extendTailwindMerge)  |
| date-fns       | **Muito baixo** | Não usado no front-end                | Nenhuma (formatação usa Intl)                   |
| recharts       | Médio           | chart.tsx (shadcn), BalanceChart, OverviewChart | Verificar compatibilidade API v3        |
| framer-motion  | Médio           | home, ProjectGallery, SiteNav, PostGrid, etc.   | Checar changelog v12                    |
| swiper         | Médio–Alto      | GalleryCarousel, ProjectsCarousel     | Migration guide v11→v12; ajustar imports/modules|
| tailwindcss    | Alto            | Tema, classes, plugins                | Guia v4; `tailwind.config`, PostCSS             |

---

## 1. Pacotes sem impacto prático no front-end

### Payload 3.76 + @types/react (Fase 1)
- Admin e server components. Nenhuma alteração de código necessária.

### sharp (Fase 2)
- Usado pelo Next/Payload para otimização de imagens. Transparente para o código.

### date-fns (Fase 3)
- **Importante:** O `formatDate` em `lib/utils.ts` usa `Intl.DateTimeFormat`, não date-fns.
- Os dashboards (CrmKanban, TransactionsTable, etc.) também usam `Intl.DateTimeFormat`.
- `date-fns` está no `package.json` mas não é importado pelo front-end. Pode ser dependência transitiva ou uso no Payload.
- **Conclusão:** Atualizar date-fns não deve exigir mudanças no front-end.

---

## 2. lucide-react 0.400 → 0.563 (Fase 2)

**Uso no projeto:** ~30 arquivos (home, blog, dashboard, design-system, layout).

**Ícones usados:** Plus, ChevronLeft, ChevronRight, ArrowLeft, User, Trash2, Repeat, Check, Minus, X, Quote, ChevronDown, Search, Github, Linkedin, Twitter, Instagram, ArrowRight, Tag, PanelLeft, Loader, etc.

**Riscos:**
- Alguns ícones tiveram visual alterado (ex.: star-off, tickets-plane, monitor-off, cloud-off, bookmark, etc.). O projeto não usa esses.
- `aria-hidden` passou a ser adicionado por padrão (melhora acessibilidade). Ícones decorativos continuam funcionando; ícones interativos devem ter `aria-label` ou `title`.

**Ação sugerida:** Atualizar e testar visualmente. Se algum ícone sumir ou aparecer diferente, conferir [lucide changelog](https://github.com/lucide-icons/lucide/releases) para possíveis renomeações.

---

## 3. tailwind-merge 2.x → 3.x (Fase 3)

**Uso:** `lib/utils.ts` e `src/lib/utils.ts`:

```ts
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Riscos (v3):**
- A API base `twMerge` permanece compatível.
- v3 adicionou suporte a Tailwind v4 e `extendTailwindMerge` para temas customizados.
- Uso atual (`twMerge(clsx(inputs))`) deve continuar funcionando sem mudanças.

**Ação sugerida:** Atualizar e rodar `npm run build`. Se houver erro em `cn()`, verificar [tailwind-merge v3 changelog](https://github.com/dcastil/tailwind-merge/releases).

---

## 4. recharts 2.x → 3.x (Fase 3)

**Uso:**
- `components/ui/chart.tsx` – shadcn chart, usa `RechartsPrimitive.*`
- `components/dashboard/BalanceChart.tsx` – LineChart
- `components/dashboard/OverviewChart.tsx` – BarChart

**Riscos:**
- Recharts v3 pode ter alterações de API e de nomes de classes CSS (`.recharts-*`).
- O `chart.tsx` usa muitos seletores CSS para `.recharts-cartesian-axis-tick_text`, `.recharts-dot`, etc. Mudanças nessas classes quebrariam estilos.

**Ação sugerida:**
1. Consultar [recharts releases](https://github.com/recharts/recharts/releases) antes de atualizar.
2. Após atualizar, testar páginas de dashboard ( gráficos de saldo e overview).
3. Se os estilos quebrarem, ajustar seletores no `chart.tsx` conforme nova API.

---

## 5. framer-motion 11 → 12 (Fase 3)

**Uso:**
- `app/(frontend)/page.tsx` – home (motion.div, AnimatePresence)
- `components/home/ScrollTextReveal.tsx` – motion, useScroll
- `components/home/ProjectGallery.tsx` – modal, animações
- `components/layout/PageGradientBackground.tsx`
- `components/layout/SiteNav.tsx` – menu mobile
- `components/blog/PostGrid.tsx`

**API usada:** `motion`, `AnimatePresence`, `useScroll`, variantes, `initial`/`animate`/`exit`.

**Riscos:**
- Framer Motion 12 pode ter breaking changes em props ou nomes de variantes.
- Consultar [changelog](https://www.framer.com/motion/changelog/) antes de atualizar.

**Ação sugerida:** Após atualizar, verificar home, carrossel de projetos, menu mobile e grid do blog.

---

## 6. swiper 11 → 12 (Fase 3)

**Uso:**
- `components/home/GalleryCarousel.tsx`
- `components/home/ProjectsCarousel.tsx`

**Código atual:**
```ts
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, A11y, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
```

- Usa `swiper/modules`, `realIndex`, `slideToLoop`, `slidePrev`, `slideNext`.
- Há workaround para loop no Swiper 11: `loopSlides = [...projects, ...projects, ...projects]`.

**Riscos:**
- Swiper 12 pode alterar imports, módulos e comportamento de loop.
- Guia de migração: [swiperjs.com/migration](https://swiperjs.com/migration-guide) (ou documentação oficial).

**Ações sugeridas:**
1. Consultar migration guide antes de atualizar.
2. Verificar se o workaround de loop ainda é necessário no v12.
3. Ajustar imports (ex.: `swiper/modules` → possível novo path).
4. Testar GalleryCarousel e ProjectsCarousel (loop, navegação, autoplay).

---

## 7. tailwindcss 3 → 4 (Fase 3, maior impacto)

**Uso:**
- `tailwind.config.ts` – tema (cores, fontes, animações, plugins)
- `styles/globals.css` – variáveis CSS, @tailwind
- `postcss.config.mjs`
- Classes em ~100+ arquivos

**Riscos:**
- Tailwind v4 muda configuração, PostCSS e forma de customizar tema.
- Pode exigir migração de `tailwind.config.ts` e ajuste de variáveis.
- Ver [Tailwind v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide).

**Ação sugerida:**
- Deixar Tailwind v4 por último.
- Criar branch dedicada para migração.
- Seguir guia oficial e testar tema (cores araça, glass, animações).

---

## O que o front-end pode fazer antes das atualizações

1. **Documentar cenários de teste**
   - Home: hero, carrosséis, animações, menu
   - Blog: listagem, post único, PostGrid
   - Dashboard: gráficos, tabelas, sheets
   - Design system: ícones, botões, cards

2. **Não alterar código preventivamente**
   - Fases 1 e 2 tendem a funcionar sem mudanças.
   - Para Fase 3, priorizar: checar changelog → atualizar → build → testar → corrigir se necessário.

3. **Manter `date-fns` como está no front-end**
   - `formatDate` em `lib/utils.ts` usa `Intl`; não depende de date-fns.

---

## Checklist pós-atualização (front-end)

- [ ] `npm run build` passa
- [ ] Home carrega e animações funcionam
- [ ] Carrosséis (GalleryCarousel, ProjectsCarousel) funcionam
- [ ] Menu mobile (SiteNav) abre/fecha e anima
- [ ] Blog lista posts e exibe post único
- [ ] Dashboard exibe gráficos corretamente
- [ ] Design system: ícones e componentes renderizam
- [ ] Sem erros no console do navegador
