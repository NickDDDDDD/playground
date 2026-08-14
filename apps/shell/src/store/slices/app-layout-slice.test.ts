import { describe, expect, it } from "vitest";
import {
  appLayoutReducer,
  closeWindow,
  minimizeWindow,
  restoreWindow,
  toggleWindowMaximized
} from "./app-layout-slice";

describe("appLayoutReducer", () => {
  it("starts with a normal visible window", () => {
    const state = appLayoutReducer(undefined, { type: "unknown" });

    expect(state.windowMaximized).toBe(false);
    expect(state.windowMinimized).toBe(false);
  });

  it("minimizes and restores the window", () => {
    const minimized = appLayoutReducer(undefined, minimizeWindow());
    const restored = appLayoutReducer(minimized, restoreWindow());

    expect(minimized.windowMinimized).toBe(true);
    expect(restored.windowMinimized).toBe(false);
  });

  it("toggles maximized state and clears minimized state", () => {
    const minimized = appLayoutReducer(undefined, minimizeWindow());
    const maximized = appLayoutReducer(minimized, toggleWindowMaximized());
    const restored = appLayoutReducer(maximized, toggleWindowMaximized());

    expect(maximized.windowMaximized).toBe(true);
    expect(maximized.windowMinimized).toBe(false);
    expect(restored.windowMaximized).toBe(false);
  });

  it("closes the window back to a normal state", () => {
    const maximized = appLayoutReducer(undefined, toggleWindowMaximized());
    const closed = appLayoutReducer(maximized, closeWindow());

    expect(closed.windowMaximized).toBe(false);
    expect(closed.windowMinimized).toBe(false);
  });
});
