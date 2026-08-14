import { describe, expect, it } from "vitest";
import {
  createDockSpringState,
  dockMagnificationConfig,
  getDockMotionTarget,
  stepDockSpring
} from "./dock-magnification";

describe("dock magnification", () => {
  it("uses the macOS-web distance multiplier and golden-ratio size outputs", () => {
    const baseSize = 56;
    const distanceLimit = baseSize * dockMagnificationConfig.distanceLimitMultiplier;

    expect(getDockMotionTarget(null, baseSize).size).toBe(baseSize);
    expect(getDockMotionTarget(-distanceLimit, baseSize).size).toBe(baseSize);
    expect(getDockMotionTarget(-distanceLimit / 1.25, baseSize).size).toBeCloseTo(
      baseSize * 1.1
    );
    expect(getDockMotionTarget(-distanceLimit / 2, baseSize).size).toBeCloseTo(
      baseSize * 1.618
    );
    expect(getDockMotionTarget(0, baseSize).size).toBeCloseTo(baseSize * 2.618);
    expect(getDockMotionTarget(distanceLimit / 2, baseSize).size).toBeCloseTo(
      baseSize * 1.618
    );
    expect(getDockMotionTarget(distanceLimit / 1.25, baseSize).size).toBeCloseTo(
      baseSize * 1.1
    );
    expect(getDockMotionTarget(distanceLimit, baseSize).size).toBe(baseSize);
  });

  it("springs toward the current target instead of snapping instantly", () => {
    const baseSize = 56;
    const state = createDockSpringState(baseSize);
    const target = getDockMotionTarget(0, baseSize);
    const firstStep = stepDockSpring(state, target);
    const secondStep = stepDockSpring(firstStep, target);

    expect(firstStep.size).toBeGreaterThan(baseSize);
    expect(firstStep.size).toBeLessThan(target.size);
    expect(secondStep.size).toBeGreaterThan(firstStep.size);
  });
});
