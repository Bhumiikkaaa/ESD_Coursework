// Minimal HS256 JWTs for the mock API, using only node:crypto.
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const b64url = (data) => Buffer.from(data).toString("base64url");
export const randomSecret = () => randomBytes(32).toString("hex");

export function signJwt(claims, secret) {
  const head = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(claims));
  const sig = createHmac("sha256", secret).update(`${head}.${body}`).digest("base64url");
  return `${head}.${body}.${sig}`;
}

// The claims if the token is well-formed, correctly signed and unexpired; otherwise null.
export function verifyJwt(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [head, body, sig] = parts;
  try {
    if (JSON.parse(Buffer.from(head, "base64url")).alg !== "HS256") return null;
    const expected = createHmac("sha256", secret).update(`${head}.${body}`).digest();
    const given = Buffer.from(sig, "base64url");
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
    const claims = JSON.parse(Buffer.from(body, "base64url"));
    if (typeof claims.exp !== "number" || claims.exp <= Math.floor(Date.now() / 1000)) return null;
    return claims;
  } catch {
    return null;
  }
}
