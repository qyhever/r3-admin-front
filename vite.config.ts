import { fileURLToPath, URL } from 'node:url'
import path from 'path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import checker from 'vite-plugin-checker'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'
import { metaPlugin } from './build/meta'

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isServe = command === 'serve'
  console.log('env.VITE_APP_MODE_ENV: ', env.VITE_APP_MODE_ENV)
  console.log('isServe: ', isServe)
  return {
    base: '/r3-admin/',
    server: {
      // host: '0.0.0.0',
      proxy: {
        '/r3/api': {
          target: 'http://localhost:9506',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/r3\/api/, ''),
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      tailwindcss(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
      metaPlugin(),
      checker({
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx,vue}"',
          dev: {
            logLevel: ['error'],
          },
          useFlatConfig: true,
        },
        typescript: true,
        overlay: false,
      }),
      viteMockServe({
        mockPath: 'mock',
        enable: isServe,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'js/[name]-[hash].js',
          chunkFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const extType = assetInfo.name?.split('.').pop()?.toLowerCase()
            // Group CSS files in css directory
            if (extType === 'css') {
              return 'css/[name]-[hash].[ext]'
            }
            // Keep other assets in assets directory
            return 'assets/[name]-[hash].[ext]'
          },
        },
      },
    },
  }
})
