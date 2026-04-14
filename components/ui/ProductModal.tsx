"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

interface ProductSpec {
  label: string;
  value: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    description: string;
    specs?: ProductSpec[];
  } | null;
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
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

  if (!isOpen || !product) return null;

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
        className="relative w-full max-w-4xl bg-ss-grey-950 border border-ss-grey-800 rounded-sm shadow-2xl overflow-hidden opacity-0"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 max-h-[90vh]">
          {/* Visual Side (Placeholder for now) */}
          <div className="relative bg-ss-grey-900 border-r border-ss-grey-800 hidden lg:flex items-center justify-center p-20">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
             <div className="w-full aspect-square bg-ss-black/40 border border-ss-red/20 flex items-center justify-center relative group">
                <span className="text-ss-red/20 font-black text-8xl select-none group-hover:text-ss-red/ transition-colors duration-700">SPEC</span>
                <div className="absolute inset-0 flex items-center justify-center">
                   <svg className="w-32 h-32 text-ss-red/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                   </svg>
                </div>
             </div>
          </div>

          {/* Details Side */}
          <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar bg-ss-grey-950">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-ss-red" />
              <h2 className="text-sm font-bold text-ss-red uppercase tracking-[0.3em]">
                Product Specifications
              </h2>
            </div>

            <h3 className="font-display text-3xl md:text-4xl text-ss-white font-bold leading-tight mb-8">
              {product.name}
            </h3>

            <p className="text-ss-grey-400 font-body leading-relaxed mb-10 text-lg">
               {product.description}
            </p>

            {product.specs && (
              <div className="space-y-6">
                <h4 className="text-ss-white font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-3">
                  <span className="w-2 h-2 bg-ss-red rounded-full" />
                  Technical Data Sheet
                </h4>
                <div className="grid grid-cols-1 gap-1">
                  {product.specs.map((spec, idx) => (
                    <div key={idx} className="flex justify-between items-center py-4 border-b border-ss-grey-800/50 hover:bg-ss-white/5 px-2 transition-colors duration-300">
                      <span className="text-ss-grey-500 text-sm uppercase tracking-wider font-bold">{spec.label}</span>
                      <span className="text-ss-white font-mono text-sm">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 pt-12 border-t border-ss-grey-800 flex flex-col gap-6">
               <Link 
                 href="/contact" 
                 className="w-full px-10 py-4 bg-ss-red text-ss-white font-bold uppercase tracking-widest text-sm text-center hover:bg-ss-red/90 transition-all duration-300"
                 onClick={onClose}
               >
                  Request a Quote
               </Link>
               <div className="flex items-center justify-center gap-2 text-ss-grey-500 text-[10px] uppercase tracking-widest font-bold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Certified Industrial Equipment
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
