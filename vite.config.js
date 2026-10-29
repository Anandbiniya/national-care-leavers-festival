import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: {
      ignored: ['**/*.mp4'],
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, defaultWarn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        defaultWarn(warning);
      },
    },
  },
});
