import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true, // Allow external connections
    port: 5173,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "*.ngrok-free.app",
      "*.ngrok.io",
      "*.localhost",
      "c333-58-8-215-222.ngrok-free.app"
    ],
    cors: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
