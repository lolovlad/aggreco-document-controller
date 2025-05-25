import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', ".mjs", '.json', '.vue', '.jsx'],
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
})
