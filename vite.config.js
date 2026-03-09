import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Basic Vite + React config (service worker handled manually via public/service-worker.js)
export default defineConfig({
  plugins: [react()],
});
