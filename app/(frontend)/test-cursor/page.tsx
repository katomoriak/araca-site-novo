'use client'

import { useState, useEffect } from 'react'

export default function TestCursorPage() {
  const [blurAmount, setBlurAmount] = useState(0.6)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    // Injeta o blur no DOM para o GlassCursor ler
    document.documentElement.style.setProperty('--cursor-content-blur', `${blurAmount}px`)
  }, [blurAmount])
  
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-4xl font-bold text-foreground">
            Teste do Glass Cursor
          </h1>
          <p className="mt-2 text-muted-foreground">
            Ajuste o blur e verifique o alinhamento do cursor glass
          </p>
        </div>

        {/* Painel de Controle */}
        <div className="glass-card space-y-6 p-8">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Blur do Conteúdo: {blurAmount.toFixed(1)}px
            </label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={blurAmount}
              onChange={(e) => setBlurAmount(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>0 (sem blur)</span>
              <span>3px (máximo)</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Recomendado: 0.6px para efeito glass premium
            </p>
          </div>

          {/* Info em Tempo Real */}
          <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-background/50 p-4">
            <div>
              <div className="text-xs text-muted-foreground">Posição X</div>
              <div className="font-mono text-lg font-semibold text-foreground">
                {mousePos.x}px
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Posição Y</div>
              <div className="font-mono text-lg font-semibold text-foreground">
                {mousePos.y}px
              </div>
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setBlurAmount(0.6)
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Resetar Valor Padrão
          </button>
        </div>

        {/* Área de Teste com Grid */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Área de Teste
          </h2>
          <p className="text-sm text-muted-foreground">
            Mova o cursor sobre os elementos abaixo para testar a compensação
          </p>

          {/* Grid de Cards */}
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="glass-card flex aspect-square items-center justify-center p-6 transition-all hover:scale-105"
              >
                <span className="font-display text-4xl font-bold text-foreground/30">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Texto para Teste */}
          <div className="glass-card space-y-4 p-8">
            <h3 className="font-display text-2xl font-semibold text-foreground">
              Display: Cormorant Garamond
            </h3>
            <p className="font-body text-lg text-muted-foreground">
              Títulos e destaques - teste o zoom do cursor sobre este texto
            </p>
            <p className="text-base text-muted-foreground">
              The quick brown fox jumps over the lazy dog. Passe o cursor sobre este parágrafo
              e observe como o zoom se comporta nas diferentes posições da tela.
            </p>
            <div className="flex gap-4">
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                Botão 1
              </button>
              <button className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">
                Botão 2
              </button>
              <button className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
                Botão 3
              </button>
            </div>
          </div>

          {/* Instruções */}
          <div className="rounded-lg border border-border bg-background/50 p-6">
            <h4 className="mb-2 text-sm font-semibold text-foreground">Instruções:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Mova o cursor sobre os elementos para verificar o alinhamento do zoom</li>
              <li>• O conteúdo ampliado deve estar perfeitamente alinhado com o ponto do cursor</li>
              <li>• Ajuste o <strong>Blur do Conteúdo</strong> para dar efeito glass mais premium (0.6px recomendado)</li>
              <li>• Teste em diferentes áreas da tela (esquerda, centro, direita) para verificar consistência</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
