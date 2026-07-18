import { describe, expect, it } from "vite-plus/test";

import { initSentry, shouldEnableSentry } from "./sentry";

describe("shouldEnableSentry", () => {
  it("is disabled without a DSN", () => {
    expect(shouldEnableSentry(undefined)).toBe(false);
    expect(shouldEnableSentry("")).toBe(false);
    expect(shouldEnableSentry("   ")).toBe(false);
  });

  it("is enabled with a non-empty DSN", () => {
    expect(shouldEnableSentry("https://key@sentry.example/1")).toBe(true);
  });
});

describe("initSentry", () => {
  it("is a no-op (returns false) when no DSN is set", () => {
    expect(initSentry(undefined)).toBe(false);
  });
});
