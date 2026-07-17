import { http, HttpResponse } from "msw";

/**
 * MSW request handlers — mock HTTP at the network boundary for tests (and,
 * optionally, dev). Add handlers here and they apply everywhere the mock server
 * is started. This example handler is safe to delete once you have real ones.
 */
export const handlers = [
  http.get("https://api.example.com/ping", () => HttpResponse.json({ message: "pong" })),
];
