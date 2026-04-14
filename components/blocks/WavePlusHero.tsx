"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GSAP_DURATION, GSAP_EASE, GSAP_FAST_DURATION, GSAP_STAGGER } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger);

interface WavePlusHeroProps {
  data: {
    headline: string;
    subheadline: string;
    tags?: string[];
  };
}

export default function WavePlusHero({ data }: WavePlusHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const locale = pathname?.split("/").filter(Boolean)[0] === "fr" ? "fr" : "en";
  const isFr = locale === "fr";

  useGSAP(
    () => {
      // Content reveal using fromTo for reliability
      const tl = gsap.timeline({ defaults: { ease: GSAP_EASE } });
      
      tl.fromTo(
        ".wph-title",
        { y: 32, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: GSAP_DURATION }
      )
      .fromTo(
        ".wph-sub",
        { y: 22, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: GSAP_FAST_DURATION },
        "-=0.55"
      )
      .fromTo(
        ".wph-tag",
        { y: 16, autoAlpha: 0, scale: 0.98 },
        { y: 0, autoAlpha: 1, scale: 1, duration: GSAP_FAST_DURATION, stagger: GSAP_STAGGER },
        "-=0.5"
      )
      .fromTo(
        ".wph-cta",
        { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: GSAP_FAST_DURATION },
        "-=0.4"
      )
      .fromTo(
        ".wph-mockup",
        { y: 40, autoAlpha: 0, scale: 0.96, rotateX: 8 },
        { y: 0, autoAlpha: 1, scale: 1, rotateX: 0, duration: GSAP_DURATION },
        "-=0.65"
      );

      // Floating animation for mockup
      gsap.to(mockupRef.current, {
        y: -20,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <section 
      ref={containerRef} 
      className="relative pt-32 pb-20 lg:pt-56 lg:pb-32 bg-ss-black overflow-hidden"
    >
      {/* Background Tech Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-3/4 h-full bg-[radial-gradient(circle_at_70%_30%,rgba(214,40,40,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 ss-noise opacity-30 pointer-events-none" />
        {/* Animated Background Line */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-linear-to-r from-transparent via-ss-white/5 to-transparent" />
      </div>

      <div className="ss-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          {/* Content Left */}
          <div className="lg:col-span-12 xl:col-span-6 relative z-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-px bg-ss-red" />
              <span className="text-[10px] font-black text-ss-red uppercase tracking-[0.4em]">Proprietary Technical Platform</span>
            </div>

            <h1 className="wph-title font-display text-4xl md:text-5xl lg:text-6xl xl:text-[4.5rem] text-balance break-words text-ss-pure-white font-black leading-[1.15] md:leading-[1.05] mb-10 tracking-tight drop-shadow-2xl">
              {data.headline.split('\n').map((line, i) => (
                <span key={i} className="block last:text-ss-red/90">
                  {line}
                  {i === data.headline.split('\n').length - 1 && <span className="text-ss-red">.</span>}
                </span>
              ))}
            </h1>

            <p className="wph-sub text-ss-grey-400 font-body text-lg lg:text-xl leading-relaxed mb-12 max-w-xl">
              {data.subheadline}
            </p>

            {/* Feature Tags */}
            {data.tags && (
              <div className="flex flex-wrap gap-3 mb-10">
                {data.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="wph-tag px-5 py-2.5 rounded-full border border-ss-white/10 bg-ss-white/5 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-ss-grey-300 hover:border-ss-red/50 hover:text-ss-red hover:bg-ss-red/5 transition-all duration-500 cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Live Demo CTA */}
            <a
              href={`/${locale}/portal-demo`}
              target="_blank"
              rel="noopener noreferrer"
              className="wph-cta group inline-flex items-center gap-3 px-8 py-4 rounded-full ss-gradient-red text-[#fff] font-bold text-sm uppercase tracking-[0.15em] shadow-[0_0_30px_rgba(214,40,40,0.3)] hover:shadow-[0_0_50px_rgba(214,40,40,0.5)] transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] mb-12 lg:mb-0"
            >
              <span>{isFr ? "Accéder à la Démo" : "Access Live Demo"}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Visual Mockup Right - Using more screen space on large displays */}
          <div className="lg:col-span-12 xl:col-span-6 perspective-[2000px] mt-8 lg:-mt-12 xl:-mt-24">
            <div ref={mockupRef} className="wph-mockup relative">
               {/* Underglow */}
               <div className="absolute -inset-10 bg-ss-red/10 blur-[100px] rounded-full pointer-events-none" />
               
               <div className="relative z-10 rounded-2xl border border-ss-white/10 bg-ss-charcoal p-3 shadow-[0_22px_48px_-16px_rgba(15,23,42,0.18)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] overflow-hidden">
                  {/* Fake Browser Top Bar */}
                  <div className="flex items-center gap-2 px-6 py-4 border-b border-ss-white/5 mb-3 bg-ss-charcoal-light/80 backdrop-blur-md">
                     <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-ss-grey-800" />
                        <div className="w-3 h-3 rounded-full bg-ss-grey-800" />
                        <div className="w-3 h-3 rounded-full bg-ss-grey-800" />
                     </div>
                     <div className="mx-auto bg-ss-black/50 border border-ss-white/5 rounded-md px-4 sm:px-12 py-1.5 text-[9px] text-ss-grey-500 font-mono tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-ss-red/40 animate-pulse" />
                        wave-plus.ssplus.tn
                     </div>
                  </div>

                  {/* Conceptual Dashboard Mockup */}
                  <div className="aspect-video bg-ss-black overflow-hidden relative rounded-lg">
                     <div className="absolute inset-0 p-8 flex flex-col gap-6">
                        {/* Top Row Stats */}
                        <div className="grid grid-cols-3 gap-6">
                           {[1, 2, 3].map(i => (
                              <div key={i} className="h-24 bg-ss-white/2 border border-ss-white/5 rounded-xl p-5 flex flex-col justify-between">
                                 <div className="w-1/2 h-1.5 bg-ss-white/5 rounded" />
                                 <div className={`w-3/4 h-8 ${i === 1 ? 'bg-ss-red/10' : 'bg-ss-white/5'} rounded-lg`} />
                              </div>
                           ))}
                        </div>
                        {/* Main Content Area */}
                        <div className="grow bg-ss-white/2 border border-ss-white/5 rounded-xl p-8 overflow-hidden relative">
                           <div className="flex justify-between items-center mb-10">
                              <div className="w-1/3 h-5 bg-ss-white/5 rounded-full" />
                              <div className="w-24 h-8 bg-ss-red/10 border border-ss-red/20 rounded-full" />
                           </div>
                           <div className="space-y-6">
                              {[1, 2, 3].map(i => (
                                 <div key={i} className="flex gap-6 items-center border-b border-ss-white/5 pb-6 last:border-0 opacity-40">
                                    <div className="w-12 h-12 rounded-xl bg-ss-white/5" />
                                    <div className="space-y-3 grow">
                                       <div className="w-1/2 h-3 bg-ss-white/10 rounded-full" />
                                       <div className="w-1/4 h-2 bg-ss-white/5 rounded-full" />
                                    </div>
                                    <div className="w-16 h-8 rounded-full border border-ss-white/10" />
                                 </div>
                              ))}
                           </div>
                           {/* Data Sweep Line */}
                           <div className="absolute inset-x-0 top-0 h-px bg-ss-red/20 animate-[sweep_4s_ease-in-out_infinite]" />
                        </div>
                     </div>
                     
                     {/* Dashboard Grid overlay */}
                     <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none" />
                  </div>
               </div>

               {/* Modern Industrial Tech Accents */}
               <div className="absolute -top-12 -right-12 w-64 h-64 bg-ss-red/5 rounded-full blur-[100px] pointer-events-none" />
               <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-ss-red/5 rounded-full blur-[120px] pointer-events-none" />
               <div className="hidden lg:flex absolute top-1/2 -right-4 translate-y-[-50%] flex-col gap-1.5">
                  {[1, 2, 3, 4, 5].map(i => (
                     <div key={i} className={`w-1 h-1 rounded-full ${i === 2 ? 'bg-ss-red' : 'bg-ss-white/10'}`} />
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

