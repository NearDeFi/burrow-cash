import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        app: "./index.html",
      },
    },
    outDir: "public",
  },
  define: {
    "process.env": {},
  },
});
