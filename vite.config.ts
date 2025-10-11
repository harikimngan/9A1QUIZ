/// <reference types="node" />
/// <reference types="vite/client" />
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
// FIX: Import to define __dirname in ES module scope.
import { fileURLToPath } from 'url';

// FIX: Define __dirname for ES module scope to avoid type errors with process.cwd().
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // When deploying to GitHub Pages under a repo (e.g. https://harikimngan.github.io/9A1QUIZ/)
      // set base to the repo name. If you deploy to a custom domain or root, change accordingly.
      base: '/9A1QUIZ/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // FIX: Use ES module-compatible __dirname for path aliasing.
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Ensure all top-level HTML pages are built (multi-page app)
      build: {
        rollupOptions: {
          input: {
            index: path.resolve(__dirname, 'index.html'),
            activities: path.resolve(__dirname, 'activities.html'),
            flashcard: path.resolve(__dirname, 'flashcard.html'),
            about: path.resolve(__dirname, 'about.html'),
            help: path.resolve(__dirname, 'help.html'),
          }
        }
      },
      publicDir: path.resolve(__dirname, '.')
    };
});
