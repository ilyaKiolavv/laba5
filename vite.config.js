import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        watch: {
            // Не следим за служебной папкой Visual Studio — она блокирует файлы
            ignored: ['**/.vs/**'],
        },
    },
})