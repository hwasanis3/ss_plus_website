"use client";

import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";

/* ─── Footer Component ───────────────────────────────────────── */

export default function Footer() {
  const t = useTranslations("Footer");
  const footerRef = useRef<HTMLElement>(null);

  const footerLinks = {
    company: [
      { name: t("links.home"), href: "/" },
      { name: t("links.aboutUs"), href: "/about" },
      { name: t("links.services"), href: "/services" },
      { name: t("links.products"), href: "/products" },
      { name: t("links.contact"), href: "/contact" },
    ],
    solutions: [
      { name: t("links.industrialSafety"), href: "/services" },
      { name: t("links.fireProtection"), href: "/services" },
      { name: t("links.training"), href: "/services" },
      { name: t("links.wavePlus"), href: "/wave-plus" },
      { name: t("links.ppeEquipment"), href: "/products" },
    ],
    resources: [
      { name: "WAVE PLUS Platform", href: "/wave-plus" },
      { name: "QHSE Standards", href: "/qhse" },
      { name: "Certifications", href: "/qhse" },
      { name: "Help Center", href: "/contact" },
    ],
  };

  useGSAP(() => {
    gsap.fromTo(
      footerRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          once: true,
          trigger: footerRef.current,
          start: "top 90%",
        }
      }
    );
  }, { scope: footerRef });

  return (
    <footer
      ref={footerRef}
      className="relative bg-ss-black border-t border-ss-white/5 pt-24 pb-12 overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-[radial-gradient(circle,rgba(214,40,40,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-75 h-75 bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="ss-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-8 group">
              <div className="relative h-10 md:h-12 w-auto mb-4">
                 <Image
                  src="/logo-ssplus.png"
                  alt="SS PLUS"
                  width={160}
                  height={48}
                  style={{ width: "auto", height: "auto" }}
                  className="h-full brightness-110 object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
                  {t("thinkSafety")}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ss-red">
                  {t("thinkUs")}
                </span>
              </div>
            </Link>
            <p className="text-ss-grey-300 text-sm leading-relaxed max-w-sm mb-8">
              {t("description")}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {['facebook', 'linkedin', 'instagram'].map((social) => (
                <a
                  key={social}
                  href={`#${social}`}
                  className="w-10 h-10 flex items-center justify-center rounded-sm bg-white/5 border border-white/10 text-ss-grey-300 hover:bg-ss-red hover:text-[#fff] hover:border-ss-red hover:-translate-y-1 transition-all duration-300"
                  aria-label={social}
                >
                   <span className="sr-only">{social}</span>
                   <div className="w-1.5 h-1.5 rounded-full bg-current" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h4 className="text-ss-white font-display text-sm font-bold uppercase tracking-widest mb-8">{t("company")}</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-ss-grey-400 text-sm hover:text-ss-red transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-ss-white font-display text-sm font-bold uppercase tracking-widest mb-8">{t("solutions")}</h4>
            <ul className="space-y-4">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-ss-grey-400 text-sm hover:text-ss-red transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4">
            <h4 className="text-ss-white font-display text-sm font-bold uppercase tracking-widest mb-8">{t("contactUs")}</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 w-5 h-5 rounded-sm bg-ss-red/10 border border-ss-red/20 flex items-center justify-center text-ss-red text-[10px] font-bold">A</div>
                <p className="text-ss-grey-400 text-sm leading-relaxed">
                  Route de Gabès Km 3.5, 3038 Sfax — Tunisia
                </p>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 w-5 h-5 rounded-sm bg-ss-red/10 border border-ss-red/20 flex items-center justify-center text-ss-red text-[10px] font-bold">P</div>
                <div className="flex flex-col">
                  <a href="tel:+21674453027" className="text-ss-grey-400 text-sm hover:text-ss-red transition-colors">+216 74 453 027</a>
                  <a href="mailto:contact@ssplus.tn" className="text-ss-grey-400 text-sm hover:text-ss-red transition-colors">
                    contact@ssplus.tn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-8">
             <p className="text-ss-grey-400 text-xs tracking-wide text-center md:text-left">
              &copy; {new Date().getFullYear()} SS PLUS. {t("allRightsReserved")}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-ss-grey-500 text-[10px] uppercase tracking-widest">{t("developedBy")}</span>
            <span className="text-ss-white font-bold text-[10px] uppercase tracking-[0.2em]">WAVE VI & collab with WAVE IO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
