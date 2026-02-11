# Galeria de Projetos

A galeria da home é preenchida automaticamente a partir dos **manifests** nesta pasta. As **imagens e vídeos** podem estar:

- **No Supabase Storage** (recomendado): bucket `a_public`, pasta com o mesmo nome do slug (ex: `areasocial_residencia-ninhoverce/cover.png`).  
  URL base: `https://[PROJECT].supabase.co/storage/v1/object/public/a_public/[slug]/[arquivo]`  
  Configure `NEXT_PUBLIC_SUPABASE_URL` (e opcionalmente `NEXT_PUBLIC_SUPABASE_PROJETOS_BUCKET=a_public`) no `.env`.
- **Localmente**: dentro de `public/projetos/[slug]/` (quando Supabase não está configurado).

## Estrutura

Cada projeto é uma **pasta** com o nome do projeto (slug, ex: `areasocial_residencia-ninhoverce`). Dentro dela (ou no bucket no Supabase, com a mesma pasta):

| Arquivo | Obrigatório | Descrição |
|---------|-------------|-----------|
| `manifest.json` | ✅ Sim | Título, descrição e lista de mídias na ordem de exibição |
| `cover.jpg` (ou .png) | ✅ Sim | Imagem de capa do card na home (recomendado: 800×600px ou maior) |
| Demais arquivos | Conforme manifest | Imagens (`.jpg`, `.png`, `.webp`) ou vídeos (`.mp4`, `.webm`) referenciados no manifest |

## Como adicionar um projeto

1. **Crie uma pasta** com nome em minúsculo e hífens, ex: `meu-projeto`.

2. **Coloque a imagem de capa** com o nome definido no manifest (ex: `cover.jpg`).

3. **Coloque as mídias da galeria** (fotos e/ou vídeos) na ordem em que quiser que apareçam.

4. **Crie o `manifest.json`** dentro da pasta, no formato abaixo.

### Exemplo de `manifest.json`

```json
{
  "title": "Casa Pinho",
  "description": "Um projeto residencial que harmoniza arquitetura contemporânea com elementos naturais.",
  "tag": "Residencial",
  "cover": "cover.jpg",
  "media": [
    { "type": "image", "file": "01.jpg", "name": "Sala de estar" },
    { "type": "image", "file": "02.jpg", "name": "Cozinha integrada" },
    { "type": "video", "file": "tour.mp4" },
    { "type": "image", "file": "03.jpg", "name": "Área externa" }
  ]
}
```

- **title**: Nome do projeto (exibido no card e no modal).
- **description**: Texto curto que aparece no card e no topo da galeria.
- **tag**: Etiqueta opcional (ex: "Residencial", "Comercial", "Interiores").
- **cover**: Nome do arquivo da imagem de capa (deve estar nesta mesma pasta).
- **media**: Lista de itens na ordem em que aparecem na galeria. Cada item:
  - **type**: `"image"` ou `"video"`.
  - **file**: Nome do arquivo (jpg, png, webp, mp4, webm, etc.).
  - **name** (opcional): Nome exibido abaixo da imagem no modal da galeria (centralizado, com fundo e animação).

Depois de salvar os arquivos e o manifest, **atualize a página** da home: os projetos são carregados automaticamente.

## Dicas

- Use nomes de arquivo simples (sem espaços), ex: `01.jpg`, `sala-de-estar.jpg`, `tour.mp4`.
- Para vídeos, prefira `.mp4` (melhor compatibilidade).
- A capa pode ser uma das fotos da galeria ou uma versão recortada; o importante é que o arquivo exista na pasta.
