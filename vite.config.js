import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import { fileURLToPath, URL } from 'node:url';

const modulo = 'roulette';
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar({ sassVariables: '@/assets/styles/quasar-variables.scss' }),
  ],
  define: {
    'process.env': {
      BASE_URL: modulo,
      API: '/api/v1/',
      PORT_DEV: 5132,
      PORT: 5133,
    },
  },
  build: {
    outDir: 'dist',
    manifest: false,
    rollupOptions: {
      treeshake: true,
      output: {},
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'pinia-plugin-persistedstate': '/node_modules/pinia-plugin-persistedstate/dist/index.js',
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue', '.webp'],
  },
  server: { port: 8080, open: false },
  base: `/${modulo}`,
});
