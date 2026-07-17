import { afterAll, afterEach, beforeAll } from "vite-plus/test";

import { server } from "./node";

/**
 * Import this from a test file (`import "#/mocks/setup"`) to run the suite with
 * MSW active: unmatched requests error (so tests can't hit the real network),
 * and handlers reset between tests.
 */
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
