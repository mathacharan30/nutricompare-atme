import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/analyze": {
        target: "https://juice-nutrition-comparator.onrender.com",
        changeOrigin: true,
        secure: true,
        ws: true,
      },
    },
  },
});
