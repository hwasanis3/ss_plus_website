"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ─── Types ──────────────────────────────────────────────── */

interface CtaBannerProps {
  data: {
    headline?: string;
    description?: string;
    primaryCta?: string;
    secondaryCta?: string;
  };
}

/* ─── Component ──────────────────────────────────────────── */

export default function CtaBanner({ data }: CtaBannerProps) {
  const { headline, description, primaryCta, secondaryCta } = data;
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          once: true,
          trigger: sectionRef.current,
          start: "top 85%",
        },
        defaults: { ease: "expo.out" },
      });

      tl.fromTo(
        ".cta-bg-reveal",
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1.4, ease: "expo.inOut" }
      );

      tl.fromTo(
        ".cta-headline",
        { opacity: 0, y: 40, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2 },
        "-=0.6"
      );

      tl.fromTo(
        ".cta-desc",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.8"
      );

      const btns = sectionRef.current?.querySelectorAll(".cta-action");
      if (btns?.length) {
        tl.fromTo(
          btns,
          { opacity: 0, y: 25, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.7)",
          },
          "-=0.6"
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden border-t border-ss-white/5"
    >
      {/* Background w/ red gradient reveal */}
      <div className="cta-bg-reveal absolute inset-0 bg-ss-red" style={{ transform: "scaleX(0)" }} />

      {/* Noise overlay */}
      <div className="absolute inset-0 ss-noise pointer-events-none z-1 opacity-40" />

      {/* Subtle modern pattern */}
      <div className="absolute inset-0 z-1 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-ss-black/20 to-transparent" />
      </div>

      <div className="ss-container relative z-10 text-center">
        {/* Dynamic header label */}
        <div className="flex items-center justify-center gap-6 mb-12 opacity-80 scale-90">
            <div className="w-10 h-px bg-ss-pure-white" />
            <h2 className="text-[10px] font-black text-ss-pure-white uppercase tracking-[0.6em]">
               System Access
            </h2>
            <div className="w-10 h-px bg-ss-pure-white" />
        </div>

        {/* Headline */}
        <h2
          className="cta-headline font-display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.15] md:leading-[1.05] tracking-tight text-ss-pure-white mb-10 drop-shadow-2xl max-w-4xl mx-auto"
          style={{ opacity: 0 }}
        >
          {headline}
        </h2>

        {/* Description */}
        <p
          className="cta-desc max-w-3xl mx-auto text-lg md:text-xl lg:text-2xl text-[rgba(255,255,255,0.8)] leading-relaxed mb-16 tracking-tight font-medium"
          style={{ opacity: 0 }}
        >
          {description}
        </p>

        {/* Actions - Premium Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 lg:gap-10">
          {primaryCta && (
            <a
              href="/contact"
              className="cta-action group relative inline-flex items-center justify-center gap-4 px-8 sm:px-12 py-5 sm:py-7 bg-ss-pure-white text-ss-black font-black text-xs uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1 active:scale-95"
              style={{ opacity: 0 }}
            >
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-ss-red/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10">{primaryCta}</span>
              <svg
                className="relative z-10 w-5 h-5 transition-transform duration-500 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </a>
          )}

          {secondaryCta && (
            <a
              href="tel:+21674453027"
              className="cta-action group inline-flex items-center justify-center gap-4 px-8 sm:px-12 py-5 sm:py-7 border-2 border-ss-pure-white/40 text-ss-pure-white font-black text-xs uppercase tracking-[0.3em] backdrop-blur-3xl transition-all duration-500 hover:border-ss-pure-white hover:bg-ss-pure-white/10 hover:-translate-y-1 active:scale-95"
              style={{ opacity: 0 }}
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform duration-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
              <span>{secondaryCta}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

