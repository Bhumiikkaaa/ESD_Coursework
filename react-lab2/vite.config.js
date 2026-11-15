import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { mockApi } from "./mock/vite-plugin.js";

// npm run dev serves the app AND the mock course API (/api) on http://localhost:5173.
// To use your own backend instead, put VITE_API_URL=http://localhost:8080 in .env.local.
//
// Tests:  npm test            → test/**/*.test.{js,jsx}, except test/stretch/
//         npm run test:stretch → test/stretch/ only
//         npm run test:all     → both
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const core = ["test/**/*.test.{js,jsx}"];
  const stretch = ["test/stretch/**/*.test.{js,jsx}"];
  return {
    plugins: [react(), env.VITE_API_URL ? null : mockApi()],
    server: { port: 5173, strictPort: true },
    test: {
      environment: "jsdom",
      setupFiles: ["./test/setup.js"],
      include: mode === "stretch" ? stretch : core,
      exclude: mode === "stretch" || mode === "all" ? [] : stretch,
      restoreMocks: true,
    },
  };
});
