"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface FeaturedProductsProps {
  data: {
    title?: string;
    products?: string[];
  };
}

export default function FeaturedProducts({ data }: FeaturedProductsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!data.products?.length) return;

      gsap.fromTo(
        ".fp-header",
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            once: true,
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );

      gsap.fromTo(
        ".fp-item",
        { y: 30, autoAlpha: 0, scale: 0.98 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 1,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: {
            once: true,
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );
    },
    { scope: sectionRef, dependencies: [data.products] }
  );

  if (!data.products?.length) return null;

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-ss-black border-t border-ss-white/5 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute left-0 bottom-0 w-150 h-150 bg-[radial-gradient(ellipse_at_bottom_left,rgba(214,40,40,0.06)_0%,transparent_50%)] pointer-events-none" />

      <div className="ss-container relative z-10">
        <div className="fp-header mb-20 max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-ss-red" />
            <h2 className="text-[11px] font-bold text-ss-red uppercase tracking-[0.4em]">
              Market Favorites
            </h2>
          </div>
          <h3 className="font-display text-4xl md:text-5xl text-ss-pure-white font-extrabold leading-tight tracking-tight">
            {data.title || "Featured Selections"}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {data.products.map((productName, idx) => (
            <div 
              key={idx}
              className="fp-item group p-8 bg-ss-charcoal border border-ss-white/5 hover:border-ss-red/40 transition-all duration-500 rounded-xl flex flex-col justify-between min-h-55 hover:shadow-[0_20px_40px_-20px_rgba(214,40,40,0.2)] hover:-translate-y-1 relative overflow-hidden cursor-pointer"
            >
              {/* Hover sweep effect */}
              <div className="absolute inset-0 bg-linear-to-tr from-ss-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10">
                <span className="text-[10px] font-mono text-ss-white/40 mb-5 block uppercase tracking-[0.25em] group-hover:text-ss-white/60 transition-colors duration-300">
                  REF_MOD_{(idx + 1).toString().padStart(2, '0')}
                </span>
                <h4 className="font-display text-xl lg:text-2xl text-ss-pure-white font-bold group-hover:text-ss-red transition-colors duration-300 leading-snug">
                  {productName}
                </h4>
              </div>
              
              <div className="mt-8 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3 text-ss-white/50 bg-ss-white/5 px-3 py-1.5 rounded-full border border-ss-white/10 group-hover:border-ss-white/20 transition-colors duration-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                  <span className="text-[9px] uppercase font-bold tracking-[0.2em] group-hover:text-ss-pure-white transition-colors duration-300">In Stock</span>
                </div>
                
                {/* Arrow icon */}
                <div className="w-8 h-8 rounded-full border border-ss-white/10 flex items-center justify-center transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:border-ss-red/30 group-hover:bg-ss-red/10 transition-all duration-300">
                  <svg className="w-4 h-4 text-ss-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

