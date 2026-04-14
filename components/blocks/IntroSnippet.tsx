"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ─── Types ──────────────────────────────────────────────── */

interface IntroSnippetProps {
  data: {
    sectionLabel?: string;
    headline?: string;
    description?: string;
    cta?: string;
  };
}

/* ─── Component ──────────────────────────────────────────── */

export default function IntroSnippet({ data }: IntroSnippetProps) {
  const { sectionLabel, headline, description, cta } = data;
  const sectionRef = useRef<HTMLElement>(null);

  const headlineLines = (headline ?? "").split("\n");
  const descParagraphs = (description ?? "").split("\\n\\n").length > 1
    ? (description ?? "").split("\\n\\n")
    : (description ?? "").split("\n\n");

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      // Section label
      tl.fromTo(
        ".intro-label",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6 }
      );

      // Accent line
      tl.fromTo(
        ".intro-accent",
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.7, ease: "power3.inOut" },
        "-=0.3"
      );

      // Headline lines
      const lines = sectionRef.current?.querySelectorAll(".intro-headline-line");
      if (lines?.length) {
        tl.fromTo(
          lines,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
          "-=0.4"
        );
      }

      // Description paragraphs
      const paras = sectionRef.current?.querySelectorAll(".intro-desc");
      if (paras?.length) {
        tl.fromTo(
          paras,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 },
          "-=0.4"
        );
      }

      // CTA
      const ctaBtn = sectionRef.current?.querySelector(".intro-cta");
      if (ctaBtn) {
        tl.fromTo(
          ctaBtn,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.2"
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-ss-black overflow-hidden"
    >
      {/* Decorative red glow */}
      <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-125 h-125 bg-[radial-gradient(circle,rgba(214,40,40,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="ss-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left — Label + Accent */}
          <div className="lg:col-span-4">
            {sectionLabel && (
              <span className="intro-label inline-block text-xs text-ss-red uppercase tracking-[0.25em] font-semibold mb-6" style={{ opacity: 0 }}>
                {sectionLabel}
              </span>
            )}
            <div className="intro-accent ss-accent-line" style={{ transform: "scaleX(0)" }} />
          </div>

          {/* Right — Content */}
          <div className="lg:col-span-8">
            {/* Headline */}
            <h2 className="font-display text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-[1.1] md:leading-[1.05] text-ss-pure-white mb-8 md:mb-10">
              {headlineLines.map((line, i) => (
                <span
                  key={i}
                  className="intro-headline-line block mb-1 last:mb-0"
                  style={{ opacity: 0 }}
                >
                  {line}
                </span>
              ))}
            </h2>

            {/* Description */}
            <div className="space-y-5 max-w-2xl">
              {descParagraphs.map((para, i) => (
                <p
                  key={i}
                  className="intro-desc text-base md:text-lg text-ss-grey-300 leading-relaxed"
                  style={{ opacity: 0 }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* CTA */}
            {cta && (
              <a
                href="/about"
                className="intro-cta group inline-flex items-center gap-3 mt-10 text-sm font-semibold text-ss-red uppercase tracking-[0.15em] transition-all duration-300 hover:gap-5"
                style={{ opacity: 0 }}
              >
                <span>{cta}</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

