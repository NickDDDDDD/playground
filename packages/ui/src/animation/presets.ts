import type { gsap } from "gsap";

export const revealPreset = {
  autoAlpha: 0,
  y: 16,
  duration: 0.45,
  ease: "power2.out",
  stagger: 0.06,
  clearProps: "transform,opacity,visibility"
} satisfies gsap.TweenVars;
