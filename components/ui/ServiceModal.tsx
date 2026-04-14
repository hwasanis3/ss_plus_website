"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    title: string;
    details?: string[];
  } | null;
}

export default function ServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const tl = gsap.timeline();
      tl.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" })
        .fromTo(contentRef.current, 
          { y: 50, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" },
          "-=0.1"
        );
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: onClose
    });
    tl.to(contentRef.current, { y: 30, opacity: 0, scale: 0.98, duration: 0.3, ease: "power3.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
  };

  if (!isOpen || !service) return null;

  return (
    <div ref={modalRef} className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8">
      {/* Overlay */}
      <div 
        ref={overlayRef}
        onClick={handleClose}
        className="absolute inset-0 bg-ss-black/95 backdrop-blur-sm opacity-0" 
      />

      {/* Content */}
      <div 
        ref={contentRef}
        className="relative w-full max-w-3xl bg-ss-grey-950 border border-ss-grey-800 rounded-sm shadow-2xl overflow-hidden opacity-0"
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 text-ss-grey-400 hover:text-ss-white transition-colors duration-300 z-20"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 md:p-12 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-ss-red" />
            <h2 className="text-sm font-bold text-ss-red uppercase tracking-[0.3em]">
              Service Details
            </h2>
          </div>

          <h3 className="font-display text-3xl md:text-5xl text-ss-white font-bold leading-tight mb-10">
            {service.title}
          </h3>

          {service.details && (
            <div className="space-y-8">
              <div>
                <h4 className="text-ss-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 bg-ss-red rounded-full" />
                  What&apos;s Included
                </h4>
                <ul className="space-y-6">
                  {service.details.map((detail, idx) => {
                    const [label, desc] = detail.includes(": ") ? detail.split(": ") : [null, detail];
                    return (
                      <li key={idx} className="group">
                        <div className="flex gap-4">
                           <span className="text-ss-red font-display font-bold text-lg leading-tight">0{idx + 1}.</span>
                           <div>
                              {label && <strong className="text-ss-white block mb-1 text-lg">{label}</strong>}
                              <p className="text-ss-grey-400 font-body leading-relaxed">
                                {desc}
                              </p>
                           </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-12 pt-12 border-t border-ss-grey-800 flex flex-col md:flex-row gap-6 items-center">
             <Link 
               href="/contact" 
               className="w-full md:w-auto px-10 py-4 bg-ss-red text-ss-white font-bold uppercase tracking-widest text-sm text-center hover:bg-ss-red/90 transition-all duration-300"
               onClick={onClose}
             >
                Schedule an Inspection
             </Link>
             <p className="text-ss-grey-500 text-xs uppercase tracking-widest font-semibold">
                Available 24/7 for urgent requests
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
