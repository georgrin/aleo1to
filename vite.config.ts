import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  // Load environment variables
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: process.env.VITE_API_URL || "https://api.aleo1.to/v1",
          changeOrigin: true,
          timeout: 1000,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    define: {
      appVersion: JSON.stringify(process.env.npm_package_version),
    },
  });
};
