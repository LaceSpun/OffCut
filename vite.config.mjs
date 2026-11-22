import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  base: './',
  plugins: [react(), VitePWA({
    registerType: 'prompt', injectRegister: null, includeAssets: ['assets/*.png'],
    manifest: {
      id: './', name: 'Offcut', short_name: 'Offcut', description: 'Your layers, materials and ideas. A free offline creative editor.',
      start_url: './', scope: './', display: 'standalone', orientation: 'any', background_color: '#f8f7f5', theme_color: '#f8f7f5',
      icons: [{src:'assets/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:'assets/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any'}]
    },
    workbox: {globPatterns:['**/*.{js,css,html,png,woff2}'], maximumFileSizeToCacheInBytes: 12000000, navigateFallback: 'index.html', cleanupOutdatedCaches: true}
  })],
});
