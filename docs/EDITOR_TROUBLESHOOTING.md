# Troubleshooting do Editor

## Problemas Comuns e Soluções

### 1. Menu de Slash Commands (`/`) não aparece

**Sintomas:**
- Digite `/` e nada acontece
- Menu não abre

**Soluções:**

1. **Certifique-se de digitar `/` no início da linha ou após um espaço**
   - ✅ Correto: `[início]` `/titulo`
   - ✅ Correto: `Texto aqui` `/lista`
   - ❌ Incorreto: `Texto/lista` (sem espaço antes)

2. **Verifique o console do navegador (F12)**
   - Abra DevTools (F12)
   - Vá na aba Console
   - Digite `/` no editor
   - Procure por erros em vermelho

3. **Recarregue a página**
   - Pressione `Ctrl+R` ou `F5`
   - Tente novamente

4. **Limpe o cache do navegador**
   - `Ctrl+Shift+Delete`
   - Selecione "Imagens e arquivos em cache"
   - Limpe e recarregue

### 2. Imagens não aparecem após upload

**Sintomas:**
- Faz upload mas imagem não aparece
- Espaço em branco onde deveria estar a imagem

**Soluções:**

1. **Verifique o console do navegador**
   ```
   Procure por logs:
   [Toolbar] Arquivo selecionado: nome.jpg
   [Toolbar] Preview temporário criado
   [ImagePlugin] Inserindo imagem: {...}
   [ImagePlugin] Imagem inserida com sucesso
   [Toolbar] Upload concluído: {...}
   ```

2. **Verifique se o Supabase está configurado**
   - Arquivo `.env.local` deve ter:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
   SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
   ```

3. **Verifique o bucket do Supabase**
   - Acesse Supabase Dashboard
   - Vá em Storage
   - Bucket `media` deve existir e ser público
   - Crie se não existir:
     ```sql
     -- No SQL Editor do Supabase
     insert into storage.buckets (id, name, public)
     values ('media', 'media', true);
     ```

4. **Teste com imagem pequena**
   - Use uma imagem < 1MB
   - Formato JPG ou PNG
   - Sem caracteres especiais no nome

5. **Verifique permissões do Supabase Storage**
   - No Supabase Dashboard → Storage → Policies
   - Deve ter policy para INSERT e SELECT

### 3. Imagem aparece mas depois desaparece

**Causa:** Preview temporário (data URL) funciona, mas upload falha

**Solução:**
1. Verifique logs do console para erro de upload
2. Verifique configuração do Supabase
3. Verifique tamanho da imagem (max 5MB)

### 4. Erro "Não autenticado" ao fazer upload

**Causa:** Token de autenticação inválido ou expirado

**Solução:**
1. Faça logout e login novamente no dashboard
2. Verifique se está acessando via `/dashboard` (não `/admin`)
3. Limpe cookies do navegador

### 5. Slash commands aparecem mas não funcionam ao clicar

**Solução:**
1. Use as setas ↑↓ para navegar
2. Pressione Enter para selecionar
3. Ou clique diretamente no comando
4. Se não funcionar, recarregue a página

### 6. Formatação não é salva

**Causa:** Conteúdo HTML não está sendo gerado corretamente

**Solução:**
1. Verifique se clicou em "Salvar" após editar
2. Abra console e procure por erros
3. Tente formatar novamente e salvar

### 7. Conteúdo desaparece ao recarregar

**Causa:** Não salvou antes de sair

**Solução:**
- Sempre clique em "Salvar alterações" antes de sair
- Considere copiar conteúdo longo para backup

## Debugging Avançado

### Verificar se ImageNode está registrado

Abra console (F12) e execute:
```javascript
// No console do navegador
console.log('ImageNode registrado:', 
  window.__lexicalEditor?.hasNodes?.(['image']) || 'Editor não encontrado'
)
```

### Verificar conteúdo HTML gerado

Após editar, abra console e execute:
```javascript
// Copiar HTML gerado
copy(document.querySelector('[contenteditable="true"]').innerHTML)
```

### Logs de Debug

O editor agora tem logs detalhados. Abra console (F12) e procure por:
- `[Toolbar]` - Ações da barra de ferramentas
- `[SlashCommand]` - Menu de comandos /
- `[ImagePlugin]` - Inserção de imagens
- `[API]` - Chamadas de API

### Testar Upload Manualmente

```javascript
// No console do navegador
const formData = new FormData()
const input = document.createElement('input')
input.type = 'file'
input.accept = 'image/*'
input.onchange = async (e) => {
  const file = e.target.files[0]
  formData.append('file', file)
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  console.log(await res.json())
}
input.click()
```

## Configuração do Supabase Storage

### 1. Criar bucket público "media"

**Opção A – Supabase Dashboard:**
1. Acesse **Storage** → **New bucket**
2. Nome: `media`
3. Marque **"Public bucket"** (obrigatório para imagens aparecerem no conteúdo)
4. Clique em Create

**Opção B – SQL Editor:**
```sql
-- No SQL Editor do Supabase
insert into storage.buckets (id, name, public)
values ('media', 'media', true);
```

**Bucket já existe mas imagens não carregam?** Torne-o público:
```sql
update storage.buckets set public = true where id = 'media';
```

### 2. Configurar Policies

```sql
-- Policy para upload (INSERT)
create policy "Usuários autenticados podem fazer upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'media');

-- Policy para leitura (SELECT)
create policy "Todos podem visualizar"
on storage.objects for select
to public
using (bucket_id = 'media');

-- Policy para deletar (DELETE)
create policy "Usuários autenticados podem deletar"
on storage.objects for delete
to authenticated
using (bucket_id = 'media');
```

### 3. Verificar Configuração

No arquivo `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Chave secreta, não compartilhe!

# Opcional: se usar S3 do Supabase
S3_BUCKET=media
S3_ACCESS_KEY_ID=sua-access-key
S3_SECRET_ACCESS_KEY=sua-secret-key
S3_ENDPOINT=https://xxxxx.supabase.co/storage/v1/s3
S3_REGION=auto
```

## Contato para Suporte

Se o problema persistir:
1. Anote a mensagem de erro completa
2. Tire screenshot do console (F12)
3. Descreva os passos que causaram o erro
4. Entre em contato com o suporte técnico

## Checklist de Verificação

Antes de reportar um problema, verifique:

- [ ] Recarreguei a página (Ctrl+R)
- [ ] Limpei o cache do navegador
- [ ] Verifiquei o console (F12) por erros
- [ ] Testei em navegador diferente (Chrome, Firefox, Edge)
- [ ] Verifiquei se estou autenticado no dashboard
- [ ] Verifiquei variáveis de ambiente (.env.local)
- [ ] Verifiquei configuração do Supabase Storage
- [ ] Testei com imagem pequena (<1MB)
- [ ] Li toda esta documentação
