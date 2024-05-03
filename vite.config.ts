import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// import mkcert from "vite-plugin-mkcert";

// Note: Add mkcert() to the plugins array to enable HTTPS
// This was originally added to test the navigator.share API
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
