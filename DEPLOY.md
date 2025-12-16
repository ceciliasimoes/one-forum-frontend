# 🚀 Deploy no Vercel - Guia Completo

## Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Repositório Git (GitHub, GitLab ou Bitbucket)
- Backend API rodando e acessível publicamente

---

## 📋 Passo a Passo

### 1. **Preparar o Repositório**

Certifique-se de que todos os arquivos estão commitados:
```bash
git add .
git commit -m "chore: preparar projeto para deploy na Vercel"
git push origin develop
```

### 2. **Importar Projeto na Vercel**

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New..."** → **"Project"**
3. Selecione seu repositório Git
4. Clique em **"Import"**

### 3. **Configurar Variáveis de Ambiente**

Na página de configuração do projeto, adicione as seguintes variáveis:

**Environment Variables:**
```
API_BASE_URL=https://sua-api-backend.com
```

**Configuração:**
- **Name:** `API_BASE_URL`
- **Value:** URL do seu backend (ex: `https://api.oneforum.com`)
- **Environment:** Production, Preview, Development (marcar todas)

> ⚠️ **IMPORTANTE:** A URL deve ser a URL pública do seu backend, não `localhost`

### 4. **Configurações de Build (já configuradas no vercel.json)**

As seguintes configurações já estão no arquivo `vercel.json`:
```json
{
  "buildCommand": "npm run build:prod",
  "outputDirectory": "dist/one-forum-frontend/browser",
  "framework": "angular",
  "installCommand": "npm install"
}
```

### 5. **Deploy**

Clique em **"Deploy"** e aguarde o build finalizar (2-5 minutos).

---

## 🔄 Deploy Automático

Após o primeiro deploy, cada push para a branch principal (`develop` ou `main`) vai disparar um novo deploy automaticamente.

**Preview Deploys:**
- Pull Requests geram deploys de preview
- Cada branch pode ter seu próprio preview

---

## 🌐 Configurar Domínio Customizado (Opcional)

1. No dashboard do projeto, vá em **"Settings"** → **"Domains"**
2. Clique em **"Add"**
3. Digite seu domínio (ex: `forum.seusite.com`)
4. Siga as instruções para configurar DNS

---

## 🔧 Troubleshooting

### ❌ Erro: "API_BASE_URL is not defined"
**Solução:** Verifique se a variável de ambiente foi adicionada corretamente no Vercel.

### ❌ Erro: "Build failed"
**Solução:** 
1. Verifique os logs de build no dashboard da Vercel
2. Teste o build localmente: `npm run build:prod`

### ❌ CORS Error ao chamar API
**Solução:** Configure CORS no backend para aceitar requisições do domínio Vercel:
```java
// Exemplo Spring Boot
@CrossOrigin(origins = "https://seu-app.vercel.app")
```

### ❌ Páginas retornam 404 ao recarregar
**Solução:** Adicionar configuração de rewrites no `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📊 Monitoramento

Após o deploy:
- **Analytics:** Dashboard → Analytics
- **Logs:** Dashboard → Deployments → [sua deployment] → View Function Logs
- **Performance:** Dashboard → Speed Insights

---

## 🔒 Segurança

### Environment Variables
- ✅ Nunca commite arquivos `.env` no Git
- ✅ Use variáveis de ambiente da Vercel
- ✅ Rotacione secrets regularmente

### Headers de Segurança
Adicione no `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 📱 Deploy de Branches Específicas

Para deployar apenas branches específicas:
1. Dashboard → **Settings** → **Git**
2. Em **"Production Branch"**, defina sua branch principal
3. Em **"Deploy Hooks"**, configure webhooks personalizados

---

## 🎯 Checklist de Deploy

- [ ] Backend rodando e acessível publicamente
- [ ] Variável `API_BASE_URL` configurada na Vercel
- [ ] CORS configurado no backend
- [ ] Código commitado e enviado ao Git
- [ ] Build local funciona (`npm run build:prod`)
- [ ] Projeto importado na Vercel
- [ ] Deploy finalizado com sucesso
- [ ] Aplicação acessível e funcional
- [ ] Chamadas à API funcionando

---

## 📚 Recursos Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Angular on Vercel](https://vercel.com/docs/frameworks/angular)

---

**URL do seu projeto após deploy:**
`https://nome-do-projeto.vercel.app`

**Dashboard da Vercel:**
`https://vercel.com/dashboard`
