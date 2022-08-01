import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import glsl from 'vite-plugin-glsl';

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    glsl(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
});