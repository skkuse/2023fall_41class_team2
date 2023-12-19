import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import removeConsole from 'vite-plugin-remove-console';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), removeConsole()],
  envDir: './config',
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
});
