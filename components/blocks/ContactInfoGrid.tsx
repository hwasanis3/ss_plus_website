"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface ContactItem {
  _key: string;
  label: string;
  value: string;
  icon?: string;
}

interface ContactInfoGridProps {
  data: {
    title?: string;
    items?: ContactItem[];
  };
}

export default function ContactInfoGrid({ data }: ContactInfoGridProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!data.items?.length) return;

      // Cards staggered entrance with fromTo for reliability
      gsap.fromTo(
        ".cig-card",
        { y: 60, autoAlpha: 0, scale: 0.96 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            once: true,
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );
    },
    { scope: sectionRef, dependencies: [data.items] }
  );

  if (!data.items?.length) return null;

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-ss-black overflow-hidden border-t border-ss-white/5 relative">
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,40,40,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="ss-container relative z-10">
        {/* Header Area */}
        <div className="mb-24 lg:mb-32">
           <div className="flex items-center gap-6 mb-10">
            <div className="w-16 h-px bg-ss-red" />
            <h2 className="text-[11px] font-black text-ss-red uppercase tracking-[0.4em]">
               Operational Connectivity
            </h2>
          </div>
          <h3 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-balance text-ss-pure-white font-extrabold leading-[1.15] md:leading-[1.05] max-w-4xl tracking-tight drop-shadow-2xl">
             {data.title || "Multi-Department Communication."}
          </h3>
        </div>

        {/* Info Grid - Reimagined for High-End Enterprise Feel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {data.items.map((item, idx) => (
            <div 
              key={item._key}
              className="cig-card group relative p-10 lg:p-12 bg-ss-charcoal/70 backdrop-blur-3xl border border-ss-white/5 rounded-2xl hover:border-ss-red/30 transition-all duration-700 flex flex-col h-full hover:shadow-[0_20px_40px_rgba(15,23,42,0.16)] dark:hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] group/card hover:-translate-y-2 overflow-hidden"
            >
              {/* Inner Decorative Tech Accent */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,40,40,0.03)_0%,transparent_50%)] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                {/* Icon Container with Digital Pulse */}
                <div className="w-16 h-16 rounded-2xl bg-ss-white/5 border border-ss-white/10 flex items-center justify-center mb-10 group-hover:bg-ss-red group-hover:border-ss-red group-hover:shadow-[0_0_30px_rgba(214,40,40,0.4)] transition-all duration-500 shadow-2xl relative overflow-hidden group/icon">
                   <div className="absolute inset-x-0 bottom-0 h-px bg-ss-white/20 group-hover:translate-y-[-64px] transition-transform duration-1000" />
                   
                   <div className="w-6 h-6 border-2 border-ss-red/40 group-hover:border-ss-pure-white transition-all duration-500 rounded-sm relative flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-ss-red group-hover:bg-[#fff] transition-colors duration-500 transform rotate-45" />
                   </div>
                </div>
                
                <h4 className="font-display text-[11px] text-ss-red font-black uppercase tracking-[0.4em] mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
                   {item.label}
                </h4>
                
                <div className="text-ss-pure-white font-display text-lg lg:text-xl font-black leading-relaxed whitespace-pre-line group-hover:text-ss-red transition-all duration-500 tracking-normal break-words text-balance mt-2">
                   {item.value}
                </div>

                {/* Status Indicator */}
                <div className="mt-auto pt-10 border-t border-ss-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-ss-red shadow-[0_0_8px_rgba(214,40,40,0.6)] animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ss-white/30 group-hover:text-ss-white/70 transition-colors duration-500">System Ready</span>
                   </div>
                   <span className="text-ss-white/5 font-mono text-[11px] group-hover:text-ss-white/10 transition-colors duration-500 uppercase">
                      Ch-{String(idx + 1).padStart(2, '0')}
                   </span>
                </div>
              </div>

              {/* Architectural Accents */}
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-ss-white/10" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-ss-white/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

