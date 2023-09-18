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
      // /api/getData → http://localhost:8000/getData로 변경
      '/api': {
        target: 'http://localhost:8000', // fetch 요청에 대한 target 경로 설정
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // /api에 해당하는 경로를 삭제
      },
    },
  },
});
