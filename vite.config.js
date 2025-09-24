import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      fastRefresh: false, // ✅ matikan HMR khusus React
    }),
  ],
});
