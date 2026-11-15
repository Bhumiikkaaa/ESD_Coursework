# mock/ — the mock course API

An in-memory implementation of the ESD course API contract (`openapi.yaml`, in the
`api-contract` lab folder). **Don't edit this folder** — it's identical in every React lab.

- `npm run dev` serves it at `/api` on the app's own origin (via `vite-plugin.js`).
- `npm run mock` runs it standalone on http://localhost:8080, with CORS, like a real backend.
- Every restart starts fresh from `seed.json`. Seeded logins:
  `student@esd.local` / `student12345`, `admin@esd.local` / `admin12345`.
- To use **your own** backend instead, create `.env.local` with
  `VITE_API_URL=http://localhost:8080` and restart `npm run dev`. Your backend must
  pass the conformance level the lab asks for.
- Mock-only extras: `?delay=800`, `?delay=random`, `?fail=1` on any request, or
  `MOCK_DELAY=random npm run dev` for everything.
