"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface Certification {
  _key: string;
  title: string;
  domain: string;
  description: string;
}

interface Standard {
  _key: string;
  standard: string;
  domain: string;
}

interface StandardsGridProps {
  data: {
    title?: string;
    certifications?: Certification[];
    standards?: Standard[];
  };
}

export default function StandardsGrid({ data }: StandardsGridProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!data.certifications?.length && !data.standards?.length) return;

      // Header entrance
      gsap.fromTo(
        ".sg-header",
        { y: 30, autoAlpha: 0 },
        { 
          y: 0, 
          autoAlpha: 1, 
          duration: 1.2, 
          ease: "expo.out",
          scrollTrigger: {
            once: true,
            trigger: sectionRef.current,
            start: "top 85%",
          }
        }
      );

      // Cert cards stagger
      gsap.fromTo(
        ".sg-cert",
        { y: 40, autoAlpha: 0, scale: 0.98 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "expo.out",
          scrollTrigger: {
            once: true,
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );

      // Standards table rows stagger
      gsap.fromTo(
        ".sg-row",
        { x: -30, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: {
            once: true,
            trigger: ".sg-table",
            start: "top 85%",
          }
        }
      );
    },
    { scope: sectionRef, dependencies: [data.certifications, data.standards] }
  );

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-ss-black overflow-hidden border-t border-ss-white/5 relative">
      {/* Background Graphic Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(214,40,40,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="ss-container relative z-10">
        {/* Header */}
        <div className="sg-header mb-24 lg:mb-36 max-w-4xl section-reveal">
           <div className="flex items-center gap-6 mb-10">
            <div className="w-16 h-px bg-ss-red" />
            <h2 className="text-[12px] font-bold text-ss-red uppercase tracking-[0.4em]">
              Compliance Excellence
            </h2>
          </div>
          <h3 className="font-display text-4xl md:text-5xl lg:text-6xl text-ss-pure-white font-extrabold leading-[1.05] tracking-tight">
             {data.title || "Standards & Certifications"}
          </h3>
        </div>

        {/* Certifications Showroom */}
        {data.certifications && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-32 section-reveal">
            {data.certifications.map((cert) => (
              <div 
                key={cert._key}
                className="sg-cert relative group p-12 lg:p-16 bg-ss-charcoal/80 backdrop-blur-xl border border-ss-white/5 rounded-3xl hover:border-ss-red/40 transition-all duration-700 overflow-hidden shadow-[0_20px_40px_rgba(15,23,42,0.14)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.6)] group hover:-translate-y-2"
              >
                 {/* Visual Certification Seal */}
                 <div className="absolute -top-12 -right-12 w-56 h-56 border-2 border-ss-white/5 rounded-full flex items-center justify-center -rotate-12 group-hover:rotate-6 group-hover:scale-110 group-hover:border-ss-red/20 transition-all duration-1000">
                    <div className="w-40 h-40 border border-ss-red/10 rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
                        <span className="text-[9px] font-black text-ss-red/20 uppercase tracking-[0.3em] text-center leading-relaxed">
                           AUTHORIZED OPERATOR • CERTIFIED QUALITY • SS PLUS TECHNICAL SYSTEM •
                        </span>
                    </div>
                 </div>

                 <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="px-3 py-1.5 rounded-md bg-ss-red/10 border border-ss-red/20">
                            <span className="text-ss-red text-[11px] font-black uppercase tracking-widest block">
                                {cert.domain}
                            </span>
                        </div>
                    </div>

                    <h4 className="font-display text-3xl lg:text-5xl text-ss-pure-white font-black mb-8 leading-tight group-hover:text-ss-red transition-colors duration-500">
                       {cert.title}
                    </h4>
                    <p className="text-ss-grey-400 font-body text-base lg:text-lg leading-relaxed max-w-sm group-hover:text-ss-grey-200 transition-colors duration-500">
                       {cert.description}
                    </p>
                 </div>

                 {/* Corner Decoration */}
                 <div className="absolute bottom-10 right-10 flex gap-2">
                    <div className="w-1 h-1 rounded-full bg-ss-red/40" />
                    <div className="w-1 h-1 rounded-full bg-ss-grey-800" />
                    <div className="w-1 h-1 rounded-full bg-ss-grey-800" />
                 </div>
              </div>
            ))}
          </div>
        )}

        {/* Global Standards Table - Reimagined */}
        {data.standards && (
          <div className="sg-table max-w-5xl mx-auto border border-ss-white/5 rounded-3xl overflow-hidden bg-ss-charcoal/70 backdrop-blur-md shadow-[0_20px_45px_rgba(15,23,42,0.12)] dark:shadow-[0_60px_100px_rgba(0,0,0,0.4)]">
             <div className="grid grid-cols-2 gap-4 bg-ss-charcoal-light border-b border-ss-white/10 p-6 sm:p-10 md:p-12 items-center">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-ss-red" />
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-ss-white/60">Registry Code</span>
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-ss-white/60 text-right">Technical Framework</span>
             </div>
             
             <div className="divide-y divide-ss-white/5">
                {data.standards.map((standard) => (
                   <div 
                     key={standard._key}
                     className="sg-row grid grid-cols-2 gap-4 p-6 sm:p-10 md:p-12 hover:bg-ss-white/3 transition-all duration-500 group/row cursor-default"
                   >
                      <div className="flex flex-col gap-2">
                        <span className="font-display text-ss-pure-white text-xl lg:text-2xl font-bold tracking-tight group-hover/row:text-ss-red transition-colors duration-300">
                            {standard.standard}
                        </span>
                      </div>
                      <span className="text-ss-grey-400 font-body text-base lg:text-lg text-right flex items-center justify-end gap-3 group-hover/row:text-ss-grey-200 transition-all duration-300">
                        {standard.domain}
                        <div className="opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
                            <svg className="w-4 h-4 text-ss-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                      </span>
                   </div>
                ))}
             </div>
             
             {/* Bottom Commitment Note */}
             <div className="p-6 sm:p-12 text-center bg-ss-charcoal border-t border-ss-white/5">
                <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
                    <div className="w-10 h-0.5 bg-ss-white/10" />
                    <p className="text-ss-grey-500 font-body italic text-sm lg:text-base leading-relaxed">
                       &ldquo;Our products and services are subjected to rigorous internal quality control measures, ensuring and often exceeding these industry benchmarks.&rdquo;
                    </p>
                    <div className="flex items-center gap-8 opacity-30 mt-4">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-ss-white">Ref: SSPLUS_QC_FRAMEWORK</span>
                    </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </section>
  );
}

