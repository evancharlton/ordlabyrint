import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      base: "/",
      manifest: {
        name: "Ordlabyrint",
        short_name: "Ordlabyrint",
        theme_color: "#8804f4",
        icons: [
          {
            src: "/logo-64.png",
            sizes: "64x64 32x32",
            type: "image/png",
          },
          {
            src: "/logo-192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "/logo-512.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
        start_url: ".",
      },

      devOptions: { enabled: true, navigateFallback: "index.html" },
      workbox: {
        cacheId: "ordlabyrint",
        runtimeCaching: [
          {
            urlPattern: /(?:\.json|\bletters)$/,
            handler: "NetworkFirst",
          },
        ],
      },
    }),
  ],
});
