import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 纯静态部署：base 用相对路径，便于从任意子路径打开
export default defineConfig({
  plugins: [vue()],
  base: './',
})
