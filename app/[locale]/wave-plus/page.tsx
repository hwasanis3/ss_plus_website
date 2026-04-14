import BlockRenderer from "@/components/BlockRenderer";
import {fetchLocalizedPage, type Locale} from "@/lib/localizedPage";

interface LocalePageProps {
  params: Promise<{locale: Locale}>;
}

export async function generateMetadata({params}: LocalePageProps) {
  const {locale} = await params;
  const page = await fetchLocalizedPage(locale, "wave-plus");
  if (!page) return {title: "WAVE PLUS | SS PLUS"};
  return {
    title: page.seo?.metaTitle || `${page.title} | SS PLUS`,
    description: page.seo?.metaDescription || "Discover Wave Plus",
  };
}

export default async function LocalizedWavePlusPage({params}: LocalePageProps) {
  const {locale} = await params;
  const page = await fetchLocalizedPage(locale, "wave-plus");

  if (!page || !page.content?.length) {
    return (
      <main className="flex flex-1 items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="ss-accent-line mx-auto mb-6" />
          <h1 className="font-display text-4xl font-bold mb-4 text-ss-pure-white uppercase">Wave Plus</h1>
          <p className="text-ss-grey-400 max-w-md mx-auto">
            The Wave Plus page for "{locale}" has not been published in Sanity yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 min-h-screen">
      <BlockRenderer blocks={page.content} />
    </main>
  );
}

