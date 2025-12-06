# Configuração de Variáveis de Ambiente

## Desenvolvimento Local

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure as variáveis no arquivo `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:8080
   ```

## Deploy no Vercel

### Configuração via Dashboard

1. Acesse o dashboard do Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione a variável:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://sua-api-producao.com`
   - **Environments**: Production, Preview (conforme necessário)

### Configuração via CLI

```bash
vercel env add VITE_API_BASE_URL
# Digite o valor quando solicitado
```

### Build

O script `set-env.js` será executado automaticamente antes do build e irá:
- Ler a variável `VITE_API_BASE_URL` das environment variables
- Gerar o arquivo `environment.prod.ts` com o valor correto
- Executar o build do Angular

## Scripts Disponíveis

- `npm start` - Desenvolvimento local
- `npm run build` - Build com environment variables
- `npm run build:prod` - Build de produção (usado pelo Vercel)
