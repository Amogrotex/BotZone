import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages uses /BotZone/; the Cloudflare workflow builds for root.
  base: process.env.VITE_BASE_PATH || "/BotZone/",
  plugins: [react()],
  build: {
    outDir: "docs",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        storefront: resolve(process.cwd(), "index.html"),
        admin: resolve(process.cwd(), "admin/index.html"),
      },
    },
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
