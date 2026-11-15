// Runs before every test file: adds matchers like toBeInTheDocument(), and after each test
// unmounts whatever it rendered and puts back anything it stubbed (like fetch), so tests
// can't see each other's screens or servers.
import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
