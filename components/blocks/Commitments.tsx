"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface CommitmentsProps {
  data: {
    title?: string;
    items?: string[];
  };
}

export default function Commitments({ data }: CommitmentsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!data.items?.length) return;

      // Header entrance
      gsap.fromTo(
        ".com-header",
        { x: -50, autoAlpha: 0 },
        { 
          x: 0, 
          autoAlpha: 1, 
          duration: 1.4, 
          ease: "expo.out",
          scrollTrigger: {
            once: true,
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );

      // Items staggered entrance
      gsap.fromTo(
        ".com-item",
        { x: 30, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: {
            once: true,
            trigger: sectionRef.current,
            start: "top 70%",
          }
        }
      );

      // Background accent reveal
      gsap.fromTo(
        ".com-accent",
        { width: 0 },
        {
          width: "100%",
          duration: 2.5,
          ease: "expo.inOut",
          scrollTrigger: {
            once: true,
            trigger: sectionRef.current,
            start: "top 85%",
          }
        }
      );
    },
    { scope: sectionRef, dependencies: [data.items] }
  );

  if (!data.items?.length) return null;

  return (
    <section ref={sectionRef} className="py-20 lg:py-36 bg-ss-black overflow-hidden border-t border-ss-white/5 relative">
      {/* Dynamic Background Element */}
      <div className="absolute right-0 top-0 w-1/3 h-full bg-linear-to-l from-ss-red/5 to-transparent pointer-events-none" />

      <div className="ss-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 items-center">
          {/* Header Area */}
          <div className="com-header lg:col-span-5">
             <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-px bg-ss-red" />
              <h2 className="text-[12px] font-bold text-ss-red uppercase tracking-[0.4em]">
                Directives
              </h2>
            </div>
            
            <h3 className="font-display text-4xl md:text-5xl lg:text-7xl text-ss-pure-white font-extrabold leading-[1.05] mb-12 tracking-tight">
              {data.title || "Key Commitments"}
            </h3>
            
            <div className="space-y-8 pl-8 border-l-2 border-ss-white/5">
                <p className="text-ss-grey-300 font-body text-lg lg:text-xl leading-relaxed italic">
                    &ldquo;Every operation, supplier, and outcome passes through defined QHSE checkpoints to ensure unwavering consistency.&rdquo;
                </p>
                <div className="flex items-center gap-4 text-ss-white/40 uppercase tracking-widest font-bold text-[10px]">
                    <span className="w-8 h-px bg-ss-red" />
                    Management Mandate
                </div>
            </div>
          </div>

          {/* List Area - Modern Architectural Grid */}
          <div className="lg:col-span-7">
             <div className="grid grid-cols-1 gap-4 md:gap-6">
                {data.items.map((item, idx) => (
                   <div 
                     key={idx}
                     className="com-item group relative p-8 lg:p-10 bg-ss-charcoal/70 backdrop-blur-sm border border-ss-white/5 hover:border-ss-red/40 transition-all duration-500 rounded-xl overflow-hidden cursor-default shadow-xl sm:hover:-translate-x-2"
                   >
                      {/* Hover Slide Background */}
                      <div className="absolute inset-0 bg-linear-to-r from-ss-red/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                      
                      <div className="flex gap-8 items-start relative z-10">
                         <span className="font-display text-4xl font-black text-ss-white/5 group-hover:text-ss-red/40 transition-all duration-700 leading-none">
                             {String(idx + 1).padStart(2, '0')}
                         </span>
                         <p className="text-ss-grey-400 font-body text-base lg:text-lg leading-relaxed group-hover:text-ss-pure-white transition-colors duration-500 max-w-lg">
                            {item}
                         </p>
                      </div>

                      {/* Small Red Accent Tab */}
                      <div className="absolute top-0 right-0 w-2 h-0 bg-ss-red group-hover:h-full transition-all duration-700" />
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Decorative Floor Accent */}
      <div className="com-accent absolute bottom-0 left-0 h-px bg-linear-to-r from-ss-red/40 via-ss-red/10 to-transparent pointer-events-none" />
    </section>
  );
}

