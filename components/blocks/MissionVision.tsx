"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

interface MissionVisionProps {
  data: {
    mission: string;
    vision: string;
  };
}

export default function MissionVision({ data }: MissionVisionProps) {
  const t = useTranslations("MissionVision");
  const sectionRef = useRef<HTMLElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Mission Entrance
      gsap.fromTo(
        missionRef.current,
        { x: -50, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: missionRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      // Vision Entrance
      gsap.fromTo(
        visionRef.current,
        { x: 50, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: visionRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-ss-black overflow-hidden relative">
      <div className="ss-container grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-stretch">
        {/* Mission */}
        <div ref={missionRef} className="relative group flex flex-col h-full">
          <div className="absolute -top-6 -left-6 text-7xl font-display font-black text-ss-red/5 select-none transition-colors duration-500 group-hover:text-ss-red/10">
            01
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-ss-red" />
              <h2 className="text-xs font-bold text-ss-red uppercase tracking-[0.3em]">
                {t("ourMission")}
              </h2>
            </div>
            <p className="font-body text-lg md:text-xl text-ss-grey-300 leading-relaxed mb-6">
              {data.mission}
            </p>
            <div className="mt-auto pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <span className="text-[10px] text-ss-red uppercase tracking-widest font-black">{t("committedToExcellence")}</span>
            </div>
          </div>
        </div>

        {/* Vision */}
        <div ref={visionRef} className="relative group flex flex-col h-full">
          <div className="absolute -top-6 -left-6 text-7xl font-display font-black text-ss-red/5 select-none transition-colors duration-500 group-hover:text-ss-red/10">
            02
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-ss-red" />
              <h2 className="text-xs font-bold text-ss-red uppercase tracking-[0.3em]">
                {t("ourVision")}
              </h2>
            </div>
            <p className="font-body text-lg md:text-xl text-ss-grey-300 leading-relaxed mb-6">
              {data.vision}
            </p>
            <div className="mt-auto pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <span className="text-[10px] text-ss-red uppercase tracking-widest font-black">{t("pavingTheFuture")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-ss-red/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}
