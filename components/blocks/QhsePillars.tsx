'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface Pillar {
  _key: string;
  label: string;
  title: string;
  description: string;
  points?: string[];
}

interface QhsePillarsProps {
  data: {
    pillars?: Pillar[];
  };
}

export default function QhsePillars({ data }: QhsePillarsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!data.pillars?.length) return;

      // Cards staggered entrance with fromTo for reliability
      gsap.fromTo(
        '.qp-card',
        { y: 60, autoAlpha: 0, scale: 0.96 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'expo.out',
          scrollTrigger: {
            once: true,
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );

      // Background letters animation
      gsap.fromTo(
        '.qp-letter',
        { scale: 0.8, autoAlpha: 0, y: 20 },
        {
          scale: 1,
          autoAlpha: 0.4,
          y: 0,
          duration: 1.5,
          stagger: 0.2,
          ease: 'expo.out',
          scrollTrigger: {
            once: true,
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    },
    { scope: sectionRef, dependencies: [data.pillars] }
  );

  if (!data.pillars?.length) return null;

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-32 bg-ss-black overflow-hidden border-t border-ss-white/5 relative"
    >
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,40,40,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="ss-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {data.pillars.map((pillar, idx) => (
            <div
              key={pillar._key}
              className="qp-card group relative p-10 lg:p-12 bg-ss-charcoal/70 backdrop-blur-md border border-ss-white/5 rounded-2xl hover:border-ss-red/30 transition-all duration-700 flex flex-col h-full hover:shadow-[0_20px_50px_-10px_rgba(214,40,40,0.1)]"
            >
              {/* Background Letter Indicator - High End Refinement */}
              <div className="qp-letter absolute -top-4 -right-2 pointer-events-none select-none opacity-10">
                <span className="font-display text-[140px] font-black text-ss-white leading-none block mix-blend-overlay">
                  {pillar.label}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-ss-white/10 mb-10 group-hover:bg-ss-red group-hover:border-ss-red group-hover:shadow-[0_0_20px_rgba(214,40,40,0.4)] transition-all duration-500 bg-ss-white/5">
                  <span className="text-ss-white font-mono text-sm font-bold">
                    0{idx + 1}
                  </span>
                </div>

                <h4 className="font-display text-2xl lg:text-3xl text-ss-pure-white font-black mb-1 group-hover:text-ss-red transition-colors duration-500 leading-tight uppercase tracking-tight">
                  {pillar.label === 'Q' && 'Quality'}
                  {pillar.label === 'H' && 'Health'}
                  {pillar.label === 'S' && 'Safety'}
                  {pillar.label === 'E' && 'Environ.'}
                </h4>
                <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-ss-red mb-8 opacity-60 group-hover:opacity-100 transition-opacity">
                  {pillar.title}
                </div>

                <p className="text-ss-grey-400 font-body text-[15px] leading-relaxed mb-10 group-hover:text-ss-grey-200 transition-colors duration-500">
                  {pillar.description}
                </p>

                {pillar.points && (
                  <ul className="space-y-4 pt-10 border-t border-ss-white/5 group-hover:border-ss-white/10 transition-colors duration-500">
                    {pillar.points.map((point, pIdx) => (
                      <li
                        key={pIdx}
                        className="flex items-start gap-4 text-[11px] uppercase tracking-[0.15em] font-bold text-ss-white/40 group-hover:text-ss-white/70 transition-all duration-500"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-ss-red mt-1 sm:mt-1.5 shadow-[0_0_8px_rgba(214,40,40,0.5)]" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Premium Corner Accent */}
              <div className="absolute top-0 right-0 w-0 h-px bg-ss-red group-hover:w-16 transition-all duration-700" />
              <div className="absolute top-0 right-0 w-px h-0 bg-ss-red group-hover:h-16 transition-all duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

