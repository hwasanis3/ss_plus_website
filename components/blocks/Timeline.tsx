"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GSAP_DURATION, GSAP_EASE, GSAP_FAST_DURATION, SCROLL_TRIGGER_START } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger);

interface Milestone {
  _id: string;
  year: string;
  description: string;
}

interface TimelineProps {
  data: {
    milestones: Milestone[];
  };
}

export default function Timeline({ data }: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Title Block Animation
      const header = sectionRef.current?.querySelector(".timeline-header");
      if (header) {
        gsap.from(header, {
          opacity: 0,
          y: 40,
          duration: GSAP_FAST_DURATION,
          ease: GSAP_EASE,
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: SCROLL_TRIGGER_START,
            once: true,
          },
        });
      }

      // Timeline Line Animation
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top",
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            once: true,
            trigger: sectionRef.current,
            start: "top 25%",
            end: "bottom 75%",
            scrub: 1,
          }
        }
      );

      // Items Animation
      const items = sectionRef.current?.querySelectorAll(".timeline-item");
      if (items?.length) {
        items.forEach((item) => {
          gsap.from(item, {
            y: 24,
            autoAlpha: 0,
            duration: GSAP_DURATION,
            ease: GSAP_EASE,
            immediateRender: false,
            scrollTrigger: {
              trigger: item,
              start: SCROLL_TRIGGER_START,
              toggleActions: "play none none none",
              once: true,
            },
          });
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-ss-black relative overflow-hidden">
      <div className="ss-container relative">
        <div className="timeline-header text-center mb-20 lg:mb-32">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-ss-red" />
            <h2 className="text-xs font-bold text-ss-red uppercase tracking-[0.3em]">
              The SS PLUS Journey
            </h2>
            <div className="w-12 h-px bg-ss-red" />
          </div>
          <h3 className="font-display text-3xl md:text-5xl lg:text-7xl text-ss-white font-bold leading-[1.15]">
            History in the Making
          </h3>
        </div>

        {/* The Center Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-75 bottom-0 w-px bg-ss-grey-800 hidden md:block">
          <div ref={lineRef} className="absolute inset-0 w-full bg-ss-red origin-top" />
        </div>

        <div className="space-y-24 lg:space-y-40 relative">
          {data.milestones?.map((milestone, idx) => (
            <div
              key={milestone._id || idx}
              className={`timeline-item flex flex-col md:flex-row items-center gap-8 lg:gap-16 ${
                idx % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Year Side */}
              <div className="flex-1 text-center md:text-right">
                <div className={`inline-block ${idx % 2 === 1 ? "md:text-left" : "md:text-right"}`}>
                  <span className="font-display text-6xl lg:text-8xl font-black text-ss-white/35 block leading-none mb-2">
                    {milestone.year}
                  </span>
                  <div className="w-12 h-1 bg-ss-red mx-auto md:ml-auto md:mr-0 rounded-full" />
                </div>
              </div>

              {/* Center Dot (Mobile Hidden) */}
              <div className="relative z-10 hidden md:block">
                <div className="w-4 h-4 bg-ss-black border-2 border-ss-red rounded-full" />
              </div>

              {/* Description Side */}
              <div className="flex-1">
                <div className="p-8 bg-ss-grey-900/50 border border-ss-grey-800 rounded-sm backdrop-blur-sm">
                  <p className="text-ss-grey-300 leading-relaxed font-body text-lg">
                    {milestone.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
