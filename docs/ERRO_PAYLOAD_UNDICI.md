# Erro: `TypeError: Illegal constructor` ao rodar Payload CLI (migrate, etc.)

## O que acontece

Ao rodar `npm run payload migrate:create` (ou `payload migrate`) aparece:

```
TypeError: Illegal constructor
    at new CacheStorage (node_modules\payload\node_modules\undici\lib\web\cache\cachestorage.js:17:14)
    at Object.<anonymous> (node_modules\payload\node_modules\undici\index.js:145:25)
    ...
    at Object.transformer [as .js] (node_modules/tsx/...)
```

O Payload CLI usa **tsx** para carregar o `payload.config.ts`. Ao carregar dependências (como o **undici**), o contexto do tsx faz a construção interna do undici (`new CacheStorage(kConstruct)`) falhar com "Illegal constructor".

## Solução recomendada: atualizar o Node.js

O pacote **undici** (usado pelo Payload) exige **Node.js >= 20.18.1**. Com versões anteriores (ex.: 20.12.x) esse erro é mais comum.

1. **Instale Node 20.18.1 ou superior** (ou use Node 22 LTS):
   - [nodejs.org](https://nodejs.org/) — baixe a versão LTS.
   - Ou com **nvm**: `nvm install 20.18` / `nvm use 20`.
   - Ou com **fnm**: `fnm install 20` / `fnm use 20`.

2. Confirme a versão:
   ```bash
   node -v
   ```
   Deve ser pelo menos `v20.18.1`.

3. Rode de novo:
   ```bash
   npm run payload migrate:create
   ```

O projeto já tem `"engines": { "node": ">=20.18.1" }` no `package.json` para avisar sobre isso.

## Se não puder atualizar o Node

- **Alternativa 1:** Em máquinas com Node 20.18+ (ou 22), rode os comandos de migrate lá (ou no CI) e suba apenas os arquivos de migração no repositório.
- **Alternativa 2:** Usar **`--use-swc`** evita o tsx e o erro do undici. O script `npm run payload` já está configurado com `payload --use-swc` (requer `@swc-node/register` — já está como devDependency). Para testar manualmente:
  ```bash
  npx payload --use-swc migrate:create
  ```

## Patch aplicado (dupla carga do undici)

Se o erro continuar mesmo com `--use-swc` ou Node 20.18+, pode haver **dupla carga** do undici (duas instâncias do módulo `symbols`, então `kConstruct` não é o mesmo referência). Foi aplicado um patch nos construtores de `CacheStorage` do undici para aceitar qualquer `Symbol` com descrição `'constructable'`, além da referência estrita:

- `node_modules/payload/node_modules/undici/lib/web/cache/cachestorage.js`
- `node_modules/undici/lib/cache/cachestorage.js`

**Nota:** `npm install` sobrescreve arquivos em `node_modules`. Se o erro voltar após instalar dependências, reaplique o patch ou use [patch-package](https://github.com/ds300/patch-package) para persistir o patch.

## Resumo

| Causa | Ação |
|-------|------|
| Node &lt; 20.18.1 + tsx + undici | **Atualizar Node para >= 20.18.1** (recomendado) |
| Não pode atualizar Node | Rodar migrate em outro ambiente com Node 20.18+ ou tentar `--use-swc` |
| Dupla carga do undici (tsx/contexto) | Patch no CacheStorage (ver seção acima) ou Node 20.18+ + `--use-swc` |
