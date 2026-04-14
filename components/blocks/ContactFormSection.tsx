"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface ContactFormSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    subjects?: string[];
  };
}

export default function ContactFormSection({ data }: ContactFormSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    subject: data.subjects?.[0] || "General Inquiry",
    message: "",
  });

  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useGSAP(
    () => {
      // Content reveal using fromTo
      gsap.fromTo(
        ".cfs-reveal",
        { y: 40, autoAlpha: 0, scale: 0.98 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "expo.out",
          scrollTrigger: {
            once: true,
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );
    },
    { scope: sectionRef }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      // Reset after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-ss-black border-t border-ss-white/5 relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(214,40,40,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="ss-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left - Narrative */}
          <div className="cfs-reveal lg:col-span-12 xl:col-span-5">
             <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-px bg-ss-red shadow-[0_0_10px_rgba(214,40,40,0.4)]" />
              <h2 className="text-[11px] font-black text-ss-red uppercase tracking-[0.4em]">
                 Enterprise Enquiry Gateway
              </h2>
            </div>
            
            <h3 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-balance break-words text-ss-pure-white font-extrabold leading-[1.15] md:leading-[1.1] mb-12 tracking-tight drop-shadow-2xl">
               {data.title || "Send Us a Message"}
            </h3>
            
            <p className="text-ss-grey-400 font-body text-xl lg:text-2xl leading-relaxed mb-16 max-w-lg border-l-2 border-ss-white/10 pl-8 group-hover:border-ss-red transition-colors duration-1000">
               {data.subtitle || "Our technical teams are ready to respond to your operational inquiries within 24 business hours."}
            </p>

            <div className="space-y-10 pt-16 border-t border-ss-white/5">
               <div className="flex items-start gap-6 group">
                  <div className="w-10 h-10 rounded-2xl bg-ss-white/5 border border-ss-white/10 flex items-center justify-center group-hover:bg-ss-red group-hover:border-ss-red transition-all duration-500 shadow-2xl">
                     <div className="w-1.5 h-1.5 bg-ss-red group-hover:bg-[#fff] rounded-full group-hover:shadow-[0_0_10px_rgba(255,255,255,1)]" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <span className="text-[11px] font-black uppercase tracking-[0.3em] text-ss-red">Real-Time Processing</span>
                     <p className="text-ss-grey-500 text-sm leading-relaxed max-w-[280px]">Your enquiry is automatically routed to the relevant technical department.</p>
                  </div>
               </div>
               <div className="flex items-start gap-6 group delay-150">
                  <div className="w-10 h-10 rounded-2xl bg-ss-white/5 border border-ss-white/10 flex items-center justify-center group-hover:bg-ss-red group-hover:border-ss-red transition-all duration-500 shadow-2xl">
                     <div className="w-1.5 h-1.5 bg-ss-red group-hover:bg-[#fff] rounded-full group-hover:shadow-[0_0_10px_rgba(255,255,255,1)]" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <span className="text-[11px] font-black uppercase tracking-[0.3em] text-ss-red">Secure Node Protection</span>
                     <p className="text-ss-grey-500 text-sm leading-relaxed max-w-[280px]">Data transmission is protected via industry-standard encryption protocols.</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right - Form - Overhauled for Premium Aesthetic */}
          <div className="cfs-reveal lg:col-span-12 xl:col-span-7">
             <div className="bg-ss-charcoal border border-ss-white/5 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 md:p-16 lg:p-20 shadow-[0_24px_55px_rgba(15,23,42,0.16)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative group overflow-hidden">
                {/* Visual Frame */}
                <div className="absolute top-10 right-10 w-3 h-3 border-t border-r border-ss-white/20" />
                <div className="absolute bottom-10 left-10 w-3 h-3 border-b border-l border-ss-white/20" />
                
                <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {/* Name */}
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-ss-grey-600 block pl-1" htmlFor="name">System Operator Identity *</label>
                         <input 
                           required
                           type="text" 
                           id="name"
                           name="name" 
                           value={formData.name}
                           onChange={handleChange}
                          className="w-full bg-ss-charcoal-light border border-ss-white/10 p-5 font-body text-ss-pure-white focus:border-ss-red focus:bg-ss-white/[0.02] transition-all duration-500 outline-none rounded-xl text-lg hover:border-ss-white/20"
                           placeholder="Full Name"
                         />
                      </div>
                      
                      {/* Company */}
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-ss-grey-600 block pl-1" htmlFor="company">Enterprise Correlation *</label>
                         <input 
                           required
                           type="text" 
                           id="company" 
                           name="company" 
                           value={formData.company}
                           onChange={handleChange}
                          className="w-full bg-ss-charcoal-light border border-ss-white/10 p-5 font-body text-ss-pure-white focus:border-ss-red focus:bg-ss-white/[0.02] transition-all duration-500 outline-none rounded-xl text-lg hover:border-ss-white/20"
                           placeholder="Company Entity"
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {/* Email */}
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-ss-grey-600 block pl-1" htmlFor="email">Digital Protocol (Email) *</label>
                         <input 
                           required
                           type="email" 
                           id="email" 
                           name="email" 
                           value={formData.email}
                           onChange={handleChange}
                          className="w-full bg-ss-charcoal-light border border-ss-white/10 p-5 font-body text-ss-pure-white focus:border-ss-red focus:bg-ss-white/[0.02] transition-all duration-500 outline-none rounded-xl text-lg hover:border-ss-white/20"
                           placeholder="Work Email"
                         />
                      </div>
                      
                      {/* Phone */}
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-ss-grey-600 block pl-1" htmlFor="phone">Communication Node (Phone) *</label>
                         <input 
                           required
                           type="tel" 
                           id="phone" 
                           name="phone" 
                           value={formData.phone}
                           onChange={handleChange}
                          className="w-full bg-ss-charcoal-light border border-ss-white/10 p-5 font-body text-ss-pure-white focus:border-ss-red focus:bg-ss-white/[0.02] transition-all duration-500 outline-none rounded-xl text-lg hover:border-ss-white/20"
                           placeholder="+216 -- --- ---"
                         />
                      </div>
                   </div>

                   {/* Subject Dropdown */}
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-ss-grey-600 block pl-1" htmlFor="subject">Signal Classification (Request Type) *</label>
                      <div className="relative group">
                         <select 
                           id="subject"
                           name="subject"
                           value={formData.subject}
                           onChange={handleChange}
                          className="w-full bg-ss-charcoal-light border border-ss-white/10 p-5 font-body text-ss-pure-white focus:border-ss-red focus:bg-ss-white/[0.02] transition-all duration-500 outline-none rounded-xl text-lg appearance-none cursor-pointer relative z-10 hover:border-ss-white/20"
                         >
                            {data.subjects?.map((sub) => (
                               <option key={sub} value={sub} className="bg-ss-black text-ss-white">{sub}</option>
                            ))}
                         </select>
                         <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none z-20 transition-transform duration-500 group-hover:translate-x-1">
                            <svg className="w-5 h-5 text-ss-red" fill="currentColor" viewBox="0 0 20 20">
                               <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                         </div>
                      </div>
                   </div>

                   {/* Message */}
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-ss-grey-600 block pl-1" htmlFor="message">Extended Log (Details) *</label>
                      <textarea
                        required
                        id="message" 
                        name="message" 
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full bg-ss-charcoal-light border border-ss-white/10 p-5 font-body text-ss-pure-white focus:border-ss-red focus:bg-ss-white/[0.02] transition-all duration-500 outline-none rounded-xl text-lg resize-none hover:border-ss-white/20"
                        placeholder="Detailed operational or technical enquiry..."
                      />
                   </div>

                   <div className="flex flex-col md:flex-row gap-10 md:items-center justify-between pt-10 border-t border-ss-white/5">
                      <p className="text-ss-grey-600 text-[10px] font-black uppercase tracking-[0.3em] max-w-[280px] leading-relaxed">
                         Technical telemetry: By initiating transmission, you authorize the algorithmic routing of this data.
                      </p>
                      
                      <button 
                        disabled={status === "submitting"}
                        type="submit"
                        className="relative px-6 sm:px-10 py-5 sm:py-6 bg-ss-red text-[#fff] font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs md:text-sm group overflow-hidden shadow-[0_20px_50px_rgba(214,40,40,0.3)] transition-all duration-500 hover:-translate-y-2 active:scale-95 disabled:opacity-50 text-center whitespace-nowrap"
                      >
                         <span className="relative z-10 flex items-center gap-4">
                            {status === "submitting" ? (
                               <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uplinking...</>
                            ) : (
                               <>Initiate Signal transmission <span className="translate-x-0 group-hover:translate-x-2 transition-transform duration-500">→</span></>
                            )}
                         </span>
                         <div className="absolute inset-0 bg-ss-black translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                      </button>
                   </div>

                   {/* Status Feedback Overhauled */}
                   {status === "success" && (
                      <div className="mt-10 flex items-center gap-6 p-6 bg-ss-red/10 border border-ss-red/30 rounded-2xl relative overflow-hidden group/success">
                         <div className="absolute inset-x-0 bottom-0 h-px bg-ss-red animate-[sweep_3s_infinite]" />
                         <div className="w-10 h-10 rounded-full bg-ss-red/20 flex items-center justify-center shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-ss-red animate-pulse shadow-[0_0_10px_rgba(214,40,40,1)]" />
                         </div>
                         <p className="text-ss-red font-black uppercase tracking-[0.1em] text-xs leading-relaxed">
                            Signal successfully reached our endpoints. A direct communication link will be established by the relevant node within 24H.
                         </p>
                      </div>
                   )}
                </form>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

