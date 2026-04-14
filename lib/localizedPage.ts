import {sanityClient} from "@/lib/sanity";
import {PAGE_BY_LOCALE_QUERY} from "@/lib/queries";

export type Locale = "en" | "fr";
export type PageKey = "home" | "about" | "services" | "products" | "qhse" | "wave-plus" | "contact";

interface ContentBlock {
  _key: string;
  _type: string;
  [key: string]: unknown;
}

export interface LocalizedPageData {
  _id: string;
  language: Locale;
  title: string;
  slug: {current: string};
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  content?: ContentBlock[];
}

const localizedSlugs: Record<PageKey, {en: string; fr: string}> = {
  home: {en: "home", fr: "accueil"},
  about: {en: "about", fr: "a-propos"},
  services: {en: "services", fr: "services"},
  products: {en: "products", fr: "produits"},
  qhse: {en: "qhse", fr: "qhse"},
  "wave-plus": {en: "wave-plus", fr: "wave-plus"},
  contact: {en: "contact", fr: "contact"},
};

function getSlugCandidates(locale: Locale, page: PageKey): string[] {
  const localized = localizedSlugs[page][locale];
  const candidates = [localized];
  if (locale === "fr") {
    // Supports existing seeded content with legacy "fr/<slug>" format.
    candidates.push(`fr/${localized}`);
  }
  return candidates;
}

export async function fetchLocalizedPage(locale: Locale, page: PageKey): Promise<LocalizedPageData | null> {
  return sanityClient.fetch(PAGE_BY_LOCALE_QUERY, {
    locale,
    slugs: getSlugCandidates(locale, page),
  });
}

