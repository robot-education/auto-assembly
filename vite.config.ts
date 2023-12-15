import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "./dist",
        emptyOutDir: true,
        copyPublicDir: true,
    },
    server: {
        strictPort: true,
        hmr: {
            host: "localhost",
            protocol: "ws",
            port: 24678,
        },
    },
});
