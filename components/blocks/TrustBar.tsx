"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ─── Types ──────────────────────────────────────────────── */

interface TrustBarProps {
  data: {
    stats?: Array<{
      _key: string;
      number: string;
      label: string;
    }>;
  };
}

/* ─── Count-up hook ──────────────────────────────────────── */

function useCountUp(
  target: string,
  shouldStart: boolean,
  duration = 2
): string {
  const [display, setDisplay] = useState(target);

  const animate = useCallback(() => {
    // Handle slash-separated numeric patterns (e.g. "24/7")
    const slashMatch = target.match(/^([^\d]*)(\d+)\s*\/\s*(\d+)([^\d]*)$/);
    if (slashMatch) {
      const prefix = slashMatch[1];
      const leftEnd = parseInt(slashMatch[2], 10);
      const rightEnd = parseInt(slashMatch[3], 10);
      const suffix = slashMatch[4];

      if (Number.isNaN(leftEnd) || Number.isNaN(rightEnd)) {
        setDisplay(target);
        return;
      }

      const values = { left: 0, right: 0 };
      gsap.to(values, {
        left: leftEnd,
        right: rightEnd,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          setDisplay(
            `${prefix}${Math.round(values.left).toLocaleString()}/${Math.round(values.right).toLocaleString()}${suffix}`
          );
        },
      });
      return;
    }

    // Extract numeric portion and prefix/suffix
    const match = target.match(/^([^\d]*)([\d,]+)([^\d]*)$/);
    if (!match) {
      setDisplay(target);
      return;
    }

    const prefix = match[1]; // e.g. "+"
    const numStr = match[2].replace(/,/g, "");
    const suffix = match[3]; // e.g. "+"
    const end = parseInt(numStr, 10);

    if (isNaN(end)) {
      setDisplay(target);
      return;
    }

    const obj = { val: 0 };
    gsap.to(obj, {
      val: end,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        setDisplay(`${prefix}${Math.round(obj.val).toLocaleString()}${suffix}`);
      },
    });
  }, [target, duration]);

  useEffect(() => {
    if (shouldStart) animate();
  }, [shouldStart, animate]);

  return display;
}

/* ─── Stat Item ──────────────────────────────────────────── */

function StatItem({
  number,
  label,
  shouldAnimate,
}: {
  number: string;
  label: string;
  shouldAnimate: boolean;
}) {
  const displayed = useCountUp(number, shouldAnimate);

  return (
    <div className="stat-item group relative text-center py-8 px-4">
      {/* Subtle top accent on hover */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-ss-red transition-all duration-500 group-hover:w-12" />

      <span className="block font-display text-4xl md:text-5xl font-extrabold text-ss-pure-white tracking-tight">
        {displayed}
      </span>
      <span className="block mt-3 text-[11px] text-ss-grey-400 uppercase tracking-[0.2em] leading-snug max-w-[140px] mx-auto">
        {label}
      </span>
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────── */

export default function TrustBar({ data }: TrustBarProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useGSAP(
    () => {
      if (!data.stats?.length) return;

      const items = containerRef.current?.querySelectorAll(".stat-item");
      if (!items?.length) return;

      // Stagger reveal
      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
            onEnter: () => setHasTriggered(true),
          },
        }
      );
    },
    { scope: containerRef }
  );

  if (!data.stats?.length) return null;

  return (
    <section
      ref={containerRef}
      className="relative bg-ss-charcoal border-t border-b border-white/[0.04] overflow-hidden"
    >
      {/* Subtle noise */}
      <div className="absolute inset-0 ss-noise pointer-events-none" />

      <div className="ss-container relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-x divide-white/[0.06]">
          {data.stats.map((stat) => (
            <StatItem
              key={stat._key}
              number={stat.number}
              label={stat.label}
              shouldAnimate={hasTriggered}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

