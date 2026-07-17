import { setupServer } from "msw/node";

import { handlers } from "./handlers";

/** The MSW server for Node (tests). Start it via `./setup` in a test file. */
export const server = setupServer(...handlers);
