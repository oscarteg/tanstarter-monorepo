import { describe, expect, it } from "vite-plus/test";

import { initPostHog, shouldEnablePostHog } from "./posthog";

describe("shouldEnablePostHog", () => {
  it("is disabled without a key", () => {
    expect(shouldEnablePostHog(undefined)).toBe(false);
    expect(shouldEnablePostHog("")).toBe(false);
    expect(shouldEnablePostHog("   ")).toBe(false);
  });

  it("is enabled with a non-empty key", () => {
    expect(shouldEnablePostHog("phc_example")).toBe(true);
  });
});

describe("initPostHog", () => {
  it("is a no-op (returns false) when no key is set", () => {
    expect(initPostHog(undefined)).toBe(false);
  });
});
