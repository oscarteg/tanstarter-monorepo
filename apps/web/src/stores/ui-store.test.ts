import { beforeEach, describe, expect, it } from "vite-plus/test";

import { useUiStore } from "./ui-store";

describe("useUiStore", () => {
  beforeEach(() => {
    useUiStore.setState({ commandOpen: false });
  });

  it("starts with the command palette closed", () => {
    expect(useUiStore.getState().commandOpen).toBe(false);
  });

  it("toggleCommand flips the open state", () => {
    useUiStore.getState().toggleCommand();
    expect(useUiStore.getState().commandOpen).toBe(true);

    useUiStore.getState().toggleCommand();
    expect(useUiStore.getState().commandOpen).toBe(false);
  });

  it("setCommandOpen sets the state explicitly", () => {
    useUiStore.getState().setCommandOpen(true);
    expect(useUiStore.getState().commandOpen).toBe(true);

    useUiStore.getState().setCommandOpen(false);
    expect(useUiStore.getState().commandOpen).toBe(false);
  });
});
