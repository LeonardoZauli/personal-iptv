import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// vite.config.ts
export default defineConfig({
    plugins: [react()],
    base: '/personal-iptv/',
    server: {
        host: '0.0.0.0', // Ascolta su tutte le interfacce di rete
        port: 5173,
        strictPort: true, // Impedisce a Vite di cambiare porta se la 5173 è occupata
        proxy: {
            // /tv8proxy → mytivu.it → 302 verso URL Akamai firmata fresca
            // HLS.js segue il redirect automaticamente, nessun loader custom
            '/tv8proxy': {
                target: 'https://www.mytivu.it',
                changeOrigin: true,
                rewrite: () => '/Application/Channels/TV8.php',
                secure: true,
            },
        },
    }
})