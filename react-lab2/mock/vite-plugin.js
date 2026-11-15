// Serves the mock API at /api inside `npm run dev` (and `npm run preview`), on the same
// origin as the app — so the app calls fetch("/api/courses") with no CORS involved.
// vite.config.js leaves this plugin out when VITE_API_URL is set (your own backend).
import { createApi } from "./api.js";

// Options are passed to createApi, e.g. mockApi({ googleClientId }) — the OAuth lab's
// vite.config.js passes VITE_GOOGLE_CLIENT_ID from .env.local this way.
export function mockApi(options = {}) {
  const mount = (server) => {
    const api = createApi(options);
    server.middlewares.use((req, res, next) => (req.url === "/api" || req.url.startsWith("/api/") ? api(req, res) : next()));
  };
  return { name: "esd-mock-api", configureServer: mount, configurePreviewServer: mount };
}
