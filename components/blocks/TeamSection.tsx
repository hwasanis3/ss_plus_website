"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GSAP_DURATION, GSAP_EASE, GSAP_FAST_DURATION, SCROLL_TRIGGER_START } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger);

interface TeamSectionProps {
  data: {
    title: string;
    description: string;
    note?: string;
  };
}

export default function TeamSection({ data }: TeamSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        y: 24,
        autoAlpha: 0,
        duration: GSAP_FAST_DURATION,
        ease: GSAP_EASE,
        scrollTrigger: {
          trigger: textRef.current,
          start: SCROLL_TRIGGER_START,
          once: true,
        },
      });

      gsap.from(visualRef.current, {
        y: 30,
        scale: 0.98,
        autoAlpha: 0,
        duration: GSAP_DURATION,
        ease: GSAP_EASE,
        scrollTrigger: {
          trigger: visualRef.current,
          start: SCROLL_TRIGGER_START,
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-ss-grey-950 border-y border-ss-grey-800/20">
      <div className="ss-container grid lg:grid-cols-2 gap-16 items-center">
        {/* Visual Decoration */}
        <div ref={visualRef} className="relative group overflow-hidden rounded-sm aspect-square md:aspect-video lg:aspect-square bg-ss-grey-900 border border-ss-grey-800 shadow-2xl">
          <Image
            src="/team-work.png"
            alt="SS PLUS Team"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          
          <div className="absolute inset-0 bg-linear-to-t from-ss-black via-transparent to-transparent opacity-60" />
          
          <div className="absolute bottom-8 left-8">
            <p className="text-ss-red font-bold text-sm uppercase tracking-widest mb-2 font-display">
               Operational Excellence
            </p>
            <h4 className="text-ss-white font-bold text-2xl lg:text-3xl font-display">
              The Humans Behind the Safety.
            </h4>
          </div>
        </div>

        {/* Content */}
        <div ref={textRef}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-ss-red" />
            <h2 className="text-xs font-bold text-ss-red uppercase tracking-[0.3em]">
              The SS PLUS Team
            </h2>
          </div>
          
          <h3 className="font-display text-4xl md:text-5xl lg:text-7xl text-ss-white font-bold leading-tight mb-8">
            {data.title}
          </h3>
          
          <p className="text-ss-grey-300 font-body mb-10 text-lg leading-relaxed">
            {data.description.split('\n\n')[0]}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { role: "CEO", desc: "Visionary Leadership & High-level Strategy" },
              { role: "Operations", desc: "Efficient Execution & Project Oversight" },
              { role: "Team Leaders", desc: "Technical Guidance & Site Management" },
              { role: "Technicians", desc: "Certified Technical Field Experts" }
            ].map((item, i) => (
              <div key={i} className="p-4 border border-white/5 bg-white/3 rounded-sm flex flex-col gap-1 transition-colors duration-300 hover:border-ss-red/30">
                <span className="text-ss-red font-bold text-xs uppercase tracking-widest">{item.role}</span>
                <span className="text-ss-grey-400 text-sm leading-snug">{item.desc}</span>
              </div>
            ))}
          </div>
          
          {data.note && (
            <div className="mt-8 p-4 border-l-2 border-ss-red bg-ss-red/5">
               <p className="text-ss-grey-200 font-body text-sm italic">
                  {data.note}
               </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
