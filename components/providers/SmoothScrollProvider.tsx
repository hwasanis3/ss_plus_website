"use client";

import { useLayoutEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const lenis = useLenis();

  // Connect ScrollTrigger to Lenis
  useLayoutEffect(() => {
    if (!lenis) return;

    function update(time: number) {
      lenis?.raf(time * 1000);
    }

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
    };
  }, [lenis]);

  // Refresh ScrollTrigger on all route / height changes
  useLayoutEffect(() => {
    const handler = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handler);
    window.addEventListener("load", handler);
    // Give content & GSAP fromTo initial states time to settle
    const timeoutId = window.setTimeout(handler, 300);

    // Refresh after fonts load to prevent trigger miscalculation
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("load", handler);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.12,
        duration: 1.5,
        smoothWheel: true,
        wheelMultiplier: 1.1,
        touchMultiplier: 1.5,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
