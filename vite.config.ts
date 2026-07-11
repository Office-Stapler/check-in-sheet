import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

// https://vite.dev/config/
export default defineConfig({
  base: 'https://office-stapler.github.io/check-in-sheet/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
});
