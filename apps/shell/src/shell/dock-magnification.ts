export type DockMotionTarget = {
  lift: number;
  size: number;
};

export type DockSpringState = DockMotionTarget & {
  liftVelocity: number;
  sizeVelocity: number;
};

export const dockMagnificationConfig = {
  damping: 0.68,
  distanceLimitMultiplier: 6,
  liftMultiplier: 0.22,
  sizeMultipliers: [1, 1.1, 1.618, 2.618, 1.618, 1.1, 1],
  settleEpsilon: 0.01,
  stiffness: 0.26
} as const;

export function createDockSpringState(baseSize: number): DockSpringState {
  return {
    lift: 0,
    liftVelocity: 0,
    size: baseSize,
    sizeVelocity: 0
  };
}

export function getDockMotionTarget(distance: number | null, baseSize: number): DockMotionTarget {
  const distanceLimit = baseSize * dockMagnificationConfig.distanceLimitMultiplier;

  if (distance === null || Math.abs(distance) > distanceLimit) {
    return {
      lift: 0,
      size: baseSize
    };
  }

  const size = interpolate(
    getDistanceInput(distanceLimit),
    dockMagnificationConfig.sizeMultipliers.map((multiplier) => baseSize * multiplier),
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
  const sizeVelocity =
    (state.sizeVelocity + (target.size - state.size) * dockMagnificationConfig.stiffness) *
    dockMagnificationConfig.damping;
  const liftVelocity =
    (state.liftVelocity + (target.lift - state.lift) * dockMagnificationConfig.stiffness) *
    dockMagnificationConfig.damping;

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
