import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// Modified vite.config.js for GitHub Pages
export default defineConfig({
  base: '/employee-managment', // Must match repo name
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html') // Single entry point
    }
  }
})
