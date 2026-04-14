"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GSAP_DURATION, GSAP_EASE, GSAP_FAST_DURATION, SCROLL_TRIGGER_START } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger);

interface CoverageProps {
  data: {
    headline: string;
    description: string;
    note?: string;
  };
}

export default function Coverage({ data }: CoverageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Text Entrance
      gsap.fromTo(
        textRef.current,
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: GSAP_FAST_DURATION,
          ease: GSAP_EASE,
          scrollTrigger: {
            trigger: textRef.current,
            start: SCROLL_TRIGGER_START,
            once: true,
          },
        }
      );

      // Visual Entrance
      gsap.fromTo(
        mapContainerRef.current,
        { y: 30, scale: 0.98, autoAlpha: 0 },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: GSAP_DURATION,
          ease: GSAP_EASE,
          scrollTrigger: {
            trigger: mapContainerRef.current,
            start: SCROLL_TRIGGER_START,
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-ss-black overflow-hidden relative">
      <div className="ss-container grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Geographic Content */}
        <div ref={textRef} className="relative z-10 order-2 lg:order-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-ss-red" />
            <h2 className="text-sm font-bold text-ss-red uppercase tracking-[0.3em]">
              Geographic Presence
            </h2>
          </div>
          
          <h3 className="font-display text-4xl md:text-5xl lg:text-7xl text-ss-white font-bold leading-tight mb-8">
            {data.headline}
          </h3>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-ss-grey-300 font-body leading-relaxed mb-6">
              SS PLUS is strategically headquartered in <strong className="text-ss-white uppercase tracking-wider">Sfax</strong> — a coastal city in eastern Tunisia that serves as a major industrial and economic hub.
            </p>
            <p className="text-ss-grey-400 font-body leading-relaxed mb-6">
              To better serve our growing client base, we have established a strong secondary presence in the capital, <strong className="text-ss-white uppercase tracking-wider">Tunis</strong>. From these two strategic centers, our teams provide rapid-response coverage to every industrial zone in the country.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-8">
             <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-ss-red rounded-full shadow-[0_0_15px_rgba(240,68,56,0.5)]" />
                <div className="flex flex-col">
                   <span className="text-ss-white font-bold text-sm uppercase tracking-widest">Main HQ</span>
                   <span className="text-ss-grey-500 text-xs">Sfax, Tunisia</span>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-ss-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                <div className="flex flex-col">
                   <span className="text-ss-white font-bold text-sm uppercase tracking-widest">Business Hub</span>
                   <span className="text-ss-grey-500 text-xs">Tunis, Capital</span>
                </div>
             </div>
          </div>
        </div>

        {/* Visual Map/Design Element */}
        <div ref={mapContainerRef} className="relative aspect-square lg:aspect-auto h-80 sm:h-100 lg:h-full min-h-80 lg:min-h-120 bg-ss-grey-900/50 border border-ss-grey-800 rounded-sm overflow-hidden flex items-center justify-center p-8 order-1 lg:order-2">
           {/* Abstract representational design of Tunisia coverage */}
           <div className="absolute inset-0 grayscale opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e3/Tunisia_location_map.svg')] bg-center bg-no-repeat bg-contain" />
           
           <div className="relative z-10 w-full h-full">
              {/* Sfax Hub (East Coast) */}
              <div className="absolute top-[33%] left-[67%] -translate-x-1/2 -translate-y-1/2">
                 <div className="w-8 h-8 bg-ss-red rounded-full animate-ping absolute inset-0 opacity-20" />
                 <div className="w-8 h-8 border-2 border-ss-red/30 rounded-full absolute inset-0 scale-150 opacity-10 animate-[ping_3s_linear_infinite]" />
                 <div className="w-8 h-8 bg-ss-red rounded-full relative shadow-[0_0_30px_rgba(240,68,56,0.8)] flex items-center justify-center">
                    <div className="w-2 h-2 bg-ss-white rounded-full" />
                 </div>
                 <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-ss-black/80 backdrop-blur-md border border-ss-red/30 px-3 py-1 rounded-sm">
                    <span className="text-ss-white font-bold text-[10px] uppercase tracking-tighter">HQ: SFAX</span>
                 </div>
              </div>

              {/* Tunis Hub (North) */}
              <div className="absolute top-[7%] left-[58%] -translate-x-1/2 -translate-y-1/2">
                 <div className="w-6 h-6 bg-ss-white rounded-full animate-ping absolute inset-0 opacity-20" />
                 <div className="w-6 h-6 bg-ss-white/20 rounded-full relative border border-white/30 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-ss-white rounded-full" />
                 </div>
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-ss-black/80 backdrop-blur-md border border-white/20 px-3 py-1 rounded-sm">
                    <span className="text-ss-white font-bold text-[10px] uppercase tracking-tighter">HUB: TUNIS</span>
                 </div>
              </div>
           </div>
           
           <div className="absolute bottom-8 right-8 text-right">
              <p className="text-ss-grey-500 font-display text-4xl font-black uppercase opacity-10 leading-none">
                 NATIONWIDE<br/>REACH
              </p>
           </div>
        </div>
      </div>
    </section>
  );
}
