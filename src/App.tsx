import { useEffect, useState } from 'react';
import { ArrowDownRight, Instagram, MapPin, PawPrint, Sparkles } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { MenuSection } from './components/MenuSection';
import { ServicesSections } from './components/ServicesSections';
import { NewsAndFooter } from './components/NewsAndFooter';
import { AdminPanel } from './components/AdminPanel';
import type { SiteData } from './types/site';
import {
  clearDraftSiteData,
  fetchPublishedSiteData,
  loadDraftSiteData,
  saveDraftSiteData,
} from './utils/siteStore';

export function App() {
  const [publishedData, setPublishedData] = useState<SiteData | null>(null);
  const [draftData, setDraftData] = useState<SiteData | null>(null);
  const [viewMode, setViewMode] = useState<'client' | 'preview' | 'admin'>(() =>
    window.location.hash === '#admin' ? 'admin' : 'client'
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublishedSiteData()
      .then((data) => {
        setPublishedData(data);
        const existingDraft = loadDraftSiteData();
        setDraftData(existingDraft ?? data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Error al cargar el sitio.');
      });
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === '#admin') {
        setViewMode('admin');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0] p-6 text-center">
        <div className="max-w-md rounded-2xl border border-[#E5DDD0] bg-white p-6">
          <h1 className="font-display text-2xl font-semibold text-[#231B15]">
            Moulú Café
          </h1>
          <p className="mt-2 text-sm text-[#6B5B4D]">{error}</p>
        </div>
      </div>
    );
  }

  if (!publishedData || !draftData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
        <div className="text-center">
          <p className="font-display text-3xl font-semibold text-[#231B15]">
            Moulú Café
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#8C7A68]">
            Preparando barra...
          </p>
        </div>
      </div>
    );
  }

  const handleUpdateDraft = (next: SiteData) => {
    setDraftData(next);
    saveDraftSiteData(next);
  };

  const handleDiscardDraft = () => {
    clearDraftSiteData();
    setDraftData(publishedData);
  };

  if (viewMode === 'admin') {
    return (
      <AdminPanel
        draftData={draftData}
        onUpdateDraft={handleUpdateDraft}
        onDiscardDraft={handleDiscardDraft}
        onPreviewDraft={() => setViewMode('preview')}
        onCloseAdmin={() => {
          if (window.location.hash === '#admin') {
            history.replaceState(null, '', window.location.pathname);
          }
          setViewMode('client');
        }}
      />
    );
  }

  const activeData = viewMode === 'preview' ? draftData : publishedData;
  const { brand } = activeData;

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#231B15]">
      <Navbar
        brandName={brand.name}
        isPreviewMode={viewMode === 'preview'}
        onExitPreview={() => setViewMode('client')}
        onOpenAdmin={() => setViewMode('admin')}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[#E5DDD0] bg-gradient-to-b from-[#FAF6F0] to-[#F3EBE0]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DFD4C3] bg-white/80 px-4 py-1.5 text-xs font-medium text-[#5C4D40]">
                <PawPrint className="h-3.5 w-3.5 text-[#C67D4E]" />
                <span>{brand.heroBadge}</span>
              </div>

              <h1 className="font-display mt-6 text-5xl font-semibold leading-[1.06] tracking-tight text-[#231B15] sm:text-6xl">
                {brand.heroTitle}
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#5C4D40] sm:text-lg">
                {brand.heroSubtitle}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a
                  href="#menu"
                  className="inline-flex items-center gap-2 rounded-full bg-[#231B15] px-7 py-3.5 text-sm font-medium text-[#FAF6F0] transition hover:bg-[#C67D4E]"
                >
                  Explorar el menú
                  <ArrowDownRight className="h-4 w-4" />
                </a>
                <a
                  href="#catering"
                  className="inline-flex items-center gap-2 rounded-full border border-[#D4C8B8] bg-white/80 px-6 py-3.5 text-sm font-medium text-[#231B15] transition hover:border-[#231B15]"
                >
                  Catering & Mayoreo
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-[#6B5B4D]">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#C67D4E]" />
                  {brand.address}
                </span>
                <a
                  href={brand.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-[#231B15] hover:text-[#C67D4E]"
                >
                  <Instagram className="h-3.5 w-3.5 text-[#C67D4E]" />
                  {brand.instagramHandle}
                </a>
              </div>
            </div>

            {/* Editorial Highlight Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-[#DFD4C3] bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#C67D4E]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Imperdibles de la casa
                  </span>
                  <span className="text-xs text-[#8C7A68]">Mexicali</span>
                </div>

                <h2 className="font-display mt-3 text-3xl font-semibold text-[#231B15]">
                  {brand.storyTitle}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#6B5B4D]">
                  {brand.storyText}
                </p>

                <div className="mt-6 space-y-3 border-t border-[#EFE7DA] pt-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#231B15]">Centinela</span>
                    <span className="text-xs text-[#7A6858]">Limonada + Espresso</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#231B15]">Salty Latte</span>
                    <span className="text-xs text-[#7A6858]">Soya, sal rosa & miel</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#231B15]">Matcha Ceremonial</span>
                    <span className="text-xs text-[#7A6858]">Grado A japonés</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#231B15]">Chilaquiles & Panadería</span>
                    <span className="text-xs text-[#7A6858]">Horneado todos los días</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MenuSection menu={activeData.menu} />

      <ServicesSections
        catering={activeData.catering}
        mayoreo={activeData.mayoreo}
        whatsappNumber={brand.whatsappNumber}
      />

      <NewsAndFooter
        novedades={activeData.novedades}
        brand={brand}
        updatedAt={activeData.updatedAt}
        onOpenAdmin={() => setViewMode('admin')}
      />
    </div>
  );
}

export default App;
