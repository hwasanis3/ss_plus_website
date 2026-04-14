"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ProductModal from "@/components/ui/ProductModal";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  _key: string;
  name: string;
  description: string;
  category?: string;
  specs?: Array<{ label: string; value: string }>;
}

interface ProductGridProps {
  data: {
    sectionLabel?: string;
    title?: string;
    products?: Product[];
  };
}

export default function ProductGrid({ data }: ProductGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  useGSAP(
    () => {
      if (!data.products?.length) return;

      // Header entrance
      gsap.fromTo(
        ".pg-header",
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

      // Products staggered entrance
      gsap.fromTo(
        ".pg-item",
        { y: 50, autoAlpha: 0, scale: 0.98 },
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
    { scope: sectionRef, dependencies: [data.products] }
  );

  if (!data.products?.length) return null;

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-ss-black relative overflow-hidden">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none opacity-30" />
      <div className="absolute top-0 right-0 w-full h-125 bg-linear-to-b from-ss-black via-transparent to-transparent z-0 pointer-events-none" />

      <div className="ss-container relative z-10">
        {/* Header */}
        <div className="pg-header mb-24 text-center mx-auto max-w-4xl">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-ss-red" />
            <h2 className="text-[11px] font-bold text-ss-red uppercase tracking-[0.4em]">
              {data.sectionLabel || "Catalogue"}
            </h2>
            <div className="w-8 h-px bg-ss-red" />
          </div>
          <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-ss-pure-white font-extrabold leading-tight tracking-tight">
            {data.title || "Featured Industrial Equipment"}
          </h3>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
          {data.products.map((prod, idx) => (
            <div 
              key={prod._key || idx}
              className="pg-item group relative bg-ss-charcoal rounded-xl overflow-hidden border border-ss-white/5 transition-all duration-500 hover:border-ss-red/30 flex flex-col h-full hover:shadow-[0_20px_40px_-15px_rgba(214,40,40,0.15)] hover:-translate-y-2 cursor-pointer"
              onClick={() => openProductModal(prod)}
            >
               {/* Technical Blueprint Placeholder */}
               <div className="h-48 lg:h-56 bg-ss-charcoal-light relative overflow-hidden flex items-center justify-center border-b border-ss-white/5">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(214,40,40,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(214,40,40,0.05)_1px,transparent_1px)] bg-size-[16px_16px] group-hover:bg-size-[20px_20px] transition-all duration-1000 opacity-50 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-radial-gradient(circle_at_center,transparent_0%,var(--ss-charcoal-light)_100%) opacity-80" />
                  
                  {/* Central Technical Icon */}
                  <div className="relative z-10 w-24 h-24 rounded-full border border-ss-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-ss-red/40 transition-all duration-700 bg-ss-black/50 backdrop-blur-sm shadow-[0_0_14px_rgba(15,23,42,0.18)] dark:shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                     <svg className="w-10 h-10 text-ss-white/30 group-hover:text-ss-red drop-shadow-[0_0_10px_rgba(214,40,40,0)] group-hover:drop-shadow-[0_0_10px_rgba(214,40,40,0.8)] transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                     </svg>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 block">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-ss-white/50 bg-ss-black/60 px-2 py-1 rounded backdrop-blur-md border border-ss-white/5 group-hover:text-ss-pure-white group-hover:border-ss-red/20 transition-all duration-500 shadow-sm">
                      {(prod.category || 'Equipment').split('-').pop()}
                    </span>
                  </div>
               </div>

               {/* Content Area */}
               <div className="p-8 flex flex-col grow relative bg-ss-charcoal">
                  <h4 className="font-display text-xl lg:text-2xl text-ss-pure-white font-bold mb-3 group-hover:text-ss-red transition-colors duration-400 leading-tight">
                     {prod.name || "Unnamed Product"}
                  </h4>
                  <p className="text-ss-grey-400 font-body text-[13px] leading-relaxed mb-6 line-clamp-3 min-h-15 group-hover:text-ss-grey-300 transition-colors duration-500">
                     {prod.description || "Certified safety equipment engineered for demanding industrial environments and strict regulatory compliance."}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-ss-white/5 flex items-center justify-between group-hover:border-ss-white/10 transition-colors duration-500">
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ss-white hover:text-ss-red transition-colors duration-300 flex items-center gap-2 group/btn">
                        Technical Specs
                        <div className="w-6 h-6 rounded-full bg-ss-white/5 group-hover:bg-ss-red/10 flex items-center justify-center transition-colors duration-300">
                          <svg className="w-3 h-3 text-ss-red transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </span>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </section>
  );
}

