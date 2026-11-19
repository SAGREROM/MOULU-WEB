import { useEffect, useState } from 'react';
import { ArrowDownRight, Instagram, MapPin, PawPrint } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { QuadrantsSection } from './components/QuadrantsSection';
import { MenuSection } from './components/MenuSection';
import { ServicesSections } from './components/ServicesSections';
import { NewsAndFooter } from './components/NewsAndFooter';
import { AdminPanel } from './components/AdminPanel';
import type { MenuSectionKey, SiteData } from './types/site';
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
  const [menuTab, setMenuTab] = useState<MenuSectionKey>('bebidas');
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
      <div className="flex min-h-screen items-center justify-center bg-[#F9F6F1] p-6 text-center">
        <div className="max-w-md rounded-2xl border border-[#E5DDD0] bg-white p-6">
          <h1 className="font-display text-2xl font-semibold text-[#1A1714]">
            Moulú Café
          </h1>
          <p className="mt-2 text-sm text-[#6B5B4D]">{error}</p>
        </div>
      </div>
    );
  }

  if (!publishedData || !draftData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F6F1]">
        <div className="text-center">
          <p className="font-display text-3xl font-semibold text-[#1A1714]">
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
  const marqueeChunk = brand.marqueeText || 'Café de Especialidad · Brunch · Panadería · Catering · Mayoreo ·';

  const handleQuadrantNavigate = (target: string) => {
    if (target.startsWith('#menu:')) {
      const tab = target.replace('#menu:', '') as MenuSectionKey;
      if (['bebidas', 'brunch', 'comida', 'panaderia'].includes(tab)) {
        setMenuTab(tab);
      }
      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const id = target.replace(/^#/, '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F9F6F1] text-[#1A1714]">
      <Navbar
        brandName={brand.name}
        isPreviewMode={viewMode === 'preview'}
        onExitPreview={() => setViewMode('client')}
        onOpenAdmin={() => setViewMode('admin')}
      />

      {/* Full-Bleed Editorial Hero (creto.mx style) */}
      <section className="relative min-h-[78vh] w-full overflow-hidden bg-[#1A1714]">
        <img
          src={brand.heroImage}
          alt={brand.name}
          className="absolute inset-0 h-full w-full object-cover opacity-65 transition-transform duration-700"
          style={{
            objectPosition: brand.heroPosition || '50% 50%',
            transform: `scale(${brand.heroZoom ?? 1})`,
            transformOrigin: brand.heroPosition || '50% 50%',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/85 via-[#1A1714]/35 to-[#1A1714]/30" />

        <div className="animate-fade-up relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              <PawPrint className="h-3.5 w-3.5 text-[#E8B48A]" />
              <span>{brand.heroBadge}</span>
            </div>

            <h1 className="font-display mt-5 text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-7xl">
              {brand.heroTitle}
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              {brand.heroSubtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a
                href="#menu"
                className="inline-flex items-center gap-2 rounded-full bg-[#F9F6F1] px-7 py-3.5 text-sm font-semibold text-[#1A1714] transition hover:bg-[#E8B48A]"
              >
                Ver Menú
                <ArrowDownRight className="h-4 w-4" />
              </a>
              <a
                href="#mayoreo"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-xs transition hover:bg-white/20"
              >
                Mayoreo & Catering
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#E8B48A]" />
                {brand.address}
              </span>
              <a
                href={brand.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-white hover:text-[#E8B48A]"
              >
                <Instagram className="h-3.5 w-3.5 text-[#E8B48A]" />
                {brand.instagramHandle}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Marquee Ticker */}
      <div className="overflow-hidden border-y border-[#E2D9CB] bg-[#1A1714] py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-[#F9F6F1]">
        <div className="animate-marquee">
          <span className="px-4">{marqueeChunk}</span>
          <span className="px-4">{marqueeChunk}</span>
          <span className="px-4">{marqueeChunk}</span>
          <span className="px-4">{marqueeChunk}</span>
        </div>
      </div>

      {/* 2x2 Split Quadrants (nuvo-cafe style) */}
      <QuadrantsSection
        quadrants={activeData.quadrants || []}
        onNavigateTarget={handleQuadrantNavigate}
      />

      {/* Editorial Story Strip */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="grid gap-6 rounded-3xl border border-[#E5DDD0] bg-white p-8 sm:p-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C67D4E]">
              Nuestra Esencia
            </span>
            <h2 className="font-display mt-2 text-3xl font-semibold text-[#1A1714] sm:text-4xl">
              {brand.storyTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5C4D40] sm:text-base">
              {brand.storyText}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:col-span-5">
            <div className="rounded-2xl bg-[#F9F6F1] p-4">
              <p className="font-display text-xl font-semibold text-[#1A1714]">Centinela</p>
              <p className="mt-1 text-xs text-[#6B5B4D]">Limonada + Espresso</p>
            </div>
            <div className="rounded-2xl bg-[#F9F6F1] p-4">
              <p className="font-display text-xl font-semibold text-[#1A1714]">Salty Latte</p>
              <p className="mt-1 text-xs text-[#6B5B4D]">Soya, sal rosa & miel</p>
            </div>
            <div className="rounded-2xl bg-[#F9F6F1] p-4">
              <p className="font-display text-xl font-semibold text-[#1A1714]">Matcha A</p>
              <p className="mt-1 text-xs text-[#6B5B4D]">Ceremonial japonés</p>
            </div>
            <div className="rounded-2xl bg-[#F9F6F1] p-4">
              <p className="font-display text-xl font-semibold text-[#1A1714]">Panadería</p>
              <p className="mt-1 text-xs text-[#6B5B4D]">Horneado cada mañana</p>
            </div>
          </div>
        </div>
      </section>

      <MenuSection
        menu={activeData.menu}
        activeTab={menuTab}
        onTabChange={setMenuTab}
      />

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
