import { describe, expect, it } from "vitest";
import {
  createDockSpringState,
  dockMagnificationConfig,
  getDockInteractionIntensity,
  getDockMotionTarget,
  stepDockSpring
} from "./dock-magnification";

describe("dock magnification", () => {
  it("keeps the macOS-web curve shape while tuning the amplitude for this dock", () => {
    const baseSize = 56;
    const distanceLimit = baseSize * dockMagnificationConfig.distanceLimitMultiplier;

    expect(getDockMotionTarget(null, baseSize).size).toBe(baseSize);
    expect(getDockMotionTarget(-distanceLimit, baseSize).size).toBe(baseSize);
    expect(getDockMotionTarget(-distanceLimit / 1.25, baseSize).size).toBeCloseTo(
      baseSize * (1 + 0.1 * dockMagnificationConfig.maxAmplification)
    );
    expect(getDockMotionTarget(-distanceLimit / 2, baseSize).size).toBeCloseTo(
      baseSize * (1 + 0.618 * dockMagnificationConfig.maxAmplification)
    );
    expect(getDockMotionTarget(0, baseSize).size).toBeCloseTo(
      baseSize * (1 + 1.618 * dockMagnificationConfig.maxAmplification)
    );
    expect(getDockMotionTarget(distanceLimit / 2, baseSize).size).toBeCloseTo(
      baseSize * (1 + 0.618 * dockMagnificationConfig.maxAmplification)
    );
    expect(getDockMotionTarget(distanceLimit / 1.25, baseSize).size).toBeCloseTo(
      baseSize * (1 + 0.1 * dockMagnificationConfig.maxAmplification)
    );
    expect(getDockMotionTarget(distanceLimit, baseSize).size).toBe(baseSize);
  });

  it("ramps motion strength by vertical proximity", () => {
    const baseSize = 56;
    const dockRect = {
      bottom: 800,
      top: 736
    };

    expect(getDockInteractionIntensity(680, dockRect, baseSize)).toBe(0);
    expect(getDockInteractionIntensity(708, dockRect, baseSize)).toBeGreaterThan(0);
    expect(getDockInteractionIntensity(800, dockRect, baseSize)).toBe(1);
  });

  it("approaches the current target without overshooting", () => {
    const baseSize = 56;
    const state = createDockSpringState(baseSize);
    const target = getDockMotionTarget(0, baseSize);
    const firstStep = stepDockSpring(state, target);
    const secondStep = stepDockSpring(firstStep, target);

    expect(firstStep.size).toBeGreaterThan(baseSize);
    expect(firstStep.size).toBeLessThan(target.size);
    expect(secondStep.size).toBeGreaterThan(firstStep.size);
    expect(secondStep.size).toBeLessThan(target.size);
  });
});
