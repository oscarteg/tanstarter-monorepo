import { describe, expect, it } from "vite-plus/test";

import "./setup";

describe("MSW example handler", () => {
  it("intercepts the mocked endpoint at the network boundary", async () => {
    const response = await fetch("https://api.example.com/ping");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "pong" });
  });
});
