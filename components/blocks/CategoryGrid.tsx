"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface Category {
  _id: string;
  title: string;
  description: string;
  image?: string;
  tags?: string[];
}

interface CategoryGridProps {
  data: {
    title?: string;
    categories?: Category[];
  };
}

export default function CategoryGrid({ data }: CategoryGridProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!data.categories?.length) return;

      // Title animation using fromTo for reliability
      gsap.fromTo(
        ".cg-title",
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

      // Cards staggered entrance
      gsap.fromTo(
        ".cg-card",
        { y: 50, autoAlpha: 0, scale: 0.95 },
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
    },
    { scope: sectionRef, dependencies: [data.categories] }
  );

  if (!data.categories?.length) return null;

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-ss-black relative">
      {/* Background visual elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(214,40,40,0.05)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 right-10 w-[400px] h-[400px] bg-ss-red/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="ss-container relative z-10">
        {/* Header */}
        <div className="cg-title mb-20 lg:mb-32 pl-4 border-l border-ss-red/30">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-[11px] font-bold text-ss-red uppercase tracking-[0.5em]">
              Product Families
            </h2>
          </div>
          <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-ss-white font-extrabold tracking-tight max-w-3xl leading-[1.1]">
            {data.title || "Safety Solutions for Every Sector"}
          </h3>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {data.categories.map((cat, idx) => (
            <div 
              key={cat._id || idx}
              className="cg-card group relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-ss-grey-950 border border-ss-white/5 transition-all duration-700 hover:border-ss-red/40 hover:shadow-[0_0_40px_rgba(214,40,40,0.1)] cursor-pointer"
            >
              {/* Image Layer with Zoom & Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-[1.03] opacity-50 grayscale group-hover:grayscale-[0.2] group-hover:opacity-80 mix-blend-luminosity group-hover:mix-blend-normal"
                style={{ backgroundImage: cat.image ? `url(${cat.image})` : 'none' }}
              />
              
              {/* Premium Gradient Scrims */}
              <div className="absolute inset-0 bg-linear-to-t from-ss-black via-ss-black/60 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-tr from-ss-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              {/* Interactive Glass Panel on bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 ss-glass border-t border-ss-white/5 group-hover:border-ss-white/10 transition-colors duration-500 transform translate-y-2 group-hover:translate-y-0">
                 {/* Tags */}
                 <div className="flex flex-wrap gap-2 mb-6 items-center">
                    {cat.tags?.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="text-[10px] font-bold uppercase tracking-[0.15em] text-ss-white/80 bg-ss-white/5 px-3 py-1.5 rounded border border-ss-white/10 backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                 </div>

                 <h4 className="font-display text-3xl lg:text-4xl text-ss-pure-white font-bold mb-4 leading-tight group-hover:text-ss-red transition-colors duration-500">
                    {cat.title || "Untitled Category"}
                 </h4>

                 <p className="text-ss-grey-300 font-body text-sm lg:text-base leading-relaxed max-w-sm mb-8 opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                    {cat.description || "No description available."}
                 </p>

                 {/* Arrow Indicator */}
                 <div className="flex items-center gap-4 origin-left scale-95 group-hover:scale-100 transition-transform duration-500">
                    <div className="w-10 h-10 rounded-full bg-ss-red text-[#fff] flex items-center justify-center transform -rotate-45 group-hover:rotate-0 transition-transform duration-500 shadow-lg shadow-ss-red/20">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                       </svg>
                    </div>
                    <span className="text-[10px] font-bold text-ss-pure-white uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                       View Solutions
                    </span>
                 </div>
              </div>

               {/* Geometric Asset ID */}
               <div className="absolute top-6 right-6 px-3 py-1.5 ss-glass border border-ss-white/10 rounded backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                  <span className="text-[8px] font-mono text-ss-white/50 uppercase tracking-widest">
                    FAM_0{(idx + 1).toString()}
                  </span>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

