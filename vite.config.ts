import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // 开发环境把 /api 代理到 OpenAI 兼容服务，避免浏览器 CORS。
  // 目标地址来自 DEV_PROXY_TARGET，或复用 VITE_OPENAI_API_ENDPOINT；
  // 两者都未配置时使用公开的示例地址（星火 MaaS），可自行替换。
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = (
    env.DEV_PROXY_TARGET ||
    env.VITE_OPENAI_API_ENDPOINT ||
    'https://maas-coding-api.cn-huabei-1.xf-yun.com/v2'
  ).replace(/\/+$/, '')

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    build: {
      rollupOptions: {
        input: {
          // 根路径：SEO 落地页（静态）；/app：React 应用
          main: resolve(__dirname, 'index.html'),
          app: resolve(__dirname, 'app/index.html'),
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          // /api/chat/completions → <target>/chat/completions
          // target 需自带版本前缀（如 /v1、/v2）
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
