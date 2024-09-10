import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: "https://aleo1.to/api",
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
