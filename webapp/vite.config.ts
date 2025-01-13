import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react()
  ],
  resolve: {
    alias: [
      { find: '@components', replacement: fileURLToPath(new URL('./src/components', import.meta.url))},
      { find: '@icons', replacement: fileURLToPath(new URL('./src/components/icons', import.meta.url))},
      { find: '@routes', replacement: fileURLToPath(new URL('./src/routes', import.meta.url))},
      { find: '@hooks', replacement: fileURLToPath(new URL('./src/hooks', import.meta.url ))},
      { find: '@utils', replacement: fileURLToPath(new URL('./src/utils', import.meta.url))},
      { find: '@src', replacement: fileURLToPath(new URL('./src', import.meta.url))},
    ]
  },
})
