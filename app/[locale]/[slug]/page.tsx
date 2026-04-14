import { notFound } from "next/navigation";
import BlockRenderer from "@/components/BlockRenderer";
import { fetchLocalizedPage, type Locale, type PageKey } from "@/lib/localizedPage";

interface LocalizedSlugPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

const slugToPageKey: Record<string, PageKey> = {
  home: "home",
  accueil: "home",
  about: "about",
  "a-propos": "about",
  services: "services",
  products: "products",
  produits: "products",
  qhse: "qhse",
  "wave-plus": "wave-plus",
  contact: "contact",
};

export default async function LocalizedSlugPage({ params }: LocalizedSlugPageProps) {
  const { locale, slug } = await params;
  const pageKey = slugToPageKey[slug];

  if (!pageKey) {
    notFound();
  }

  const page = await fetchLocalizedPage(locale, pageKey);

  if (!page || !page.content?.length) {
    return (
      <main className="flex flex-1 items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="ss-accent-line mx-auto mb-6" />
          <h1 className="font-display text-4xl font-bold mb-4 text-ss-pure-white uppercase">
            {slug}
          </h1>
          <p className="text-ss-grey-400 max-w-md mx-auto">
            The page for &quot;{locale}/{slug}&quot; has not been published in Sanity yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 min-h-screen">
      <BlockRenderer blocks={page.content} pageSlug={pageKey} />
    </main>
  );
}
