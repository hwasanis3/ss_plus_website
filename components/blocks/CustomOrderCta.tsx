"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface CustomOrderCtaProps {
  data: {
    headline?: string;
    description?: string;
    cta?: string;
  };
}

export default function CustomOrderCta({ data }: CustomOrderCtaProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".coc-content",
        { y: 60, autoAlpha: 0, scale: 0.95 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: {
            once: true,
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section 
      ref={sectionRef} 
      className="py-20 lg:py-36 bg-ss-black overflow-hidden px-4 border-t border-ss-white/5"
    >
      <div className="ss-container relative z-10">
        <div className="coc-content bg-ss-charcoal/80 backdrop-blur-xl p-6 sm:p-12 md:p-24 lg:p-32 border border-ss-white/10 relative group overflow-hidden max-w-6xl mx-auto rounded-xl sm:rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.16)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
          {/* Design geometry elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-linear-to-r from-transparent via-ss-red/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="absolute top-12 left-12 w-16 h-16 border-t-2 border-l-2 border-ss-white/10" />
          <div className="absolute bottom-12 right-12 w-16 h-16 border-b-2 border-r-2 border-ss-white/10" />
          
          <div className="relative z-10 text-center">
             <div className="flex items-center justify-center gap-6 mb-10">
              <div className="w-16 h-px bg-ss-red/60" />
              <h2 className="text-[12px] font-bold text-ss-red uppercase tracking-[0.4em]">
                Custom Sourcing
              </h2>
              <div className="w-16 h-px bg-ss-red/60" />
            </div>
            
            <h3 className="font-display text-3xl md:text-5xl lg:text-6xl text-ss-pure-white font-extrabold mb-10 leading-[1.1] tracking-tight max-w-4xl mx-auto drop-shadow-lg">
               {data.headline || "Can't find what you need? We'll source it."}
            </h3>
            
            <p className="text-ss-grey-300 font-body text-base lg:text-lg leading-relaxed max-w-2xl mx-auto mb-16 group-hover:text-ss-pure-white transition-colors duration-500">
               {data.description || "Our product portfolio is continuously expanding. If you have specific brand requirements or need specialized equipment — our technical team will respond within 48 hours."}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
               <button className="group/btn px-12 py-6 bg-ss-red text-[#fff] font-bold uppercase tracking-[0.2em] text-xs hover:bg-ss-red-dark transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(214,40,40,0.3)] rounded-full relative overflow-hidden border border-ss-red-dark">
                  <span className="relative z-10">{data.cta || "Submit a Request"}</span>
                  <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
               </button>
               
               <div className="hidden sm:block w-px h-12 bg-ss-white/10" />
               
               <div className="text-left flex flex-col items-center sm:items-start group/contact cursor-pointer">
                  <p className="text-[9px] font-bold text-ss-white/50 uppercase tracking-[0.3em] mb-1">Direct Support</p>
                  <p className="text-ss-white font-bold text-xl group-hover/contact:text-ss-red transition-colors duration-500 flex items-center gap-3">
                    contact@ssplus.tn
                    <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover/contact:opacity-100 group-hover/contact:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </p>
               </div>
            </div>
          </div>
          
          {/* Immersive background graphics */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,40,40,0.08)_0%,transparent_60%)] pointer-events-none mix-blend-screen" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 border border-ss-white/5 rounded-full pointer-events-none opacity-20" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 border border-ss-red/10 rounded-full pointer-events-none group-hover:scale-[1.05] transition-transform duration-1000" />
        </div>
      </div>
    </section>
  );
}

