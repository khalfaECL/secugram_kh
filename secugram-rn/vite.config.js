import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': path.resolve(__dirname, 'node_modules/react-native-web'),
    },
    extensions: ['.web.js', '.js', '.web.ts', '.ts', '.web.tsx', '.tsx'],
  },
  optimizeDeps: {
    include: ['react-native-web'],
    esbuildOptions: {
      jsx: 'automatic',
      resolveExtensions: ['.web.js', '.js'],
    },
  },
});
