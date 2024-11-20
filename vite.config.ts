import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import UnoCSS from 'unocss/vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    plugins: [
      react(),
      UnoCSS({
        presets: [
          presetUno() as any,
          presetAttributify() as any,
          presetIcons({
            scale: 1.2,
            cdn: 'https://esm.sh/'
          }) as any,
        ],
      }) as any,
      electron([
        {
          entry: 'electron/main.ts',
          onstart(options) {
            options.startup()
          },
          vite: {
            build: {
              outDir: 'dist-electron',
              rollupOptions: {
                external: ['electron'],
                output: {
                  format: 'cjs',
                },
              },
            },
          },
        },
        {
          entry: 'electron/preload.ts',
          onstart(options) {
            options.reload()
          },
          vite: {
            build: {
              outDir: 'dist-electron',
              rollupOptions: {
                external: ['electron'],
                output: {
                  format: 'cjs',
                },
              },
            },
          },
        },
      ]) as any,
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      rollupOptions: {
        external: ['electron'],
      },
    },
    publicDir: 'public',
  }
})
