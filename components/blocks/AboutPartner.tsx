"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface AboutPartnerProps {
  data: {
    headline?: string;
    description?: string;
    partnerName?: string;
    supportEmail?: string;
    supportPhone?: string;
  };
}

export default function AboutPartner({ data }: AboutPartnerProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Content reveal using fromTo
      gsap.fromTo(
        ".ap-content",
        { y: 60, autoAlpha: 0, scale: 0.98 },
        { 
          y: 0, 
          autoAlpha: 1, 
          scale: 1,
          duration: 1.4, 
          ease: "expo.out",
          scrollTrigger: {
            once: true,
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );

      // Background shapes animation
      gsap.to(".ap-shape", {
        rotation: -360,
        duration: 40,
        repeat: -1,
        ease: "linear",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-ss-black overflow-hidden relative border-t border-ss-white/5">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
         <div className="ap-shape absolute -top-40 -left-40 w-[600px] h-[600px] border border-ss-white/5 rounded-full" />
         <div className="ap-shape absolute -bottom-40 -right-40 w-[500px] h-[500px] border border-ss-red/5 rounded-full" />
         <div className="absolute inset-0 bg-linear-to-b from-ss-black via-transparent to-ss-black opacity-40" />
      </div>

      <div className="ss-container relative z-10">
        <div className="ap-content max-w-6xl mx-auto bg-ss-charcoal/70 backdrop-blur-3xl border border-ss-white/10 p-6 sm:p-12 md:p-20 lg:p-24 rounded-2xl sm:rounded-[3rem] shadow-[0_24px_55px_rgba(15,23,42,0.15)] dark:shadow-[0_60px_100px_rgba(0,0,0,0.8)] relative group overflow-hidden">
          {/* Visual Frame */}
          <div className="absolute top-12 left-12 w-20 h-20 border-t-2 border-l-2 border-ss-white/5 group-hover:border-ss-red/20 transition-all duration-1000" />
          <div className="absolute bottom-12 right-12 w-20 h-20 border-b-2 border-r-2 border-ss-white/5 group-hover:border-ss-red/20 transition-all duration-1000" />

          <div className="flex flex-col xl:flex-row gap-16 lg:gap-24 items-start relative z-10">
             
             {/* Left - Partner Identity */}
             <div className="flex flex-col items-center xl:items-start text-center xl:text-left xl:shrink-0 w-full xl:w-auto">
                <div className="w-24 h-24 rounded-2xl border border-ss-white/10 bg-ss-white/5 flex items-center justify-center mb-10 shadow-2xl overflow-hidden group hover:bg-ss-red transition-all duration-700 relative group/logo">
                   {/* Logo underglow */}
                   <div className="absolute inset-x-0 h-px bg-white/20 top-0 group-hover:translate-y-24 transition-transform duration-1000" />
                   
                   <div className="w-10 h-10 border-2 border-ss-red/40 group-hover:border-ss-pure-white transition-all duration-500 rounded-sm rotate-45 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-ss-red group-hover:bg-[#fff] shadow-[0_0_10px_rgba(214,40,40,0.4)]" />
                   </div>
                </div>
                
                <h4 className="font-display text-[10px] font-black text-ss-red uppercase tracking-[0.4em] mb-4">
                   Digital Ecosystem Partner
                </h4>
                
                <h3 className="font-display text-4xl lg:text-5xl text-ss-pure-white font-black leading-tight mb-10 tracking-tight">
                   {data.partnerName || "WAVE IO"}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-10 w-full">
                   <div className="flex flex-col gap-2">
                      <span className="text-[9px] text-ss-white/20 uppercase tracking-[0.4em] font-black group-hover:text-ss-red/40 transition-colors">Technical Support</span>
                      <a href={`mailto:${data.supportEmail}`} className="text-ss-pure-white font-body text-base lg:text-lg hover:text-ss-red transition-colors duration-300 font-bold border-b border-ss-white/5 pb-2">
                         {data.supportEmail}
                      </a>
                   </div>
                   <div className="flex flex-col gap-2">
                      <span className="text-[9px] text-ss-white/20 uppercase tracking-[0.4em] font-black group-hover:text-ss-red/40 transition-colors">Direct Assistance</span>
                      <a href={`tel:${data.supportPhone}`} className="text-ss-pure-white font-body text-base lg:text-lg hover:text-ss-red transition-colors duration-300 font-bold border-b border-ss-white/5 pb-2">
                         {data.supportPhone}
                      </a>
                   </div>
                </div>
             </div>

             {/* Right - Narrative */}
             <div className="flex flex-col justify-center grow">
                <h4 className="font-display text-2xl lg:text-4xl text-ss-pure-white font-black leading-tight mb-10 tracking-tight group-hover:text-ss-red transition-colors duration-500">
                   {data.headline || "Designed and Developed by WAVE IO"}
                </h4>
                
                <p className="text-ss-grey-400 font-body text-base lg:text-xl leading-relaxed mb-12">
                   {data.description || "WAVE PLUS was built in direct collaboration with the SS PLUS operations team. Every feature reflects the real-world needs of industrial safety management in Tunisia, ensuring a shared digital environment where every service interaction is logged and accessible."}
                </p>

                <div className="flex items-center gap-8 pt-12 border-t border-ss-white/5">
                   <div className="w-1.5 h-16 bg-ss-red shadow-[0_0_15px_rgba(214,40,40,0.4)]" />
                   <p className="text-ss-grey-500 font-body italic text-sm lg:text-base leading-relaxed max-w-lg">
                      &ldquo;The platform represents SS PLUS&apos;s most significant technological leap, built on operational transparency and technical excellence.&rdquo;
                   </p>
                </div>
             </div>

          </div>
        </div>
      </div>
    </section>
  );
}

