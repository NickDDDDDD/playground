import { describe, expect, it } from "vitest";
import { appLayoutReducer, toggleSidebar } from "./app-layout-slice";

describe("appLayoutReducer", () => {
  it("starts with an expanded sidebar", () => {
    const state = appLayoutReducer(undefined, { type: "unknown" });

    expect(state.sidebarCollapsed).toBe(false);
  });

  it("toggles the sidebar collapsed state", () => {
    const collapsed = appLayoutReducer(undefined, toggleSidebar());
    const expanded = appLayoutReducer(collapsed, toggleSidebar());

    expect(collapsed.sidebarCollapsed).toBe(true);
    expect(expanded.sidebarCollapsed).toBe(false);
  });
});
