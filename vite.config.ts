import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 600 },
  resolve: {
    alias: {
      src: "/src",
      ui: "/src/ui",
      pages: "/src/ui/pages",
      types: "/src/types",
      apis: "/src/apis",
      models: "/src/models",
      i18n: "/src/i18n",
    },
  },
  // server: {
  //   port: 80,
  // },
});
