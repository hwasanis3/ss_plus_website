"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface Benefit {
  _key: string;
  title: string;
  description: string;
}

interface WhyWavePlusProps {
  data: {
    title?: string;
    benefits?: Benefit[];
  };
}

export default function WhyWavePlus({ data }: WhyWavePlusProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!data.benefits?.length) return;

      // Title reveal
      gsap.fromTo(
        ".wwp-header",
        { y: 30, autoAlpha: 0 },
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

      // Benefits staggered entrance with fromTo
      gsap.fromTo(
        ".wwp-item",
        { x: 40, autoAlpha: 0 },
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

      // Accent lines reveal
      gsap.fromTo(
        ".wwp-line",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1.5,
          stagger: 0.15,
          ease: "expo.inOut",
          scrollTrigger: {
            once: true,
            trigger: sectionRef.current,
            start: "top 85%",
          }
        }
      );
    },
    { scope: sectionRef, dependencies: [data.benefits] }
  );

  if (!data.benefits?.length) return null;

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-ss-black overflow-hidden border-t border-ss-white/5 relative">
      <div className="ss-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Header Area - Balanced width to prevent overlap */}
          <div className="wwp-header lg:col-span-12 xl:col-span-5 flex flex-col justify-center">
             <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-px bg-ss-red" />
              <h2 className="text-[11px] font-black text-ss-red uppercase tracking-[0.4em]">
                Strategic Value
              </h2>
            </div>
            
            <h3 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-balance break-words text-ss-pure-white font-extrabold leading-[1.15] md:leading-[1.05] mb-12 tracking-tight drop-shadow-2xl">
              {data.title || "Innovation for Safety Control"}
            </h3>
            
            <p className="text-ss-grey-400 font-body text-lg lg:text-xl leading-relaxed max-w-lg italic pl-8 border-l-2 border-ss-white/10 group-hover:border-ss-red transition-colors duration-1000">
               &ldquo;WAVE PLUS turns the safety service relationship into a transparent, data-driven partnership. You see exactly what we do, when we do it, and the results — in real time.&rdquo;
            </p>
          </div>

          {/* Benefits Grid - Clean, Modern Architectural List */}
          <div className="lg:col-span-12 xl:col-span-7">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                {data.benefits.map((benefit, idx) => (
                   <div 
                     key={benefit._key}
                     className="wwp-item group flex flex-col h-full bg-ss-white/2 border border-ss-white/5 p-10 lg:p-12 rounded-3xl hover:border-ss-red/40 transition-all duration-700 hover:-translate-y-2 relative overflow-hidden"
                   >
                      {/* Background Visual Accent */}
                      <div className="absolute inset-0 bg-linear-to-tr from-ss-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-6 mb-10">
                           <div className="wwp-line w-12 h-px bg-ss-red/30 group-hover:bg-ss-red group-hover:w-20 transition-all duration-1000" />
                           <span className="font-display text-xs font-black uppercase tracking-[0.3em] text-ss-white/20 group-hover:text-ss-red transition-colors duration-500">Value 0{idx + 1}</span>
                        </div>
                        
                        <h4 className="font-display text-xl lg:text-2xl text-balance break-words text-ss-pure-white font-black mb-6 group-hover:text-ss-red transition-colors duration-500 leading-tight">
                           {benefit.title}
                        </h4>
                        
                        <p className="text-ss-grey-400 font-body text-base lg:text-lg leading-relaxed group-hover:text-ss-grey-200 transition-colors duration-500">
                           {benefit.description}
                        </p>
                      </div>

                      {/* Bottom corner visual indicator */}
                      <div className="absolute bottom-10 right-10 flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-ss-red/40 group-hover:bg-ss-red transition-colors duration-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-ss-white/5 group-hover:bg-ss-red/20 transition-colors duration-500" />
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Modern Background Graphics */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(214,40,40,0.05)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 right-0 p-32 opacity-10 pointer-events-none blur-[140px] mix-blend-screen">
         <div className="w-[600px] h-[600px] bg-ss-red rounded-full" />
      </div>
    </section>
  );
}

