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

  return (
    <>
      {/* Novedades */}
      <section id="novedades" className="border-t border-[#E5DDD0] bg-[#F6F0E6] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C67D4E]">
                De Temporada & Eventos
              </span>
              <h2 className="font-display mt-2 text-4xl font-semibold text-[#231B15] sm:text-5xl">
                Novedades en Moulú
              </h2>
            </div>
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#231B15] hover:text-[#C67D4E] transition"
            >
              <Instagram className="h-4 w-4" />
              Síguenos en {brand.instagramHandle}
            </a>
          </div>

          {activeNews.length === 0 ? (
            <p className="rounded-2xl border border-[#E5DDD0] bg-white/70 p-6 text-sm text-[#6B5B4D]">
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
                    <h3 className="font-display mt-4 text-2xl font-semibold text-[#231B15]">
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

      {/* Visitanos & Footer */}
      <footer id="visitanos" className="border-t border-[#E5DDD0] bg-[#FAF6F0] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h3 className="font-display text-3xl font-semibold text-[#231B15]">
                {brand.name}
              </h3>
              <p className="mt-2 text-sm text-[#6B5B4D]">{brand.tagline}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#EFE7DA] px-3.5 py-1.5 text-xs font-medium text-[#4A3D33]">
                <PawPrint className="h-3.5 w-3.5 text-[#C67D4E]" />
                {brand.petFriendlyNote}
              </div>
            </div>

            <div className="space-y-3 text-sm text-[#4A3D33]">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C67D4E]" />
                <div>
                  <p className="font-medium text-[#231B15]">{brand.address}</p>
                  <p className="text-[#6B5B4D]">{brand.city}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#C67D4E]" />
                <p>{brand.hours}</p>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end justify-between gap-4">
              <a
                href={brand.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#D8CEC0] bg-white px-5 py-2.5 text-sm font-medium text-[#231B15] transition hover:border-[#C67D4E] hover:text-[#C67D4E]"
              >
                <Instagram className="h-4 w-4" />
                {brand.instagramHandle}
              </a>

              <div className="flex items-center gap-4 text-xs text-[#8C7A68]">
                <span>Actualizado: {updatedAt}</span>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1 underline-offset-4 hover:text-[#231B15] hover:underline cursor-pointer"
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
