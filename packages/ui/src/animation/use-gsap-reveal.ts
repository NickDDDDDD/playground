import type { RefObject } from "react";
import type { gsap } from "gsap";
import { gsap as gsapCore, useGSAP } from "./gsap";
import { revealPreset } from "./presets";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

type UseGsapRevealOptions = {
  selector?: string;
  vars?: gsap.TweenVars;
};

export function useGsapReveal<TElement extends HTMLElement>(
  scope: RefObject<TElement | null>,
  options: UseGsapRevealOptions = {}
) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const selector = options.selector ?? "[data-gsap-reveal]";

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsapCore.set(selector, {
          autoAlpha: 1,
          y: 0,
          clearProps: "transform,opacity,visibility"
        });
        return;
      }

      gsapCore.from(selector, {
        ...revealPreset,
        ...options.vars
      });
    },
    {
      scope,
      dependencies: [prefersReducedMotion, selector, options.vars],
      revertOnUpdate: true
    }
  );
}
