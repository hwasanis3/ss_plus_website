'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';

type Locale = 'en' | 'fr';
type PageKey =
  | 'home'
  | 'about'
  | 'services'
  | 'products'
  | 'qhse'
  | 'wave-plus'
  | 'contact';

const labelsByLocale = {
  en: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    products: 'Products',
    qhse: 'QHSE',
    wavePlus: 'Wave Plus',
    contact: 'Contact',
    consultation: 'Get Professional Consultation',
    appearance: 'Appearance',
    emergencyHotline: 'Emergency Hotline',
  },
  fr: {
    home: 'Accueil',
    about: 'A Propos',
    services: 'Services',
    products: 'Produits',
    qhse: 'QHSE',
    wavePlus: 'Wave Plus',
    contact: 'Contact',
    consultation: 'Obtenir une consultation',
    appearance: 'Apparence',
    emergencyHotline: "Ligne d'urgence",
  },
};

const slugsByLocale: Record<Locale, Record<PageKey, string>> = {
  en: {
    home: '',
    about: 'about',
    services: 'services',
    products: 'products',
    qhse: 'qhse',
    'wave-plus': 'wave-plus',
    contact: 'contact',
  },
  fr: {
    home: '',
    about: 'a-propos',
    services: 'services',
    products: 'produits',
    qhse: 'qhse',
    'wave-plus': 'wave-plus',
    contact: 'contact',
  },
};

function detectLocale(pathname: string): Locale {
  const first = pathname.split('/').filter(Boolean)[0];
  return first === 'fr' ? 'fr' : 'en';
}

function stripLocale(pathname: string): string[] {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'en' || parts[0] === 'fr') return parts.slice(1);
  return parts;
}

function toLocalizedHref(locale: Locale, page: PageKey) {
  const slug = slugsByLocale[locale][page];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

function switchLocalePath(pathname: string, targetLocale: Locale): string {
  const currentLocale = detectLocale(pathname);
  const rest = stripLocale(pathname);
  const currentFirst = rest[0] ?? '';

  const pageKeys = Object.keys(slugsByLocale[currentLocale]) as PageKey[];
  const matchedKey =
    pageKeys.find(
      (key) => slugsByLocale[currentLocale][key] === currentFirst
    ) ?? 'home';
  const targetFirst = slugsByLocale[targetLocale][matchedKey];
  const tail = matchedKey === 'home' ? rest : rest.slice(1);
  const parts = targetFirst ? [targetFirst, ...tail] : tail;
  return parts.length
    ? `/${targetLocale}/${parts.join('/')}`
    : `/${targetLocale}`;
}

export default function Navbar() {
  const pathname = usePathname();
  const currentLocale = detectLocale(pathname);
  const t = labelsByLocale[currentLocale];
  const isHome = stripLocale(pathname).length === 0;
  const nextLocale: Locale = currentLocale === 'en' ? 'fr' : 'en';
  const switchHref = switchLocalePath(pathname, nextLocale);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuLinksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: t.home, href: toLocalizedHref(currentLocale, 'home') },
    { name: t.about, href: toLocalizedHref(currentLocale, 'about') },
    { name: t.services, href: toLocalizedHref(currentLocale, 'services') },
    { name: t.products, href: toLocalizedHref(currentLocale, 'products') },
    { name: t.qhse, href: toLocalizedHref(currentLocale, 'qhse') },
    { name: t.wavePlus, href: toLocalizedHref(currentLocale, 'wave-plus') },
  ];

  return (
    <>
      {/* ─── Main Header Bar ──────────────────────────────────────── */}
      <header
        style={{ zIndex: 100 }}
        className={`fixed top-0 left-0 w-full transition-all duration-500 ${
          isMenuOpen ? 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto' : 'opacity-100'
        } ${
          !isHome || scrolled
            ? 'bg-black/90 backdrop-blur-xl border-b border-white/5 py-3 md:py-4'
            : 'bg-transparent py-5 md:py-8'
        }`}
      >
        <div className="ss-container flex items-center justify-between">
          {/* Logo */}
          <Link
            href={toLocalizedHref(currentLocale, 'home')}
            className="flex items-center gap-3 group"
          >
            <div className="relative h-8 md:h-12 w-auto overflow-visible">
              <Image
                src="/logo-ssplus.png"
                alt="SS PLUS"
                width={160}
                height={48}
                className="brightness-110 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                style={{ width: 'auto', height: 'auto' }}
                sizes="(max-width: 768px) 120px, 160px"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col border-l border-white/20 pl-3 leading-none">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/90">
                Think Safety
              </span>
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-ss-red">
                Think Us
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative text-[11px] font-bold text-white/85 uppercase tracking-[0.2em] hover:text-white transition-all duration-300"
              >
                <span>{item.name}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-ss-red transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href={switchHref}
              className="inline-flex items-center px-3 py-2 border border-white/20 text-white/90 text-[11px] font-bold uppercase tracking-[0.18em] hover:border-ss-red hover:text-ss-red transition-all duration-300"
            >
              {nextLocale.toUpperCase()}
            </Link>
            <ThemeToggle />
            <Link
              href={toLocalizedHref(currentLocale, 'contact')}
              className="group relative inline-flex items-center px-8 py-3 bg-ss-red/5 text-ss-red border border-ss-red/20 font-bold text-[11px] uppercase tracking-[0.2em] rounded-sm transition-all duration-500 hover:bg-ss-red hover:text-white hover:shadow-[0_0_30px_rgba(214,40,40,0.3)] overflow-hidden"
            >
              <span className="relative z-1">{t.contact}</span>
              <span className="absolute inset-x-0 bottom-0 h-0 bg-ss-red transition-all duration-300 group-hover:h-full z-0" />
            </Link>
          </div>

          {/* Mobile Actions — no `relative` to avoid stacking-context conflicts */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href={switchHref}
              className="inline-flex items-center px-2.5 py-2 border border-white/20 text-white/90 text-[10px] font-bold uppercase tracking-[0.18em] hover:border-ss-red hover:text-ss-red transition-all duration-300"
            >
              {nextLocale.toUpperCase()}
            </Link>
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
              aria-label="Toggle Menu"
              aria-expanded={isMenuOpen}
            >
              <span
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-2 bg-ss-red' : ''
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-2 bg-ss-red' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Menu Overlay — rendered OUTSIDE <header> ─────── */}
      {/*
        Placing this outside the <header> means its z-index is relative to
        the document root stacking context, not the header's context.
        This guarantees it always covers the full viewport on every page.
      */}
      <div
        style={{ zIndex: 110 }}
        className={`fixed inset-0 lg:hidden transition-opacity duration-300 ${
          isMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Slide-in panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[88%] max-w-sm bg-black border-l border-white/10 overflow-y-auto transition-transform duration-300 ease-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="absolute inset-0 ss-noise opacity-20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(214,40,40,0.1)_0%,transparent_50%)] pointer-events-none" />

          <div
            className="relative min-h-full flex flex-col pt-24 px-6 sm:px-8 pb-8"
            ref={menuLinksRef}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <span className="text-[10px] font-bold text-ss-grey-400 uppercase tracking-[0.24em]">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 hover:border-ss-red hover:text-ss-red transition-colors"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-sm px-3 py-3 text-xl sm:text-2xl font-display font-bold text-white hover:text-ss-red hover:bg-white/3 transition-colors duration-300 tracking-tight"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-5">
              <span className="text-[10px] font-bold text-ss-grey-400 uppercase tracking-widest">
                {t.consultation}
              </span>

              <Link
                href={toLocalizedHref(currentLocale, 'contact')}
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex items-center justify-center px-6 py-4 bg-ss-red text-white font-bold text-xs uppercase tracking-[0.18em] rounded-sm hover:shadow-[0_0_40px_rgba(214,40,40,0.4)] transition-all duration-300"
              >
                {t.contact}
              </Link>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-ss-grey-400 uppercase tracking-widest">
                  {t.emergencyHotline}
                </span>
                <a
                  href="tel:+21628308108"
                  className="text-lg font-display font-bold text-white hover:text-ss-red transition-colors"
                >
                  +216 28 308 108
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
