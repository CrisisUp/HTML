import { defineConfig } from 'vite';

export default defineConfig({
  base: '/', // Caminho base para build (ajuste se hospedar em subdiretório)
  server: {
    port: 3000, // Porta do servidor de desenvolvimento
  },
  build: {
    outDir: 'dist', // Pasta de saída do build
    assetsDir: 'assets', // Pasta para assets no build
  },
});