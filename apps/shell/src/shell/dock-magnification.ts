export type DockMotionTarget = {
  lift: number;
  size: number;
};

export type DockSpringState = DockMotionTarget & {
  liftVelocity: number;
  sizeVelocity: number;
};

export const dockMagnificationConfig = {
  approachFactor: 0.22,
  distanceLimitMultiplier: 6,
  liftMultiplier: 0.22,
  maxAmplification: 0.42,
  sizeMultipliers: [1, 1.1, 1.618, 2.618, 1.618, 1.1, 1],
  settleEpsilon: 0.01
} as const;

export function createDockSpringState(baseSize: number): DockSpringState {
  return {
    lift: 0,
    liftVelocity: 0,
    size: baseSize,
    sizeVelocity: 0
  };
}

export function getDockMotionTarget(
  distance: number | null,
  baseSize: number,
  intensity = 1
): DockMotionTarget {
  const distanceLimit = baseSize * dockMagnificationConfig.distanceLimitMultiplier;
  const clampedIntensity = clamp(intensity, 0, 1);

  if (distance === null || clampedIntensity === 0 || Math.abs(distance) > distanceLimit) {
    return {
      lift: 0,
      size: baseSize
    };
  }

  const size = interpolate(
    getDistanceInput(distanceLimit),
    dockMagnificationConfig.sizeMultipliers.map((multiplier) => {
      const tunedMultiplier =
        1 + (multiplier - 1) * dockMagnificationConfig.maxAmplification * clampedIntensity;

      return baseSize * tunedMultiplier;
    }),
    distance
  );

  return {
    lift: -(size - baseSize) * dockMagnificationConfig.liftMultiplier,
    size
  };
}

export function stepDockSpring(
  state: DockSpringState,
  target: DockMotionTarget
): DockSpringState {
  const sizeVelocity = (target.size - state.size) * dockMagnificationConfig.approachFactor;
  const liftVelocity = (target.lift - state.lift) * dockMagnificationConfig.approachFactor;

  return {
    lift: state.lift + liftVelocity,
    liftVelocity,
    size: state.size + sizeVelocity,
    sizeVelocity
  };
}

export function isDockSpringSettled(state: DockSpringState, target: DockMotionTarget) {
  return (
    Math.abs(state.size - target.size) < dockMagnificationConfig.settleEpsilon &&
    Math.abs(state.sizeVelocity) < dockMagnificationConfig.settleEpsilon &&
    Math.abs(state.lift - target.lift) < dockMagnificationConfig.settleEpsilon &&
    Math.abs(state.liftVelocity) < dockMagnificationConfig.settleEpsilon
  );
}

export function getDockInteractionIntensity(
  pointerY: number,
  dockRect: Pick<DOMRect, "bottom" | "top">,
  baseSize: number
) {
  const activationTop = dockRect.top - baseSize * 0.9;
  const rawProgress = (pointerY - activationTop) / (dockRect.bottom - activationTop);

  return smoothstep(clamp(rawProgress, 0, 1));
}

function getDistanceInput(distanceLimit: number) {
  return [
    -distanceLimit,
    -distanceLimit / 1.25,
    -distanceLimit / 2,
    0,
    distanceLimit / 2,
    distanceLimit / 1.25,
    distanceLimit
  ];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}

function interpolate(
  input: readonly number[],
  output: readonly number[],
  value: number
) {
  if (input.length !== output.length) {
    throw new Error("Dock interpolation input and output ranges must have the same length.");
  }

  for (let index = 0; index < input.length - 1; index += 1) {
    const rangeStart = input[index];
    const rangeEnd = input[index + 1];

    if (value >= rangeStart && value <= rangeEnd) {
      const progress = (value - rangeStart) / (rangeEnd - rangeStart);

      return output[index] + (output[index + 1] - output[index]) * progress;
    }
  }

  return value < input[0] ? output[0] : output[output.length - 1];
}
