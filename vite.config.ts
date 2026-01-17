import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// vite.config.ts
export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0', // Ascolta su tutte le interfacce di rete
        port: 5173,
        strictPort: true // Impedisce a Vite di cambiare porta se la 5173 è occupata
    }
})