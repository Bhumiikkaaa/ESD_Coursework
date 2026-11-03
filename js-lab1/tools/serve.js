// A tiny static file server, so the browser can load ES modules from this
// folder. No install needed:  npm run web   then open the printed URL.
// (Opening web/index.html by double-clicking does NOT work: browsers block
// module imports from file:// pages.)
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.cwd());
const port = Number(process.env.PORT) || 5500;
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = normalize(join(root, path.endsWith("/") ? path + "index.html" : path));
  if (!file.startsWith(root)) { res.writeHead(403).end("Forbidden"); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": (types[extname(file)] || "application/octet-stream") + "; charset=utf-8" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" }).end(`Not found: ${path}`);
  }
}).listen(port, () => {
  console.log(`Serving ${root}`);
  console.log(`Open  http://localhost:${port}/web/`);
});
