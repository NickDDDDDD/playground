import { describe, expect, it } from "vitest";
import {
  appLayoutReducer,
  closeWindow,
  minimizeWindow,
  openWindow,
  sleepPlayground,
  toggleWindowMaximized,
  wakePlayground
} from "./app-layout-slice";

describe("appLayoutReducer", () => {
  it("starts with no running experiment and a normal window size", () => {
    const state = appLayoutReducer(undefined, { type: "unknown" });

    expect(state.runningExperimentId).toBeNull();
    expect(state.sleeping).toBe(false);
    expect(state.windowMaximized).toBe(false);
  });

  it("keeps the experiment running when minimized", () => {
    const minimized = appLayoutReducer(undefined, minimizeWindow("welcome"));
    const restored = appLayoutReducer(minimized, openWindow("welcome"));

    expect(minimized.runningExperimentId).toBe("welcome");
    expect(minimized.windowMaximized).toBe(false);
    expect(restored.runningExperimentId).toBe("welcome");
  });

  it("toggles maximized state", () => {
    const running = appLayoutReducer(undefined, openWindow("welcome"));
    const maximized = appLayoutReducer(running, toggleWindowMaximized());
    const restored = appLayoutReducer(maximized, toggleWindowMaximized());

    expect(maximized.windowMaximized).toBe(true);
    expect(maximized.runningExperimentId).toBe("welcome");
    expect(restored.windowMaximized).toBe(false);
  });

  it("closes the window and stops the running indicator", () => {
    const running = appLayoutReducer(undefined, openWindow("welcome"));
    const maximized = appLayoutReducer(running, toggleWindowMaximized());
    const closed = appLayoutReducer(maximized, closeWindow());

    expect(closed.runningExperimentId).toBeNull();
    expect(closed.windowMaximized).toBe(false);
  });

  it("enters and leaves focus sleep without closing a running experiment", () => {
    const running = appLayoutReducer(undefined, openWindow("welcome"));
    const maximized = appLayoutReducer(running, toggleWindowMaximized());
    const sleeping = appLayoutReducer(maximized, sleepPlayground());
    const awake = appLayoutReducer(sleeping, wakePlayground());

    expect(sleeping.runningExperimentId).toBe("welcome");
    expect(sleeping.sleeping).toBe(true);
    expect(sleeping.windowMaximized).toBe(false);
    expect(awake.sleeping).toBe(false);
    expect(awake.runningExperimentId).toBe("welcome");
  });
});
