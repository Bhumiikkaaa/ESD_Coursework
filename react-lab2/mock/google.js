// Verifying a Google ID token completely: RS256 signature against Google's published
// keys, expiry (and nbf), issuer, audience, and a verified email. The OAuth2 lab does the
// same in Spring Boot, so this makes the same decisions: 60 seconds of clock skew on exp
// and nbf (JwtTimestampValidator's default), and email_verified must be true.
import { createPublicKey, createVerify } from "node:crypto";

const CERTS = "https://www.googleapis.com/oauth2/v3/certs";
const ISSUERS = new Set(["accounts.google.com", "https://accounts.google.com"]);
const SKEW = 60; // seconds of clock difference allowed, as Spring's JwtTimestampValidator
let cache = { keys: null, until: 0 };

async function googleKeys() {
  if (cache.keys && Date.now() < cache.until) return cache.keys;
  const res = await fetch(CERTS);
  if (!res.ok) throw new Error(`Could not fetch Google keys: HTTP ${res.status}`);
  const { keys } = await res.json();
  const maxAge = Number(/max-age=(\d+)/.exec(res.headers.get("cache-control") || "")?.[1] || 3600);
  cache = { keys, until: Date.now() + maxAge * 1000 };
  return keys;
}

// The verified claims ({ email, name, sub, … }), or null if anything is wrong.
export async function verifyGoogleIdToken(idToken, clientId, { keys } = {}) {
  const parts = String(idToken).split(".");
  if (parts.length !== 3) return null;
  try {
    const header = JSON.parse(Buffer.from(parts[0], "base64url"));
    if (header.alg !== "RS256") return null;
    const jwk = (keys ?? (await googleKeys())).find((k) => k.kid === header.kid);
    if (!jwk) return null;
    const verifier = createVerify("RSA-SHA256");
    verifier.update(`${parts[0]}.${parts[1]}`);
    if (!verifier.verify(createPublicKey({ key: jwk, format: "jwk" }), Buffer.from(parts[2], "base64url"))) return null;
    const claims = JSON.parse(Buffer.from(parts[1], "base64url"));
    const now = Math.floor(Date.now() / 1000);
    if (!ISSUERS.has(claims.iss)) return null;
    if (claims.aud !== clientId) return null;
    if (typeof claims.exp !== "number" || claims.exp < now - SKEW) return null;
    if (claims.nbf !== undefined && (typeof claims.nbf !== "number" || claims.nbf > now + SKEW)) return null;
    if (!claims.email || !(claims.email_verified === true || claims.email_verified === "true")) return null;
    return claims;
  } catch {
    return null;
  }
}
