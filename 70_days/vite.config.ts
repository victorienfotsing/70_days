import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["favicon.png", "logo/196.png", "logo/512.png"],
      manifest: {
        name: "70 days",
        short_name: "70 days",
        description: "Workdays count",
        theme_color: "#ffffff",
        icons: [
          {
            src: "logo/196.png",
            sizes: "196x196",
            type: "image/png",
          },
          {
            src: "logo/512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
    vue(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
