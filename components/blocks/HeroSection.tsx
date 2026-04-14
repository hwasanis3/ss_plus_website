"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  GSAP_DURATION,
  GSAP_EASE,
  GSAP_FAST_DURATION,
  GSAP_SOFT_EASE,
  GSAP_STAGGER,
} from "@/lib/gsap";

/* ─── Register GSAP Plugin ──────────────────────────────── */


/* ─── Types ──────────────────────────────────────────────── */

interface HeroSectionProps {
  data: {
    headline?: string;
    subheadline?: string;
    primaryCta?: string;
    secondaryCta?: string;
    ctas?: Array<{
      _key: string;
      label: string;
      url: string;
      primary: boolean;
    }>;
  };
}

/* ─── Component ──────────────────────────────────────────── */

export default function HeroSection({ data }: HeroSectionProps) {
  const { headline, subheadline, primaryCta, secondaryCta, ctas } = data;

  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const headlineLines = (headline ?? "").split("\n");
  const accentKeywords = [
    "safety",
    "fire",
    "protection",
    "securite",
    "incendie",
  ];

  const normalizeWord = (word: string): string =>
    word
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z]/g, "");

  /* ─── GSAP Entrance Timeline ─────────────────────────── */

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: GSAP_EASE, duration: GSAP_DURATION },
        delay: 0.12,
      });

      tl.fromTo(
        overlayRef.current,
        { opacity: 1 },
        { opacity: 0.55, duration: GSAP_DURATION }
      );

      tl.fromTo(
        accentRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: GSAP_FAST_DURATION, ease: GSAP_SOFT_EASE },
        "-=0.75"
      );

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: GSAP_FAST_DURATION },
        "-=0.6"
      );

      const lineEls = headlineRef.current?.querySelectorAll(".hero-line");
      if (lineEls?.length) {
        tl.fromTo(
          lineEls,
          { clipPath: "inset(0 0 100% 0)", y: 36 },
          {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            duration: GSAP_DURATION,
            stagger: GSAP_STAGGER,
            ease: GSAP_EASE,
          },
          "-=0.45"
        );
      }

      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 24, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: GSAP_FAST_DURATION },
        "-=0.45"
      );

      const ctaBtns = ctaRef.current?.querySelectorAll(".hero-cta-btn");
      if (ctaBtns?.length) {
        tl.fromTo(
          ctaBtns,
          { opacity: 0, y: 20, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: GSAP_FAST_DURATION,
            stagger: GSAP_STAGGER,
            ease: GSAP_SOFT_EASE,
          },
          "-=0.35"
        );
      }

      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0, y: -10 },
        { opacity: 0.6, y: 0, duration: GSAP_FAST_DURATION },
        "-=0.2"
      );

      gsap.to(scrollIndicatorRef.current, {
        y: 8,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.8,
      });
    },
    { scope: containerRef }
  );

  /* ─── Resolve CTAs ───────────────────────────────────── */

  const resolvedCtas: Array<{
    key: string;
    label: string;
    url: string;
    primary: boolean;
  }> = [];

  if (ctas && ctas.length > 0) {
    ctas.forEach((c) =>
      resolvedCtas.push({
        key: c._key,
        label: c.label,
        url: c.url,
        primary: c.primary,
      })
    );
  } else {
    if (primaryCta)
      resolvedCtas.push({
        key: "primary",
        label: primaryCta,
        url: "/services",
        primary: true,
      });
    if (secondaryCta)
      resolvedCtas.push({
        key: "secondary",
        label: secondaryCta,
        url: "/contact",
        primary: false,
      });
  }

  /* ─── Render ─────────────────────────────────────────── */

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-end overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Industrial safety operations"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>

      {/* Overlays */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-1 bg-linear-to-t from-black/90 via-black/80 to-black/60"
      />
      <div className="absolute inset-0 z-2 bg-linear-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute inset-0 z-3 ss-noise pointer-events-none" />
      <div className="absolute top-0 right-0 w-150 h-150 z-2 bg-[radial-gradient(circle,rgba(214,40,40,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 ss-container w-full h-full flex flex-col justify-center pb-24 pt-32 md:pt-48">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 md:mb-8 rounded-full border border-white/10 bg-white/3 backdrop-blur-sm"
              style={{ opacity: 0 }}
            >
              <span className="w-2 h-2 rounded-full bg-ss-red animate-pulse" />
              <span className="text-[10px] md:text-xs font-medium text-white/85 uppercase tracking-[0.2em]">
                Think Safety, Think Us
              </span>
            </div>

            {/* Accent */}
            <div
              ref={accentRef}
              className="ss-accent-line mx-auto mb-6 md:mb-8"
              style={{ transform: "scaleX(0)" }}
            />

            {/* Headline */}
            <h1
              ref={headlineRef}
              className="font-display text-[clamp(2.25rem,8vw,4.5rem)] font-extrabold leading-[1.1] md:leading-none tracking-[-0.03em] text-white mb-6 md:mb-8"
            >
              {headlineLines.map((line, i) => (
                <span
                  key={i}
                  className="hero-line block"
                  style={{ clipPath: "inset(0 0 100% 0)" }}
                >
                  {line.split(" ").map((word, j) => {
                    const normalizedWord = normalizeWord(word);
                    const isAccent = accentKeywords.some((keyword) =>
                      normalizedWord.includes(keyword)
                    );
                    return (
                      <span
                        key={j}
                        className={isAccent ? "text-ss-red" : ""}
                      >
                        {word}
                        {j < line.split(" ").length - 1 ? " " : ""}
                      </span>
                    );
                  })}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p
              ref={subRef}
              className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-white/80 mb-10"
              style={{ opacity: 0 }}
            >
              {subheadline}
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row justify-center w-full sm:w-auto gap-4">
              {resolvedCtas.map((cta) =>
                cta.primary ? (
                  <a
                    key={cta.key}
                    href={cta.url}
                    className="hero-cta-btn w-full sm:w-auto justify-center group relative inline-flex items-center gap-3 px-8 py-4 bg-ss-red text-[#fff] font-semibold text-sm uppercase tracking-[0.15em] rounded-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(214,40,40,0.3)]"
                    style={{ opacity: 0 }}
                  >
                    <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative z-10">{cta.label}</span>
                    <svg
                      className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5-5 5M6 12h12"
                      />
                    </svg>
                  </a>
                ) : (
                  <a
                    key={cta.key}
                    href={cta.url}
                    className="hero-cta-btn w-full sm:w-auto justify-center group inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-white font-semibold text-sm uppercase tracking-[0.15em] rounded-sm bg-black/15 backdrop-blur-sm transition-all duration-300 hover:border-ss-red/50 hover:text-white hover:bg-ss-red/15"
                    style={{ opacity: 0 }}
                  >
                    <span>{cta.label}</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5-5 5M6 12h12"
                      />
                    </svg>
                  </a>
                )
              )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
          style={{ opacity: 0 }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-ss-grey-400">
            Scroll
          </span>
          <div className="w-px h-8 bg-linear-to-b from-ss-red to-transparent" />
        </div>
      </div>
    </section>
  );
}

