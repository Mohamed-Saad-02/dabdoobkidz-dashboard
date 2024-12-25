import { defineConfig, loadEnv, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  const PORT = `${env.VITE_PORT ?? '5170'}`;

  return {
    plugins: [react()],
    server: {
      port: +PORT
    }
  }
})
