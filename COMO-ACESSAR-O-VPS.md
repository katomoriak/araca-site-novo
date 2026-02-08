# Como acessar seu VPS (passo a passo)

## O que é SSH?

**SSH** é uma forma segura de “entrar” no seu servidor pelo computador, como se você estivesse na frente dele digitando comandos. Em vez de clicar em um programa, você abre uma janela de texto (o “terminal”) e escreve comandos. Quem tem a senha (ou chave) do servidor pode acessar assim.

- **Seu computador** = cliente (de onde você digita).
- **Seu VPS** = servidor (onde os comandos são executados).

---

## O que você precisa antes de começar

1. **IP do seu VPS:** `76.13.236.240`
2. **Usuário:** normalmente `root` (usuário administrador).
3. **Senha do root:** a senha que a Hostinger enviou quando você criou o VPS (por e-mail ou no painel).

Se não tiver a senha, veja a seção **“Onde achar a senha do VPS”** mais abaixo.

---

## Passo 1: Abrir o Terminal no Windows

1. Pressione a tecla **Windows** (ou clique no ícone do Windows).
2. Digite: **PowerShell** ou **Terminal**.
3. Clique em **Windows PowerShell** ou **Terminal**.

Uma janela preta ou azul vai abrir; é nela que você vai digitar os comandos.

---

## Passo 2: Verificar se o SSH está disponível

No Windows 10/11 o SSH costuma já vir instalado.

1. Na janela que abriu, digite exatamente (e pressione Enter):

```powershell
ssh -V
```

2. Se aparecer algo como `OpenSSH_8.x` ou similar, está pronto.  
   Se aparecer “comando não encontrado”, vá para o **Passo 2B**.

### Passo 2B (só se o SSH não existir)

1. Abra **Configurações** do Windows.
2. Vá em **Aplicativos** → **Recursos opcionais**.
3. Clique em **Adicionar um recurso**.
4. Procure por **Cliente OpenSSH** e instale.

Depois disso, feche e abra de novo o PowerShell e teste de novo o `ssh -V`.

---

## Passo 3: Conectar no VPS (entrar no servidor)

1. No PowerShell, digite (tudo junto, com espaço entre `root` e `@`):

```powershell
ssh root@76.13.236.240
```

2. Pressione **Enter**.

3. Na primeira vez vai aparecer uma pergunta assim:

```
Are you sure you want to continue connecting (yes/no)?
```

4. Digite **yes** e pressione **Enter**.

5. Depois vai pedir a senha:

```
root@76.13.236.240's password:
```

6. **Digite a senha do root** (a que a Hostinger te passou).  
   **Importante:** quando você digita a senha, **nada aparece na tela** (nem asteriscos). É normal. Digite com cuidado e pressione **Enter**.

7. Se a senha estiver certa, vai aparecer algo como:

```
Welcome to Ubuntu...
root@srv1346098:~#
```

O **`root@srv1346098:~#`** significa que você está **dentro** do servidor. A partir daqui, todo comando que você digitar será executado no VPS, não no seu PC.

---

## Resumo rápido dos comandos

| O que fazer              | Comando                    |
|--------------------------|----------------------------|
| Abrir terminal           | Windows → digitar "PowerShell" ou "Terminal" |
| Conectar no VPS          | `ssh root@76.13.236.240`   |
| Responder “confiar?”     | `yes`                      |
| Senha                    | Digitar a senha do root (não aparece) e Enter |
| Sair do servidor         | `exit` ou Ctrl+D           |

---

## Onde achar a senha do VPS (Hostinger)

1. Acesse: **https://hpanel.hostinger.com**
2. Faça login na sua conta.
3. Vá em **VPS** (menu lateral).
4. Clique no seu VPS (por exemplo **srv1346098** ou no IP **76.13.236.240**).
5. Procure por **“Senha”**, **“Password”**, **“Credenciais”** ou **“Acesso root”**.  
   A Hostinger costuma mostrar ou permitir **“Redefinir senha root”** nessa tela.
6. Se não achar, verifique o **e-mail** que você usou na compra do VPS; a senha costuma ser enviada no primeiro e-mail de confirmação.

Se ainda não achar, use o suporte da Hostinger (chat ou ticket) e peça: “Preciso da senha root do meu VPS para acesso SSH.”

---

## Dicas importantes

- **Não compartilhe** a senha do root com ninguém.
- Para **sair** do servidor e voltar ao seu PC, digite: `exit` e Enter.
- Tudo que você digitar **depois** de conectado (quando aparecer `root@srv...`) roda **no servidor**, então tenha cuidado com comandos que apagam ou alteram coisas.

---

## Próximo passo (depois que conseguir entrar)

Quando você conseguir conectar e ver o `root@srv1346098:~#`, você estará pronto para instalar o Supabase. Aí você pode pedir o passo a passo dos comandos para instalar o Supabase dentro do servidor, ou podemos fazer isso em outra conversa.
