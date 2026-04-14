"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface PolicyCTAProps {
  data: {
    headline?: string;
    description?: string;
    cta?: string;
    contactEmail?: string;
    contactPhone?: string;
  };
}

export default function PolicyCTA({ data }: PolicyCTAProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Content reveal using fromTo for reliability
      gsap.fromTo(
        ".pcta-content",
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

      // Background shapes animation
      gsap.to(".pcta-shape", {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: "linear",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-20 lg:py-36 bg-ss-black overflow-hidden relative border-t border-ss-white/5">
      {/* Immersive Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
         <div className="pcta-shape absolute -top-40 -right-40 w-150 h-150 border border-ss-red/20 rotate-45 rounded-full" />
         <div className="pcta-shape absolute -bottom-40 -left-40 w-125 h-125 border border-ss-white/5 -rotate-12 rounded-3xl" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,40,40,0.06)_0%,transparent_70%)]" />
      </div>

      <div className="ss-container relative z-10">
        <div className="pcta-content max-w-6xl mx-auto text-center bg-ss-charcoal/70 backdrop-blur-3xl p-8 sm:p-16 md:p-24 lg:p-32 rounded-2xl sm:rounded-[3rem] border border-ss-white/5 shadow-[0_24px_60px_rgba(15,23,42,0.16)] dark:shadow-[0_60px_120px_rgba(0,0,0,0.8)] relative group overflow-hidden">
           
           {/* Visual Frame */}
           <div className="absolute top-12 left-12 w-20 h-20 border-t-2 border-l-2 border-ss-white/5 group-hover:border-ss-red/20 transition-colors duration-1000" />
           <div className="absolute bottom-12 right-12 w-20 h-20 border-b-2 border-r-2 border-ss-white/5 group-hover:border-ss-red/20 transition-colors duration-1000" />

           <div className="flex items-center justify-center gap-6 mb-12">
            <div className="w-16 h-px bg-ss-red/60" />
            <h2 className="text-[12px] font-bold text-ss-red uppercase tracking-[0.5em]">
               Verification Access
            </h2>
            <div className="w-16 h-px bg-ss-red/60" />
          </div>
          
          <h3 className="font-display text-4xl md:text-5xl lg:text-6xl text-ss-pure-white font-extrabold leading-[1.15] md:leading-[1.05] mb-12 tracking-tight drop-shadow-2xl">
             {data.headline || "Documentation You Can Verify."}
          </h3>
          
          <p className="text-ss-grey-300 font-body text-base lg:text-xl leading-relaxed mb-20 max-w-4xl mx-auto group-hover:text-ss-pure-white transition-colors duration-500">
             {data.description || "For clients, partners, and procurement teams conducting supplier evaluation, our full QHSE policy documentation and certifications are available upon request."}
          </p>

          <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
             <a 
               href={`mailto:${data.contactEmail || 'qhse@ssplus.tn'}`}
               className="group/btn px-8 sm:px-16 py-5 sm:py-7 bg-ss-red text-[#fff] font-bold uppercase tracking-[0.25em] text-xs hover:bg-ss-red-dark transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(214,40,40,0.4)] rounded-full relative overflow-hidden border border-ss-red-dark w-full md:w-auto"
             >
                <span className="relative z-10">{data.cta || "Request Our Management System"}</span>
                <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
             </a>

             <a 
               href="https://waveiovi.github.io/wave.sys_beta/"
               target="_blank"
               rel="noopener noreferrer"
               className="group/btn px-8 sm:px-16 py-5 sm:py-7 bg-transparent border border-ss-red text-ss-red font-bold uppercase tracking-[0.25em] text-xs hover:bg-ss-red/10 transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(214,40,40,0.2)] rounded-full relative overflow-hidden w-full md:w-auto"
             >
                <span className="relative z-10">Access wave.sys</span>
                <div className="absolute inset-0 bg-ss-red/10 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
             </a>
             
             <div className="flex flex-col items-center md:items-start group/support cursor-pointer">
                  <span className="text-[10px] text-ss-white/40 uppercase tracking-[0.4em] font-bold mb-2 group-hover/support:text-ss-red/60 transition-colors duration-300">Compliance Priority</span>
                  <span className="text-ss-pure-white font-display text-2xl lg:text-3xl font-black group-hover/support:text-ss-red transition-all duration-300 flex items-center gap-4">
                    {data.contactPhone || "+216 74 453 027"}
                    <svg className="w-5 h-5 opacity-0 -translate-x-4 group-hover/support:opacity-100 group-hover/support:translate-x-0 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
             </div>
          </div>

          {/* Validation Badges — Redefined */}
          <div className="mt-24 pt-16 border-t border-ss-white/5 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-2xl mx-auto">
             <div className="flex flex-col gap-3 opacity-30 hover:opacity-100 transition-all duration-700 cursor-default">
                <span className="font-display text-3xl font-black text-ss-pure-white tracking-widest">ISO 9001</span>
                <div className="flex items-center justify-center gap-3">
                    <span className="w-8 h-px bg-ss-red" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-ss-grey-400">Certified 2010 - 2026+</span>
                </div>
             </div>
             <div className="flex flex-col gap-3 opacity-30 hover:opacity-100 transition-all duration-700 cursor-default">
                <span className="font-display text-3xl font-black text-ss-pure-white tracking-widest uppercase">APSAD</span>
                <div className="flex items-center justify-center gap-3">
                    <span className="w-8 h-px bg-ss-red" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-ss-grey-400">Technical Reference</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

