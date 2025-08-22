import path from 'path'
import type { PluginOption } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { viteStaticCopy } from 'vite-plugin-static-copy'

function setupPlugins(env: ImportMetaEnv): PluginOption[] {
  return [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, './src/static/mitf') + '/[!.]*', // 1️⃣
          dest: './mitf/', // 2️⃣
        },
      ],
    }),
    VitePWA({ // env.VITE_GLOB_APP_PWA === 'true' &&
      injectRegister: 'auto',
      manifest: {
        name: 'chatGPT-MJ',
        short_name: 'chatGPT-MJ',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ]
}

export default defineConfig((env) => {
  const viteEnv = loadEnv(env.mode, process.cwd()) as unknown as ImportMetaEnv

  return {
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    plugins: setupPlugins(viteEnv),
    server: {
      host: '0.0.0.0',
      port: 8090,
      open: false,
      // 移除后端代理配置，改为直接调用第三方API
      // proxy配置已移除，现在使用直接API调用
    },
    build: {
      reportCompressedSize: false,
      sourcemap: false,
      commonjsOptions: {
        ignoreTryCatch: false,
      },
    },
  }
})
