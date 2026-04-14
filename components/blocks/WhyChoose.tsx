"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ─── Types ──────────────────────────────────────────────── */

interface WhyChooseProps {
  data: {
    sectionTitle?: string;
    reasons?: Array<{
      _key: string;
      point: string;
    }>;
  };
}

/* ─── Component ──────────────────────────────────────────── */

export default function WhyChoose({ data }: WhyChooseProps) {
  const { sectionTitle, reasons } = data;
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!reasons?.length) return;

      // Header
      gsap.fromTo(
        ".wc-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Reason items
      const items = sectionRef.current?.querySelectorAll(".wc-item");
      if (items?.length) {
        gsap.fromTo(
          items,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  if (!reasons?.length) return null;

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 bg-ss-black overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(214,40,40,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="ss-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left — Sticky header */}
          <div className="lg:col-span-5">
            <div className="wc-header lg:sticky lg:top-32" style={{ opacity: 0 }}>
              <span className="inline-block text-xs text-ss-red uppercase tracking-[0.25em] font-semibold mb-4">
                Why SS PLUS
              </span>
              <div className="ss-accent-line mb-8" />
              <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] font-extrabold leading-[1.1] text-ss-pure-white">
                {sectionTitle}
              </h2>
            </div>
          </div>

          {/* Right — Reasons list */}
          <div className="lg:col-span-7">
            <div className="space-y-0">
              {reasons.map((reason, i) => (
                <div
                  key={reason._key}
                  className="wc-item group flex gap-6 py-7 border-b border-white/[0.05] last:border-b-0 transition-all duration-300 hover:pl-3"
                  style={{ opacity: 0 }}
                >
                  {/* Number */}
                  <span className="flex-shrink-0 font-display text-sm font-bold text-ss-grey-700 group-hover:text-ss-red transition-colors duration-300 mt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-base md:text-lg text-ss-grey-200 leading-relaxed group-hover:text-ss-pure-white transition-colors duration-300">
                      {reason.point}
                    </p>
                  </div>

                  {/* Arrow indicator on hover */}
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 mt-1">
                    <svg
                      className="w-4 h-4 text-ss-red"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

