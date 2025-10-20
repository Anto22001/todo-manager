import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import path from "path";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({mode}) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');
  
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_BACKEND_API': JSON.stringify(env.VITE_BACKEND_API),
    },
  }
})
