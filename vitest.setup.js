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

// Mock the Account class and its methods
vi.mock("node-appwrite", () => {
  return {
    Client: vi.fn().mockImplementation(() => ({
      setEndpoint: vi.fn().mockReturnThis(),
      setProject: vi.fn().mockReturnThis(),
      setKey: vi.fn().mockReturnThis(),
    })),
    Account: vi.fn().mockImplementation(() => ({
      createEmailSession: vi.fn(() => Promise.resolve({})), // If used
      createEmailPasswordSession: vi.fn(() => Promise.resolve({})), // Add this line
      // Add other methods as needed
    })),
    // Add other exports as needed
  };
});

// Mock `next/headers` to avoid real cookie operations
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  })),
}));

// Set the environment variable for Appwrite endpoint
process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT = "http://localhost/v1"; // Use your test or mock endpoint

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
