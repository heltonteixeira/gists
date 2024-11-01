import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        react({
            jsxRuntime: 'automatic',
            jsxImportSource: 'react',
            babel: {
                plugins: ['@babel/plugin-transform-react-jsx']
            }
        })
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    },
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        sourcemap: true
    }
});