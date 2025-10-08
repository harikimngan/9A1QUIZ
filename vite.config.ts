import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'url';

// Định nghĩa __dirname cho ES module scope
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    // ⚙️ QUAN TRỌNG: phần này giúp build ra thư mục dist và link tĩnh chạy đúng
    build: {
      outDir: 'dist', // nơi chứa file build (Vercel sẽ deploy thư mục này)
      emptyOutDir: true, // xoá dist cũ trước khi build lại
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          activities: path.resolve(__dirname, 'activities.html'),
          flashcard: path.resolve(__dirname, 'flashcard.html'),
          about: path.resolve(__dirname, 'about.html'),
        }
      }
    },
    base: '/', // Changed to absolute path for clean URLs and routing
  };
});