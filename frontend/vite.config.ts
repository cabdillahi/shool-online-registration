import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Prefer TypeScript sources over stale compiled .js siblings
    extensions: [".mjs", ".mts", ".ts", ".tsx", ".jsx", ".js", ".json"],
  },
});
