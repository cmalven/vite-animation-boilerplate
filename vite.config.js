import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import glsl from 'vite-plugin-glsl';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    glsl({
      watch: false,
    }),
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
});