import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [plugin()],
    base: '/University-Self-Service-System/',  // YOUR REPO NAME HERE
    server: {
        port: 4153,
        host: 'localhost',
    }
})