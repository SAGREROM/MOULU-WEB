import { useEffect, useState } from 'react';
import { Calendar, Clock, Instagram, MapPin, PawPrint, X } from 'lucide-react';
import type { BrandConfig, GalleryPhoto, NewsItem } from '../types/site';
import { Reveal } from './Reveal';

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
}: NewsAndFooterProps) {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [liveFeedPhotos, setLiveFeedPhotos] = useState<GalleryPhoto[] | null>(null);

  useEffect(() => {
    const feedUrl = brand.instagramFeedUrl?.trim();
    if (!feedUrl) {
      setLiveFeedPhotos(null);
      return;
    }
    fetch(feedUrl)
      .then((res) => (res.ok ? res.json() : null))
      .then((json: unknown) => {
        const posts = Array.isArray(json)
          ? json
          : (json as { posts?: unknown[] })?.posts;
        if (!Array.isArray(posts)) return;
        const mapped: GalleryPhoto[] = posts
          .slice(0, 8)
          .map((p, idx) => {
            const post = p as {
              id?: string;
              mediaUrl?: string;
              thumbnailUrl?: string;
              sizes?: { medium?: { mediaUrl?: string }; large?: { mediaUrl?: string } };
              permalink?: string;
            };
            const url =
              post.sizes?.medium?.mediaUrl ||
              post.sizes?.large?.mediaUrl ||
              post.thumbnailUrl ||
              post.mediaUrl ||
              '';
            return {
              id: post.id || `ig-${idx}`,
              url,
              position: '50% 50%',
              zoom: 1,
            };
          })
          .filter((p) => Boolean(p.url));
        if (mapped.length > 0) {
          setLiveFeedPhotos(mapped);
        }
      })
      .catch(() => {
        // Fallback to static gallery if feed fails
      });
  }, [brand.instagramFeedUrl]);

  const activeNews = novedades.filter((n) => n.active);
  const staticGallery: GalleryPhoto[] =
    brand.galleryPhotos && brand.galleryPhotos.length > 0
      ? brand.galleryPhotos
      : (brand.galleryImages || []).map((url, idx) => ({
          id: `gal-${idx}`,
          url,
          position: '50% 50%',
          zoom: 1,
        }));
  const gallery = liveFeedPhotos ?? staticGallery;

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
              {gallery.map((photo, idx) => (
                <Reveal key={photo.id} delayMs={Math.min(idx * 50, 200)}>
                  <button
                    type="button"
                    onClick={() => setLightboxUrl(photo.url)}
                    className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F2ECE2] cursor-pointer"
                  >
                    <img
                      src={photo.url}
                      alt={`Moulú Café galería ${idx + 1}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      style={{
                        objectPosition: photo.position || '50% 50%',
                        transform: `scale(${photo.zoom ?? 1})`,
                        transformOrigin: photo.position || '50% 50%',
                      }}
                    />
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
        >
          <button
            type="button"
            onClick={() => setLightboxUrl(null)}
            aria-label="Cerrar imagen"
            className="absolute top-4 right-4 rounded-full bg-white/15 p-2 text-white hover:bg-white/25 cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={lightboxUrl}
            alt="Vista ampliada"
            className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
          />
        </div>
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
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
