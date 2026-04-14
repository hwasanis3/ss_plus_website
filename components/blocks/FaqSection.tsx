"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface FaqItem {
  _key: string;
  question: string;
  answer: string;
}

interface FaqSectionProps {
  data: {
    title?: string;
    faqs?: FaqItem[];
  };
}

export default function FaqSection({ data }: FaqSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useGSAP(
    () => {
      if (!data.faqs?.length) return;

      // Cards staggered entrance with fromTo for reliability
      gsap.fromTo(
        ".faq-item",
        { y: 30, autoAlpha: 0, scale: 0.98 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            once: true,
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );
    },
    { scope: sectionRef, dependencies: [data.faqs] }
  );

  if (!data.faqs?.length) return null;

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-ss-black overflow-hidden border-t border-ss-white/5 relative">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(214,40,40,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="ss-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Header */}
          <div className="lg:col-span-12 xl:col-span-4 flex flex-col justify-start">
             <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-px bg-ss-red shadow-[0_0_10px_rgba(214,40,40,0.4)]" />
              <h2 className="text-[11px] font-black text-ss-red uppercase tracking-[0.4em]">
                 Knowledge Protocol
              </h2>
            </div>
            
            <h3 className="font-display text-4xl md:text-5xl lg:text-7xl text-ss-pure-white font-extrabold leading-[1.15] md:leading-[1.05] mb-12 tracking-tight drop-shadow-2xl">
               {data.title || "Common Questions."}
            </h3>
            
            <p className="text-ss-grey-400 font-body text-xl lg:text-2xl leading-relaxed mb-16 max-w-sm border-l-2 border-ss-white/10 pl-8 group-hover:border-ss-red transition-colors duration-1000">
               Quick answers to the most frequent inquiries from our industrial and commercial partners.
            </p>

            <div className="flex items-center gap-6 group cursor-default pt-10 border-t border-ss-white/5">
               <div className="w-12 h-12 rounded-2xl border border-ss-white/10 bg-ss-white/5 flex items-center justify-center group-hover:bg-ss-red group-hover:border-ss-red transition-all duration-700 shadow-2xl relative overflow-hidden group/help">
                  <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent group-hover:translate-y-full transition-transform duration-1000" />
                  <span className="text-ss-red group-hover:text-ss-pure-white font-black text-xs relative z-10">?</span>
               </div>
               <div className="flex flex-col gap-1">
                 <span className="text-[10px] text-ss-grey-600 uppercase tracking-[0.4em] font-black group-hover:text-ss-red transition-colors duration-500">Resource access</span>
                 <p className="text-ss-pure-white font-black text-[11px] uppercase tracking-[0.2em]">Help Center System</p>
               </div>
            </div>
          </div>

          {/* FAQ Accordion — Premium Technical Execution */}
          <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-6">
             {data.faqs.map((faq, idx) => (
                <div 
                  key={faq._key}
                  className="faq-item bg-ss-charcoal/60 backdrop-blur-3xl border border-ss-white/5 rounded-xl sm:rounded-[2rem] overflow-hidden transition-all duration-700 hover:border-ss-red/30 group hover:shadow-[0_16px_35px_rgba(15,23,42,0.14)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                   <button 
                     onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                     className="w-full p-6 sm:p-10 md:p-12 lg:p-14 flex justify-between items-center text-left group/btn"
                   >
                      <h4 className={`font-display text-2xl lg:text-3xl font-black transition-all duration-500 tracking-tight leading-tight ${openIndex === idx ? 'text-ss-red' : 'text-ss-pure-white group-hover/btn:text-ss-red'}`}>
                         {faq.question}
                      </h4>
                      
                      {/* Technical Switch Indicator */}
                      <div className="relative w-8 h-8 flex items-center justify-center ml-8 shrink-0">
                         <div className={`absolute w-full h-px bg-ss-white/20 group-hover/btn:bg-ss-red transition-all duration-500 transform ${openIndex === idx ? 'rotate-180' : 'rotate-90'}`} />
                         <div className={`absolute w-full h-px bg-ss-white/20 group-hover/btn:bg-ss-red transition-all duration-500`} />
                         {openIndex === idx && <div className="absolute inset-0 bg-ss-red/20 blur-xl animate-pulse" />}
                      </div>
                   </button>
                   
                   <div 
                     className={`transition-all duration-700 ease-in-out ${openIndex === idx ? 'max-h-[800px] opacity-100 p-6 sm:p-10 md:p-12 lg:p-14 pt-0' : 'max-h-0 opacity-0 pointer-events-none'}`}
                   >
                      <div className="flex gap-10">
                        <div className="w-1.5 bg-ss-red/20 group-hover:bg-ss-red transition-colors duration-1000 shrink-0" />
                        <p className="text-ss-grey-400 font-body text-xl lg:text-2xl leading-relaxed max-w-4xl group-hover:text-ss-grey-200 transition-colors duration-500">
                           {faq.answer}
                        </p>
                      </div>
                   </div>
                </div>
             ))}
          </div>

        </div>
      </div>
    </section>
  );
}

