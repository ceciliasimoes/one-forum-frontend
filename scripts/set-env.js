const fs = require('fs');
const path = require('path');

// Verifica se está rodando no Vercel
const isVercel = process.env.VERCEL === '1';

// Define o ambiente
const environment = process.env.NODE_ENV === 'production' || isVercel ? 'prod' : 'development';

// Pega a API URL do ambiente
const apiBaseUrl = process.env.API_BASE_URL || process.env.VITE_API_BASE_URL || 'http://localhost:8080';

console.log(`🔧 Configurando ambiente: ${environment}`);
console.log(`🌐 API Base URL: ${apiBaseUrl}`);

// Cria o conteúdo do arquivo environment.ts
const envConfigFile = `export const environment = {
  production: ${environment === 'prod'},
  apiBaseUrl: '${apiBaseUrl}'
};
`;

// Caminhos dos arquivos
const targetPath = path.resolve(__dirname, '../src/environments/environment.ts');
const targetPathProd = path.resolve(__dirname, '../src/environments/environment.prod.ts');

// Escreve o arquivo
try {
  fs.writeFileSync(targetPath, envConfigFile);
  fs.writeFileSync(targetPathProd, envConfigFile);
  console.log('✅ Arquivo environment.ts criado com sucesso!');
} catch (error) {
  console.error('❌ Erro ao criar arquivo environment.ts:', error);
  process.exit(1);
}
