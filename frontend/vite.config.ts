import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (id.includes('@chakra-ui') || id.includes('@emotion')) {
            return 'ui';
          }

          if (id.includes('framer-motion') || id.includes('react-spring') || id.includes('@use-gesture')) {
            return 'motion';
          }

          if (id.includes('react') || id.includes('scheduler')) {
            return 'react';
          }

          return 'vendor';
        },
      },
    },
  },
});
