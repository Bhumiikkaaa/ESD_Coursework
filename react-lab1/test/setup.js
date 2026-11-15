// Runs before every test file: adds matchers like toBeInTheDocument(), and unmounts
// whatever a test rendered so tests can't see each other's screens.
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// No test talks to a real server. From section 11 on, App loads /matrix.json; until a
// test says otherwise, fetch is a fake that never answers — so App keeps its starting
// numbers, exactly as it does in the browser while the request is still on its way.
beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
