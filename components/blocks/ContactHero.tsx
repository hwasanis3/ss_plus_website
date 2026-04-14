"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { GSAP_DURATION, GSAP_EASE, GSAP_FAST_DURATION } from "@/lib/gsap";



interface ContactHeroProps {
  data: {
    headline: string;
    description: string;
  };
}

export default function ContactHero({ data }: ContactHeroProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Content reveal using fromTo for reliable entrance
      const tl = gsap.timeline({ defaults: { ease: GSAP_EASE } });
      
      tl.fromTo(
        ".ch-title",
        { y: 34, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: GSAP_DURATION }
      )
      .fromTo(
        ".ch-desc",
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: GSAP_FAST_DURATION },
        "-=0.5"
      )
      .fromTo(
        ".ch-line",
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: GSAP_FAST_DURATION, ease: GSAP_EASE },
        "-=0.45"
      );
    },
    { scope: containerRef }
  );

  return (
    <section 
      ref={containerRef} 
      className="relative pt-32 pb-20 lg:pt-56 lg:pb-32 bg-ss-black overflow-hidden"
    >
      {/* Background Decor — Refined for "Industrial Luxury" */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-3/4 h-full bg-[radial-gradient(circle_at_70%_30%,rgba(214,40,40,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 ss-noise opacity-30 pointer-events-none" />
        
        {/* Subtle Architectural Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
      </div>

      <div className="ss-container relative z-10">
        <div className="max-w-5xl">
          <div className="flex items-center gap-6 mb-12">
            <div className="ch-line w-20 h-px bg-ss-red shadow-[0_0_10px_rgba(214,40,40,0.5)]" />
            <span className="text-[10px] font-black text-ss-red uppercase tracking-[0.5em]">Enterprise Consultation Endpoint</span>
          </div>

          <h1 className="ch-title font-display text-4xl md:text-7xl lg:text-7xl xl:text-8xl text-ss-pure-white font-black leading-[1.15] md:leading-[1.05] mb-12 tracking-tight drop-shadow-2xl">
            {data.headline.split('\n').map((line, i) => (
              <span key={i} className="block last:text-ss-red/90">
                {line}
                {i === data.headline.split('\n').length - 1 && <span className="text-ss-red">.</span>}
              </span>
            ))}
          </h1>

          <p className="ch-desc text-ss-grey-400 font-body text-xl lg:text-2xl leading-relaxed max-w-3xl border-l-2 border-ss-white/10 pl-8 group-hover:border-ss-red transition-colors duration-1000">
            {data.description}
          </p>
        </div>
      </div>
    </section>
  );
}

