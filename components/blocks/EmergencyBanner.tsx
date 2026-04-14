"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface EmergencyBannerProps {
  data: {
    headline?: string;
    description?: string;
    phone?: string;
  };
}

export default function EmergencyBanner({ data }: EmergencyBannerProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Content reveal using fromTo for reliability
      gsap.fromTo(
        ".eb-content",
        { y: 60, autoAlpha: 0, scale: 0.98 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: {
            once: true,
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );

      // Background industrial pulse
      gsap.to(".eb-pulse", {
        scale: 1.4,
        autoAlpha: 0,
        duration: 2.5,
        repeat: -1,
        ease: "power2.out",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section 
      ref={sectionRef} 
      className="py-24 lg:py-36 bg-ss-red relative overflow-hidden group"
    >
      {/* Background Industrial Accents — Reimagined */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         {/* Moving Gradient Wave */}
         <div className="absolute top-0 right-0 w-[800px] h-full bg-linear-to-l from-ss-black/40 to-transparent skew-x-12 translate-x-40" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_0%,transparent_70%)]" />
         <div className="absolute inset-0 ss-noise opacity-30 mix-blend-overlay" />
         
         {/* Diagonal Warning Lines */}
         <div className="absolute top-0 right-0 w-full h-full opacity-10"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 40px,
                  rgba(0,0,0,1) 40px,
                  rgba(0,0,0,1) 42px
                )`,
              }}
         />
      </div>

      <div className="ss-container relative z-10">
        <div className="eb-content max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-8 mb-12">
            <div className="w-16 h-px bg-ss-pure-white/40" />
            <h2 className="text-[11px] font-black text-ss-pure-white uppercase tracking-[0.6em]">
               24/7 Priority Support Ecosystem
            </h2>
            <div className="w-16 h-px bg-ss-pure-white/40" />
          </div>

          <h3 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-balance break-words text-ss-pure-white font-black leading-[1.15] md:leading-[1.05] mb-12 uppercase tracking-tight drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
             {data.headline || "Urgent Maintenance or Emergency Intervention?"}
          </h3>

          <p className="text-ss-pure-white font-body text-xl lg:text-2xl leading-relaxed mb-16 max-w-4xl mx-auto font-medium drop-shadow-lg">
             {data.description || "SS PLUS operates a 24/7 emergency response line for existing clients. If you have a critical equipment failure or safety malfunction — call our priority line immediately."}
          </p>

          <div className="relative inline-flex items-center justify-center">
             {/* Visual high-intensity pulse indicator */}
             <div className="eb-pulse absolute inset-0 bg-ss-pure-white/40 rounded-full blur-[80px]" />
             
             <a 
               href={`tel:${data.phone || '+216 28 308 108'}`}
               className="relative px-6 sm:px-16 py-6 sm:py-8 bg-ss-pure-white text-ss-red font-black uppercase tracking-[0.3em] text-lg sm:text-xl lg:text-3xl hover:bg-ss-black hover:text-ss-pure-white transition-all duration-700 shadow-[0_30px_100px_-10px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row items-center gap-6 group hover:-translate-y-2 active:scale-95"
             >
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-[9px] lg:text-[10px] font-black tracking-[0.4em] text-ss-red opacity-60 group-hover:text-ss-pure-white transition-colors duration-500 uppercase mb-1">Emergency Hotline</span>
                  <span className="font-display">{data.phone || "+216 28 308 108"}</span>
                </div>
                {/* Contact icon visual accent */}
                <div className="w-10 h-10 rounded-full border-2 border-ss-red/10 flex items-center justify-center group-hover:border-ss-pure-white/20 transition-all duration-500">
                  <svg className="w-5 h-5 group-hover:scale-125 transition-transform duration-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 0 0-1.02.24l-2.2 2.2a15.045 15.045 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1.01A11.36 11.36 0 0 1 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2a9 9 0 0 0-9-9v2a7 7 0 0 1 7 7zM15 12h2a5 5 0 0 0-5-5v2a3 3 0 0 1 3 3z"/>
                  </svg>
                </div>
             </a>
          </div>

          <div className="mt-16 flex items-center justify-center gap-4 text-[rgba(255,255,255,0.4)]">
             <div className="w-2 h-2 rounded-full bg-ss-pure-white shadow-[0_0_8px_rgba(255,255,255,0.6)] animate-pulse" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em]">
                Verified 24H Critical Response Node
             </p>
          </div>
        </div>
      </div>
    </section>
  );
}

