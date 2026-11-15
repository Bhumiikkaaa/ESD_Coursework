import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// npm run dev serves the app on http://localhost:5173. Files in public/ are served
// as they are: public/matrix.json is at http://localhost:5173/matrix.json.
//
// Tests:  npm test             → test/**/*.test.{js,jsx}, except test/stretch/
//         npm run test:stretch → test/stretch/ only
//         npm run inlab        → inlab/ only (the in-lab task)
//         npm run test:all     → all of the above
export default defineConfig(({ mode }) => {
  const core = ["test/**/*.test.{js,jsx}"];
  const stretch = ["test/stretch/**/*.test.{js,jsx}"];
  const inlab = ["inlab/**/*.check.{js,jsx}"];
  const include = { stretch, inlab, all: [...core, ...inlab] }[mode] ?? core;
  return {
    plugins: [react()],
    server: { port: 5173, strictPort: true },
    test: {
      environment: "jsdom",
      setupFiles: ["./test/setup.js"],
      include,
      exclude: mode === "stretch" || mode === "all" ? [] : stretch,
      restoreMocks: true,
    },
  };
});
