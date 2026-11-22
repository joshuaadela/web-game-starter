import { defineConfig } from "vite";

export default defineConfig({
  server: { host: true, port: 5173 }, // host: true → test on your phone via your LAN IP
  build: {
    // Phaser alone is ~1.5 MB minified (~415 KB gzipped); that's expected.
    chunkSizeWarningLimit: 2000,
  },
});
