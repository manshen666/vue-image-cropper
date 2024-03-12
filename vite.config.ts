import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'vue'
        }
      }
    },
    lib: {
      entry: './src/index.ts',
      name: 'image-cropper',
      fileName: 'image-cropper',
      formats: ['es', 'umd']
    }
  },
  plugins: [vue()]
})
