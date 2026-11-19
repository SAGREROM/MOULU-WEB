import { useState } from 'react';
import { Check, Copy, ExternalLink, Gift, Star } from 'lucide-react';
import type { ReviewRewardConfig } from '../types/site';
import { Reveal } from './Reveal';

interface ReviewRewardSectionProps {
  config?: ReviewRewardConfig;
}

interface SavedCoupon {
  code: string;
  name: string;
  stars: number;
  createdAt: string;
}

const COUPON_STORAGE_KEY = 'moulu_review_coupon_v1';

function generateCouponCode(prefix: string): string {
  const cleanPrefix = (prefix || 'MOULU').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${cleanPrefix}-${rand}`;
}

export function ReviewRewardSection({ config }: ReviewRewardSectionProps) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [copied, setCopied] = useState(false);
  const [openedMaps, setOpenedMaps] = useState(false);
  const [coupon, setCoupon] = useState<SavedCoupon | null>(() => {
    try {
      const raw = localStorage.getItem(COUPON_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedCoupon) : null;
    } catch {
      return null;
    }
  });

  if (!config || !config.enabled) return null;

  const handleCopyText = async () => {
    if (!comment.trim()) return;
    try {
      await navigator.clipboard.writeText(comment.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard errors in restricted browsers
    }
  };

  const handleClaimCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    const nextCoupon: SavedCoupon = {
      code: generateCouponCode(config.couponPrefix),
      name: customerName.trim(),
      stars,
      createdAt: new Date().toLocaleDateString('es-MX'),
    };
    localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(nextCoupon));
    setCoupon(nextCoupon);
  };

  return (
    <section id="resena" className="border-t border-[#E5DDD0] bg-[#FAF6F0] py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-[#DFD4C3] bg-white shadow-xs">
            <div className="grid lg:grid-cols-12">
              {/* Left info */}
              <div className="flex flex-col justify-between bg-[#B55E2E] p-8 text-white sm:p-10 lg:col-span-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                    <Gift className="h-3.5 w-3.5" />
                    Recompensa Moulú
                  </span>
                  <h2 className="font-display mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                    {config.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/90">
                    {config.subtitle}
                  </p>
                </div>

                <div className="mt-8 rounded-2xl bg-[#1A1714]/25 p-4 backdrop-blur-xs">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#DFBE99]">
                    Tu regalo al publicar tu reseña:
                  </p>
                  <p className="font-display mt-1 text-2xl font-semibold text-white">
                    {config.rewardText}
                  </p>
                </div>
              </div>

              {/* Right interactive steps or coupon */}
              <div className="p-8 sm:p-10 lg:col-span-7">
                {coupon ? (
                  <div className="flex h-full flex-col justify-center text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="h-6 w-6" />
                    </div>
                    <h3 className="font-display mt-4 text-3xl font-semibold text-[#1A1714]">
                      ¡Gracias por tu reseña, {coupon.name}!
                    </h3>
                    <p className="mt-2 text-sm text-[#6B5B4D]">
                      Muestra este código en barra junto con tu reseña en Google Maps:
                    </p>

                    <div className="mx-auto mt-5 w-full max-w-sm rounded-2xl border-2 border-dashed border-[#C67D4E] bg-[#FAF6F0] p-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#9E592E]">
                        Código de regalo
                      </p>
                      <p className="mt-1 font-mono text-3xl font-bold tracking-wider text-[#1A1714]">
                        {coupon.code}
                      </p>
                      <p className="mt-2 text-sm font-medium text-[#4A3D33]">
                        {config.rewardText}
                      </p>
                      <p className="mt-1 text-[11px] text-[#8C7A68]">
                        Generado el {coupon.createdAt}
                      </p>
                    </div>

                    <p className="mt-4 text-xs text-[#7A6858]">{config.terms}</p>
                  </div>
                ) : (
                  <form onSubmit={handleClaimCoupon} className="space-y-5">
                    {/* Step 1 */}
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#C67D4E]">
                        Paso 1 • Califica y escribe tu experiencia
                      </span>
                      <div className="mt-2 flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setStars(n)}
                            aria-label={`${n} estrellas`}
                            className="p-1 transition hover:scale-110 cursor-pointer"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                n <= stars
                                  ? 'fill-[#E5A93B] text-[#E5A93B]'
                                  : 'text-[#D8CEC0]'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <textarea
                        rows={2}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Ej. Me encantó el Centinela y los chilaquiles, súper ambiente pet-friendly..."
                        className="mt-2 w-full rounded-xl border border-[#D8CEC0] px-3.5 py-2.5 text-sm text-[#1A1714] outline-none focus:border-[#C67D4E]"
                      />
                      {comment.trim() && (
                        <button
                          type="button"
                          onClick={handleCopyText}
                          className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-[#9E592E] hover:underline cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3.5 w-3.5" /> Texto copiado
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" /> Copiar texto para pegarlo en Google Maps
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Step 2 */}
                    <div className="border-t border-[#EFE7DA] pt-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#C67D4E]">
                        Paso 2 • Publica tu reseña en Google Maps
                      </span>
                      <div className="mt-2">
                        <a
                          href={config.googleMapsReviewUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setOpenedMaps(true)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#1A1714] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#C67D4E]"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Abrir Google Maps para dejar reseña
                        </a>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="border-t border-[#EFE7DA] pt-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#C67D4E]">
                        Paso 3 • Reclama tu cupón
                      </span>
                      <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Tu nombre"
                          className="flex-1 rounded-full border border-[#D8CEC0] px-4 py-2 text-sm outline-none focus:border-[#C67D4E]"
                        />
                        <button
                          type="submit"
                          disabled={!openedMaps}
                          title={
                            openedMaps
                              ? 'Generar cupón'
                              : 'Primero abre Google Maps en el Paso 2'
                          }
                          className="rounded-full bg-[#B55E2E] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#9B4E23] disabled:opacity-45 cursor-pointer disabled:cursor-not-allowed"
                        >
                          Obtener mi regalo
                        </button>
                      </div>
                      {!openedMaps && (
                        <p className="mt-1.5 text-[11px] text-[#8C7A68]">
                          Primero abre Google Maps en el Paso 2 para habilitar tu cupón.
                        </p>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
