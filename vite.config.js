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
    server: {
        host: '0.0.0.0', // Позволяет подключаться через VPN и внешние сети
        port: 5173,
        strictPort: false,
        // Настройки для работы через VPN
        cors: true,
        // Настройки HMR для работы через VPN
        hmr: {
            protocol: 'ws',
            host: 'localhost', // Используем localhost для HMR, чтобы избежать проблем с VPN
            port: 5173,
        },
        // Отключаем проверку origin для работы через VPN
        watch: {
            usePolling: false, // Можно включить true, если есть проблемы с файловой системой через VPN
        },
    },
})
