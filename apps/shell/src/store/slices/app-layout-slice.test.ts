import { describe, expect, it } from "vitest";
import { appLayoutReducer, toggleDock } from "./app-layout-slice";

describe("appLayoutReducer", () => {
  it("starts with a visible dock", () => {
    const state = appLayoutReducer(undefined, { type: "unknown" });

    expect(state.dockCollapsed).toBe(false);
  });

  it("toggles the dock collapsed state", () => {
    const collapsed = appLayoutReducer(undefined, toggleDock());
    const expanded = appLayoutReducer(collapsed, toggleDock());

    expect(collapsed.dockCollapsed).toBe(true);
    expect(expanded.dockCollapsed).toBe(false);
  });
});
