"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface CoreValuesProps {
  data: {
    values: string[];
  };
}

export default function CoreValues({ data }: CoreValuesProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Header Animation
      const header = sectionRef.current?.querySelector(".core-header");
      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // Staggered reveal of cards
      const cards = sectionRef.current?.querySelectorAll(".core-card");
      if (cards?.length) {
        gsap.fromTo(
          cards,
          { 
            y: 50, 
            opacity: 0, 
            scale: 0.95,
            filter: "blur(4px)" 
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            stagger: 0.12,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-ss-black border-t border-ss-grey-800/30 overflow-hidden">
      <div className="ss-container">
        <div className="core-header max-w-4xl mb-16 lg:mb-24" style={{ opacity: 0 }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-ss-red" />
            <h2 className="text-xs font-bold text-ss-red uppercase tracking-[0.3em]">
              The Bedrock of SS PLUS
            </h2>
          </div>
          <h3 className="font-display text-3xl md:text-5xl lg:text-7xl text-ss-white font-bold leading-[1.15]">
            Safety isn&apos;t a practice. It&apos;s a value.
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
          {data.values.map((value, idx) => {
            const [title, description] = value.includes(" - ") 
              ? value.split(" - ") 
              : value.split(" – "); // handle both hyphens

            return (
              <div
                key={idx}
                className="core-card relative p-6 lg:p-8 bg-ss-grey-900 border border-ss-grey-800 rounded-sm hover:border-ss-red/50 transition-all duration-500 overflow-hidden group flex flex-col"
                style={{ opacity: 0 }}
              >
                {/* Number inside background */}
                <span className="absolute top-4 right-4 text-4xl font-display font-black text-ss-red/5 select-none transition-colors duration-500 group-hover:text-ss-red/10">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <div className="relative z-10 flex flex-col h-full">
                  <h4 className="font-display text-lg lg:text-xl text-ss-white font-bold mb-4 leading-tight">
                    {title}
                  </h4>
                  <p className="text-ss-grey-400 leading-relaxed font-body text-sm line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                    {description}
                  </p>
                </div>

                {/* Subtle bottom accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-ss-red transition-all duration-700 ease-out group-hover:w-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
