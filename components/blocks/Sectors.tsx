"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";

gsap.registerPlugin(ScrollTrigger);

/* ─── Types ──────────────────────────────────────────────── */

interface SectorsProps {
  data: {
    sectionLabel?: string;
    description?: string;
    sectorList?: Array<{
      _key: string;
      name: string;
    }>;
  };
}

/* ─── Sector Icons ───────────────────────────────────────── */

const sectorIconMap: Record<string, string> = {
  oilgas: "🛢️",
  oil: "🛢️",
  gas: "🛢️",
  petrolegaz: "🛢️",
  petrole: "🛢️",
  manufacturing: "🏭",
  industrie: "🏭",
  manufacturiere: "🏭",
  foodbeverage: "🍽️",
  food: "🍽️",
  beverage: "🍽️",
  agroalimentaire: "🍽️",
  construction: "🏗️",
  petrochemicals: "⚗️",
  petrochemical: "⚗️",
  petrochimie: "⚗️",
  animalnutrition: "🌾",
  animal: "🌾",
  nutrition: "🌾",
  animale: "🌾",
  hospitality: "🏨",
  hotellerie: "🏨",
  logistics: "📦",
  healthcare: "🏥",
  sante: "🏥",
  publicsector: "🏛️",
  public: "🏛️",
  secteurpublic: "🏛️",
  mining: "⛏️",
  mines: "⛏️",
  transport: "🚛",
};

function normalizeSectorName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function getSectorIcon(name: string): string {
  const normalized = normalizeSectorName(name);
  for (const [key, icon] of Object.entries(sectorIconMap)) {
    if (normalized.includes(key)) return icon;
  }
  return "🛡️";
}

function formatSectorDisplayName(name: string): string {
  const normalized = normalizeSectorName(name);

  if (normalized === "petrochemicals" || normalized === "petrochemical") {
    return "PETRO-\nCHEMICALS";
  }

  if (normalized === "manufacturing") {
    return "MANU-\nFACTURING";
  }

  if (normalized === "construction") {
    return "CONS-\nTRUCTION";
  }

  if (normalized === "agroalimentaire") {
    return "AGRO-\nALIMENTAIRE";
  }

  if (normalized === "industriemanufacturiere") {
    return "INDUSTRIE\nMANUFACTU-\nRIERE";
  }

  if (normalized === "weatherford") {
    return "WEATHER-\nFORD";
  }

  return name.toUpperCase();
}

/* ─── Component ──────────────────────────────────────────── */

export default function Sectors({ data }: SectorsProps) {
  const { sectionLabel, description, sectorList } = data;
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectorList?.length) return;

      // Header
      gsap.fromTo(
        ".sectors-header",
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
    },
    { scope: sectionRef }
  );

  if (!sectorList?.length) return null;

  // Flatten the sector names to individual clients
  // Example: "Oil & Gas (OMV, Perenco, Weatherford)" -> ["OMV", "Perenco", "Weatherford"]
  const flattenedClients = sectorList.flatMap(s => {
    // If it has parentheses, extract content inside
    const match = s.name.match(/\((.*?)\)/);
    if (match && match[1]) {
      return match[1].split(',').map(name => ({
        _key: `${s._key}-${name.trim()}`,
        name: name.trim(),
        category: s.name.split('(')[0].trim()
      }));
    }
    // Otherwise just return the name itself
    return [{
      _key: s._key,
      name: s.name,
      category: s.name
    }];
  });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-40 bg-ss-black overflow-hidden border-t border-ss-grey-800/30"
    >
      {/* Decorative background element */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-ss-red/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="sectors-header ss-container text-center max-w-3xl mx-auto mb-20" style={{ opacity: 0 }}>
          {sectionLabel && (
            <span className="inline-block text-xs text-ss-red uppercase tracking-[0.4em] font-bold mb-4">
              {sectionLabel}
            </span>
          )}
          <h3 className="font-display text-[clamp(2rem,5vw,3.5rem)] lg:text-6xl text-ss-white font-bold leading-[1.1] mb-8">
            Trust is Built on <span className="text-ss-red">Performance.</span>
          </h3>
          {description && (
            <p className="text-lg text-ss-grey-400 font-body max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Swiper Carousel */}
        <div className="w-full">
          <Swiper
            modules={[Autoplay, FreeMode]}
            spaceBetween={20}
            slidesPerView={2}
            loop={true}
            freeMode={false}
            speed={5000}
            autoplay={{
              delay: 1,
              disableOnInteraction: false,
              pauseOnMouseEnter: false
            }}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 30 },
              1024: { slidesPerView: 5, spaceBetween: 40 },
              1536: { slidesPerView: 7, spaceBetween: 50 },
            }}
            className="client-swiper"
          >
            {flattenedClients.map((client) => (
              <SwiperSlide key={client._key} className="h-auto">
                <div className="group relative flex h-44 lg:h-52 flex-col items-center justify-center rounded-sm border border-ss-grey-800 bg-ss-grey-900/50 p-5 lg:p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-ss-red/40 hover:bg-ss-grey-800/80">
                   <div className="mb-4 text-4xl opacity-30 grayscale transition-all duration-500 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0 lg:text-5xl">
                      {getSectorIcon(client.category)}
                   </div>
                   <h4 className="whitespace-pre-line px-2 text-center text-[11px] font-bold leading-snug tracking-normal text-ss-white break-words [overflow-wrap:anywhere] sm:text-xs lg:text-sm">
                      {formatSectorDisplayName(client.name)}
                   </h4>
                   
                   {/* Decorative Corner */}
                   <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-2 right-2 w-2 h-2 bg-ss-red" />
                   </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

