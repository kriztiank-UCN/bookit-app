import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
// Extends matchers like `toBeInTheDocument`
import "@testing-library/jest-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import { vi } from "vitest";

// Mock `useRouter` from Next.js
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(), // Mock `router.push`
    replace: vi.fn(), // Mock `router.replace`
    back: vi.fn(), // Mock `router.back`
    prefetch: vi.fn(), // Mock `router.prefetch`
    query: {}, // Mock query parameters
  })),
}));

// Mock `checkAuth` to avoid real network requests
vi.mock("@/app/actions/checkAuth", () => ({
  default: vi.fn(() =>
    Promise.resolve({
      isAuthenticated: false,
      user: null,
    })
  ),
}));

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
