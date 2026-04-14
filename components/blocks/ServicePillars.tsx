"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

/* ─── Types ──────────────────────────────────────────────── */

interface PillarItem {
  _key: string;
  title: string;
  description: string;
  details?: string[];
}

interface ServicePillarsProps {
  data: {
    pillars?: PillarItem[];
  };
  pageSlug?: string;
}

/* ─── Icon Map ───────────────────────────────────────────── */

/* ─── Icon Map ───────────────────────────────────────────── */

const pillarIcons: Record<string, React.ReactNode> = {
  fire: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </svg>
  ),
  inspection: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  ),
  consulting: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
    </svg>
  ),
  training: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15v-3.75m0 0l5.25 3 5.25-3" />
    </svg>
  ),
};

function getIcon(index: number): React.ReactNode {
  const keys = Object.keys(pillarIcons);
  return pillarIcons[keys[index % keys.length]];
}

/* ─── Component ──────────────────────────────────────────── */

export default function ServicePillars({ data, pageSlug }: ServicePillarsProps) {
  const t = useTranslations("ServicePillars");
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedPillar, setSelectedPillar] = useState<PillarItem | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const allowModals = pageSlug === "services" || pageSlug === "products";

  useGSAP(
    () => {
      if (!data.pillars?.length) return;

      // Section header
      gsap.fromTo(
        ".sp-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Cards stagger
      const cards = sectionRef.current?.querySelectorAll(".sp-card");
      if (cards?.length) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  // Modal Animation
  useGSAP(
    () => {
      if (selectedPillar && modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power2.out" }
        );
        gsap.fromTo(
          ".modal-content",
          { y: 50, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, delay: 0.1, ease: "power4.out" }
        );
      }
    },
    [selectedPillar]
  );

  const closeModal = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => setSelectedPillar(null),
    });
  };

  if (!data.pillars?.length) return null;

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-32 md:py-48 bg-ss-charcoal overflow-hidden"
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 ss-noise pointer-events-none" />

      {/* Red glow */}
      <div className="absolute right-0 top-0 w-150 h-150 bg-[radial-gradient(circle,rgba(214,40,40,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="ss-container relative z-10">
        {/* Header */}
        <div className="sp-header mb-16 max-w-2xl" style={{ opacity: 0 }}>
          <span className="inline-block text-xs text-ss-red uppercase tracking-[0.25em] font-semibold mb-4">
            {t("whatWeDo")}
          </span>
          <div className="ss-accent-line mb-6" />
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[1.05] text-ss-pure-white">
            {t("ourCorePillars")}
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.pillars.map((pillar, i) => (
            <article
              key={pillar._key}
              onClick={() => {
                console.log("Card clicked, allowModals:", allowModals);
                if (allowModals) setSelectedPillar(pillar);
              }}
              className={`sp-card group relative p-8 md:p-10 rounded-lg border border-white/5 bg-ss-grey-900/50 backdrop-blur-sm transition-all duration-500 hover:border-ss-red/30 hover:bg-ss-grey-900/80 ${
                allowModals ? "cursor-pointer" : ""
              }`}
              style={{ opacity: 0 }}
            >
              {/* Number watermark */}
              <span className="absolute top-6 right-8 font-display text-[5rem] font-extrabold text-white/3 leading-none select-none transition-colors duration-500 group-hover:text-ss-red/6">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-ss-red/10 text-ss-red flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-ss-red group-hover:text-[#fff] group-hover:shadow-[0_0_30px_rgba(214,40,40,0.2)]">
                {getIcon(i)}
              </div>

              {/* Content */}
              <h3 className="font-display text-xl md:text-2xl font-bold text-ss-pure-white mb-4 tracking-tight">
                {pillar.title}
              </h3>
              <p className="text-sm md:text-base text-ss-grey-300 leading-relaxed whitespace-pre-line">
                {pillar.description}
              </p>

              {allowModals && (
                <div className="mt-6 flex items-center gap-2 text-ss-red text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  {t("viewDetails")}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              )}

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-linear-to-r from-ss-red/0 via-ss-red/0 to-ss-red/0 transition-all duration-500 group-hover:from-ss-red/0 group-hover:via-ss-red group-hover:to-ss-red/0" />
            </article>
          ))}
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedPillar && (
        <div 
          ref={modalRef}
          className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-8 md:px-6 md:py-12 backdrop-blur-2xl bg-ss-black/95"
        >
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={closeModal} 
          />
          
          <div 
            data-lenis-prevent
            className="modal-content ss-scrollbar relative w-full max-w-3xl bg-ss-grey-900 border border-ss-grey-800 rounded-lg p-8 md:p-16 shadow-2xl overflow-y-auto max-h-[85vh] lg:max-h-[90vh]"
          >
            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 p-2 text-ss-grey-400 hover:text-ss-red hover:bg-ss-red/10 rounded-full transition-all"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-10">
              <span className="text-xs text-ss-red uppercase tracking-[0.25em] font-bold mb-4 block">
                {t("technicalDetail")}
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-black text-ss-white leading-[1.1]">
                {selectedPillar.title}
              </h2>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-ss-grey-300 leading-relaxed mb-12">
                {selectedPillar.description}
              </p>
              
              {selectedPillar.details && selectedPillar.details.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {selectedPillar.details.map((detail, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="w-5 h-5 mt-1 shrink-0 rounded-full border border-ss-red/50 flex items-center justify-center text-[10px] text-ss-red font-bold group-hover:bg-ss-red group-hover:text-[#fff] transition-colors">
                        {idx + 1}
                      </div>
                      <p className="text-ss-grey-400 text-sm md:text-base leading-snug">
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-16 pt-10 border-t border-ss-grey-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-ss-grey-500 text-xs uppercase tracking-widest font-medium">
                {t("certifiedIndustrialSafetySolution")}
              </p>
              <button 
                onClick={closeModal}
                className="px-8 py-3 bg-ss-red text-[#fff] text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm transition-all hover:bg-ss-red-dark hover:shadow-[0_0_20px_rgba(214,40,40,0.4)]"
              >
                {t("closeDetails")}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

