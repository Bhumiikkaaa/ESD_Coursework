// The mock API on its own, like a real backend:  node mock/server.js   → http://localhost:8080
// Sends the CORS headers the contract requires for http://localhost:5173.
// Useful to run the conformance suite against the mock, or to try VITE_API_URL before
// your own backend is ready.
import { createServer } from "node:http";
import { createApi } from "./api.js";

const port = Number(process.env.PORT) || 8080;
const ORIGIN = "http://localhost:5173";
const api = createApi();

createServer((req, res) => {
  if (req.headers.origin === ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", ORIGIN);
    res.setHeader("Vary", "Origin");
  }
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.setHeader("Access-Control-Max-Age", "3600");
    res.statusCode = 204;
    return res.end();
  }
  const url = req.url || "/";
  if (url === "/api" || url.startsWith("/api/")) return api(req, res);
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain");
  res.end("Mock course API — try /api/courses\n");
}).listen(port, () => console.log(`Mock course API on http://localhost:${port}/api/courses`));
