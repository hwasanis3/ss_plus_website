import BlockRenderer from "@/components/BlockRenderer";
import {fetchLocalizedPage, type Locale} from "@/lib/localizedPage";

interface LocalePageProps {
  params: Promise<{locale: Locale}>;
}

export default async function LocalizedHomePage({params}: LocalePageProps) {
  const {locale} = await params;
  const page = await fetchLocalizedPage(locale, "home");

  if (!page || !page.content?.length) {
    return (
      <main className="flex flex-1 items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="ss-accent-line mx-auto mb-6" />
          <h1 className="font-display text-4xl font-bold mb-4 text-ss-pure-white">SS PLUS</h1>
          <p className="text-ss-grey-400 max-w-md mx-auto">
            The Home page for "{locale}" has not been published in Sanity yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <BlockRenderer blocks={page.content} pageSlug="home" />
    </main>
  );
}

