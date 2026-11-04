import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, "");
  const apiPort = process.env.PORT ?? env.PORT ?? "3001";

  return {
    root: fileURLToPath(new URL(".", import.meta.url)),
    envDir: projectRoot,
    plugins: [react()],
    server: {
      host: "127.0.0.1",
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": `http://127.0.0.1:${apiPort}`,
      },
    },
    build: {
      outDir: "../dist/frontend",
      emptyOutDir: true,
    },
  };
});
