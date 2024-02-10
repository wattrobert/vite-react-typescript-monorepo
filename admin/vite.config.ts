import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { name, version } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  // optimizeDeps: {
  //   include: ["@wattrobert/core-ui"]
  // },
  server: {
    port: 3001,
    open: true
  },
  define: {
    pkgJson: { name, version },
  },
  plugins: [react()]
})