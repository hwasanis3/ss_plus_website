"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ─── Types ──────────────────────────────────────────────── */

interface WavePlusTeaserProps {
  data: {
    headline?: string;
    description?: string;
    cta?: string;
  };
}

/* ─── Component ──────────────────────────────────────────── */

export default function WavePlusTeaser({ data }: WavePlusTeaserProps) {
  const { headline, description, cta } = data;
  const sectionRef = useRef<HTMLElement>(null);
  const [particles, setParticles] = useState<{ top: string; left: string }[]>([]);

  useEffect(() => {
    const generatedParticles = [...Array(6)].map(() => ({
      top: `${20 + Math.random() * 60}%`,
      left: `${10 + Math.random() * 80}%`,
    }));
    setParticles(generatedParticles);
  }, []);

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

      tl.fromTo(
        ".wp-label",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 }
      );

      tl.fromTo(
        ".wp-headline",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.3"
      );

      tl.fromTo(
        ".wp-desc",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.4"
      );

      tl.fromTo(
        ".wp-cta",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.2"
      );

      // Floating particles
      const particleEls = sectionRef.current?.querySelectorAll(".wp-particle");
      if (particleEls?.length) {
        particleEls.forEach((el) => {
          gsap.to(el, {
            y: `random(-20, 20)`,
            x: `random(-15, 15)`,
            duration: `random(3, 6)`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: `random(0, 2)`,
          });
        });
      }

      // Glow pulse
      gsap.to(".wp-glow", {
        scale: 1.1,
        opacity: 0.8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 bg-ss-black overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-linear-to-br from-ss-black via-ss-charcoal/50 to-ss-black" />
      <div className="absolute inset-0 ss-noise pointer-events-none" />

      {/* Animated glow orb */}
      <div className="wp-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[radial-gradient(circle,rgba(214,40,40,0.06)_0%,transparent_60%)] pointer-events-none" />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="wp-particle absolute w-1 h-1 rounded-full bg-ss-red/20 pointer-events-none"
          style={{
            top: p.top,
            left: p.left,
          }}
        />
      ))}

      {/* Grid lines decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white/2" />
        <div className="absolute left-2/4 top-0 bottom-0 w-px bg-white/2" />
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-white/2" />
      </div>

      <div className="ss-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="wp-label inline-flex items-center gap-3 px-5 py-2 mb-8 rounded-full border border-ss-red/20 bg-ss-red/6" style={{ opacity: 0 }}>
            <div className="w-2.5 h-2.5 rounded-full bg-ss-red animate-pulse shadow-[0_0_12px_rgba(214,40,40,0.5)]" />
            <span className="text-xs font-semibold text-ss-red uppercase tracking-[0.2em]">
              Digital Platform
            </span>
          </div>

          {/* Headline */}
          <h2
            className="wp-headline font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.05] text-ss-pure-white mb-8"
            style={{ opacity: 0 }}
          >
            {headline?.split(" ").map((word, i) => {
              const isHighlight =
                word.toLowerCase().includes("digitized") ||
                word.toLowerCase().includes("digital");
              return (
                <span key={i}>
                  {isHighlight ? (
                    <span className="text-ss-red">{word}</span>
                  ) : (
                    word
                  )}
                  {" "}
                </span>
              );
            })}
          </h2>

          {/* Description */}
          <p
            className="wp-desc text-base md:text-lg text-ss-grey-300 leading-relaxed max-w-2xl mx-auto mb-10"
            style={{ opacity: 0 }}
          >
            {description}
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {["Real-time Tracking", "Equipment Management", "Digital Certificates", "Maintenance Schedules"].map((feat, i) => (
              <span
                key={i}
                className="wp-desc px-4 py-2 text-xs text-ss-grey-200 uppercase tracking-wider border border-white/6 rounded-full bg-white/2"
                style={{ opacity: 0 }}
              >
                {feat}
              </span>
            ))}
          </div>

          {/* CTA */}
          {cta && (
            <a
              href="/wave-plus"
              className="wp-cta group relative inline-flex items-center gap-3 px-10 py-5 bg-ss-red text-[#fff] font-bold text-sm uppercase tracking-[0.15em] rounded-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_50px_rgba(214,40,40,0.3)] hover:-translate-y-0.5"
              style={{ opacity: 0 }}
            >
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10">{cta}</span>
              <svg
                className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

