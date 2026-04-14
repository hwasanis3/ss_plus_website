"use client";

import gsap from "gsap";

export const GSAP_EASE = "expo.out";
export const GSAP_SOFT_EASE = "power3.out";
export const GSAP_SMOOTH_EASE = "power4.out";
export const GSAP_DURATION = 1;
export const GSAP_FAST_DURATION = 0.8;
export const GSAP_STAGGER = 0.12;
export const SCROLL_TRIGGER_START = "top 85%";

export const fadeUp = (
  y = 24,
  duration = GSAP_FAST_DURATION,
  ease = GSAP_EASE
): gsap.TweenVars => ({
  autoAlpha: 0,
  y,
  duration,
  ease,
});
