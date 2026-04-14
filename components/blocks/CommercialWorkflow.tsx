"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface WorkflowStep {
  _key: string;
  label: string;
  title: string;
  description: string;
}

interface CommercialWorkflowProps {
  data: {
    sectionLabel?: string;
    title?: string;
    description?: string;
    steps?: WorkflowStep[];
  };
}

export default function CommercialWorkflow({ data }: CommercialWorkflowProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Header Animation
      gsap.fromTo(
        ".cw-header",
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Steps Stagger
      const steps = stepsRootRef.current?.querySelectorAll(".cw-step");
      if (steps?.length) {
        steps.forEach((step) => {
          gsap.fromTo(
            step,
            { x: -20, autoAlpha: 0 },
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: step,
                start: "top 85%",
                once: true,
              },
            }
          );
        });
      }
    },
    { scope: sectionRef }
  );

  if (!data.steps?.length) return null;

  return (
    <section ref={sectionRef} className="py-24 lg:py-40 bg-ss-black overflow-hidden border-t border-ss-grey-800/30">
      <div className="ss-container">
        {/* Header */}
        <div className="cw-header max-w-3xl mb-20 lg:mb-32">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-ss-red" />
            <h2 className="text-sm font-bold text-ss-red uppercase tracking-[0.3em]">
              {data.sectionLabel || "Process"}
            </h2>
          </div>
          <h3 className="font-display text-4xl md:text-5xl lg:text-7xl text-ss-white font-bold leading-tight mb-8">
            {data.title}
          </h3>
          <p className="text-ss-grey-400 text-lg md:text-xl font-body leading-relaxed max-w-2xl">
            {data.description}
          </p>
        </div>

        {/* Steps Visualization */}
        <div ref={stepsRootRef} className="relative space-y-4">
          {data.steps.map((step, idx) => (
            <div 
              key={step._key}
              className="cw-step group relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 p-6 md:p-10 bg-ss-grey-900/30 border border-ss-grey-800/50 rounded-sm hover:bg-ss-grey-900 transition-all duration-500"
            >
              {/* Step Index Area */}
              <div className="md:col-span-2 flex md:flex-col items-center md:items-start justify-between md:justify-start gap-4">
                <span className="font-display text-4xl lg:text-5xl font-black text-ss-white/10 group-hover:text-ss-red/20 transition-colors duration-500 leading-none">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-ss-red px-2 py-1 border border-ss-red/30 rounded-full">
                   {step.label}
                </span>
              </div>

              {/* Step Content */}
              <div className="md:col-span-10">
                <h4 className="font-display text-xl lg:text-2xl text-ss-white font-bold mb-4 group-hover:text-ss-red transition-colors duration-500">
                  {step.title}
                </h4>
                <p className="text-ss-grey-400 font-body leading-relaxed max-w-3xl lg:text-lg">
                  {step.description}
                </p>
              </div>

              {/* Background Accent Numbers */}
               <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <span className="font-display text-[120px] font-black text-ss-red/5 select-none rotate-6 block">
                    {step.label.split(' ')[0]}
                  </span>
               </div>
            </div>
          ))}
        </div>

        {/* Flow end note */}
        <div className="mt-20 text-center">
           <div className="inline-block p-8 bg-ss-red/5 border border-ss-red/20 max-w-2xl">
              <p className="text-ss-grey-300 font-body italic leading-relaxed">
                 &ldquo;This comprehensive workflow reflects the commitment of SS PLUS to a holistic safety solution — from initial inquiry to ongoing post-service support.&rdquo;
              </p>
           </div>
        </div>
      </div>
    </section>
  );
}
