import { Calendar, Clock, Instagram, MapPin, PawPrint, Lock } from 'lucide-react';
import type { BrandConfig, NewsItem } from '../types/site';

interface NewsAndFooterProps {
  novedades: NewsItem[];
  brand: BrandConfig;
  updatedAt: string;
  onOpenAdmin: () => void;
}

export function NewsAndFooter({
  novedades,
  brand,
  updatedAt,
  onOpenAdmin,
}: NewsAndFooterProps) {
  const activeNews = novedades.filter((n) => n.active);
  const gallery = brand.galleryImages || [];

  return (
    <>
      {/* Novedades */}
      <section id="novedades" className="bg-[#F9F6F1] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C67D4E]">
                De Temporada & Eventos
              </span>
              <h2 className="font-display mt-2 text-4xl font-semibold text-[#1A1714] sm:text-5xl">
                Novedades en Moulú
              </h2>
            </div>
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1A1714] hover:text-[#C67D4E] transition"
            >
              <Instagram className="h-4 w-4" />
              Síguenos en {brand.instagramHandle}
            </a>
          </div>

          {activeNews.length === 0 ? (
            <p className="rounded-2xl border border-[#E5DDD0] bg-white p-6 text-sm text-[#6B5B4D]">
              Pronto anunciaremos nuevas bebidas y eventos de temporada.
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {activeNews.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between rounded-2xl border border-[#E5DDD0] bg-white p-6 shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-[#C67D4E]/15 px-3 py-0.5 text-xs font-semibold text-[#9E592E]">
                        {item.badge || 'Novedad'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-[#8C7A68]">
                        <Calendar className="h-3.5 w-3.5" />
                        {item.date}
                      </span>
                    </div>
                    <h3 className="font-display mt-4 text-2xl font-semibold text-[#1A1714]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#6B5B4D]">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* "Sigue tu antojo" Instagram Gallery Strip (creto.mx style) */}
      {gallery.length > 0 && (
        <section className="border-t border-[#E5DDD0] bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C67D4E]">
                  {brand.instagramHandle}
                </span>
                <h2 className="font-display mt-1 text-3xl font-semibold text-[#1A1714] sm:text-4xl">
                  Sigue tu antojo
                </h2>
              </div>
              <a
                href={brand.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#D8CEC0] px-5 py-2 text-xs font-semibold text-[#1A1714] transition hover:border-[#1A1714]"
              >
                <Instagram className="h-3.5 w-3.5" />
                Ir a Instagram
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {gallery.map((imgUrl, idx) => (
                <a
                  key={idx}
                  href={brand.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-[#F2ECE2]"
                >
                  <img
                    src={imgUrl}
                    alt={`Moulú Café galería ${idx + 1}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Visitanos & Footer */}
      <footer id="visitanos" className="border-t border-[#E5DDD0] bg-[#1A1714] py-16 text-[#F9F6F1]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h3 className="font-display text-3xl font-semibold text-white">
                {brand.name}
              </h3>
              <p className="mt-2 text-sm text-[#C4B7A6]">{brand.tagline}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-[#EFE7DA]">
                <PawPrint className="h-3.5 w-3.5 text-[#E0A97E]" />
                {brand.petFriendlyNote}
              </div>
            </div>

            <div className="space-y-3 text-sm text-[#D8CEC0]">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E0A97E]" />
                <div>
                  <p className="font-medium text-white">{brand.address}</p>
                  <p className="text-[#C4B7A6]">{brand.city}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#E0A97E]" />
                <p>{brand.hours}</p>
              </div>
            </div>

            <div className="flex flex-col items-start justify-between gap-4 md:items-end">
              <a
                href={brand.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/20"
              >
                <Instagram className="h-4 w-4" />
                {brand.instagramHandle}
              </a>

              <div className="flex items-center gap-4 text-xs text-[#A89A8B]">
                <span>Actualizado: {updatedAt}</span>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1 underline-offset-4 hover:text-white hover:underline cursor-pointer"
                >
                  <Lock className="h-3 w-3" />
                  Administrar sitio
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
