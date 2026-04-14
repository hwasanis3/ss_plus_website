"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  _key: string;
  title: string;
  description: string;
}

interface PlatformFeaturesProps {
  data: {
    title?: string;
    features?: Feature[];
  };
}

export default function PlatformFeatures({ data }: PlatformFeaturesProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!data.features?.length) return;

      // Cards staggered entrance with fromTo for reliability
      gsap.fromTo(
        ".pf-card",
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

      // Icon subtle float animation
      gsap.to(".pf-icon", {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 1.5,
          from: "random"
        }
      });
    },
    { scope: sectionRef, dependencies: [data.features] }
  );

  if (!data.features?.length) return null;

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-ss-black overflow-hidden border-t border-ss-white/5 relative">
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(214,40,40,0.03)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[500px] bg-linear-to-b from-ss-black via-transparent to-transparent pointer-events-none z-0" />

      <div className="ss-container relative z-10">
        {/* Header */}
        <div className="mb-24 lg:mb-32">
           <div className="flex items-center gap-6 mb-10">
            <div className="w-16 h-px bg-ss-red" />
            <h2 className="text-[11px] font-black text-ss-red uppercase tracking-[0.4em]">
               The Technical Core
            </h2>
          </div>
          <h3 className="font-display text-4xl md:text-5xl lg:text-7xl text-ss-pure-white font-extrabold leading-[1.1] max-w-4xl tracking-tight">
             {data.title || "Everything Your HSE Team Needs — In One Place."}
          </h3>
        </div>

        {/* Feature Grid - Reimagined for High-End Tech Feel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
          {data.features.map((feature, idx) => (
            <div 
              key={feature._key}
              className="pf-card group relative p-10 lg:p-12 bg-ss-charcoal/70 backdrop-blur-3xl border border-ss-white/10 rounded-2xl hover:border-ss-red/30 transition-all duration-700 flex flex-col h-full hover:shadow-[0_20px_40px_rgba(15,23,42,0.16)] dark:hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] group group-hover:scale-[1.02]"
            >
              {/* Inner Decorative Blueprint */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,40,40,0.03)_0%,transparent_50%)] pointer-events-none" />
              
              <div className="relative z-10">
                {/* Visual Icon Container */}
                <div className="pf-icon w-16 h-16 rounded-2xl bg-ss-white/5 border border-ss-white/10 flex items-center justify-center mb-10 group-hover:bg-ss-red group-hover:border-ss-red group-hover:shadow-[0_0_30px_rgba(214,40,40,0.4)] transition-all duration-500 shadow-2xl relative overflow-hidden group/icon">
                   {/* Scanning sweep line */}
                   <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/10 to-transparent group-hover:translate-y-full transition-transform duration-1000" />
                   
                   <div className="w-6 h-6 border-2 border-ss-white/20 group-hover:border-ss-white transition-all duration-500 rounded-sm flex items-center justify-center relative z-10">
                      <div className="w-2 h-2 bg-ss-red group-hover:bg-[#fff] transition-colors duration-500 transform rotate-45" />
                   </div>
                </div>
                
                <h4 className="font-display text-2xl text-ss-pure-white font-black mb-6 group-hover:text-ss-red transition-colors duration-500 tracking-tight leading-tight">
                   {feature.title}
                </h4>
                
                <p className="text-ss-grey-400 font-body text-base leading-relaxed mb-12 group-hover:text-ss-grey-200 transition-colors duration-500">
                   {feature.description}
                </p>

                {/* Module Badge */}
                <div className="mt-auto pt-8 border-t border-ss-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-ss-red shadow-[0_0_8px_rgba(214,40,40,0.6)]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ss-white/40 group-hover:text-ss-white/70 transition-colors duration-500">Active Module</span>
                   </div>
                   <span className="text-ss-white/5 font-mono text-[11px] group-hover:text-ss-white/10 transition-colors duration-500">
                      W+ {String(idx + 1).padStart(2, '0')}
                   </span>
                </div>
              </div>

              {/* Premium Corner Cut Design */}
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-ss-white/10" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-ss-white/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

